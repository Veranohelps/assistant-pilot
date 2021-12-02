import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import mime from 'mime-types';
import { nanoid } from 'nanoid';
import path from 'path';
import { ErrorCodes } from '../errors/error-codes';
import { ServerError } from '../errors/http.error';
import { TransactionManager } from '../utilities/transaction-manager';

@Injectable()
export class GcpUploadService {
  private async save(bucketName: string, file: Express.Multer.File): Promise<string> {
    const identifier = nanoid();
    const extension = mime.extension(file.mimetype);
    const fileName = extension ? `${identifier}.${extension}` : identifier;
    const storage = new Storage();
    const bucket = storage.bucket(bucketName);

    await bucket
      .file(fileName)
      .save(file.buffer, { contentType: file.mimetype })
      .catch((err) => {
        console.error(err.message);
        throw new ServerError(ErrorCodes.SERVER_ERROR, 'Something went wrong');
      });

    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  }

  private async delete(bucketName: string, fileUrl: string): Promise<boolean> {
    const fileName = path.basename(fileUrl);
    const storage = new Storage();
    const bucket = storage.bucket(bucketName);

    await bucket
      .file(fileName)
      .delete()
      .catch((err) => {
        console.error(err.message);
        throw new ServerError(ErrorCodes.SERVER_ERROR, 'Something went wrong');
      });

    return true;
  }

  async uploadFile(
    tx: TransactionManager | null,
    bucketName: string,
    file: Express.Multer.File,
  ): Promise<string> {
    if (tx) {
      return tx.addRun(this.save(bucketName, file), (url) => this.delete(bucketName, url));
    }

    return this.save(bucketName, file);
  }

  async deleteFile(
    tx: TransactionManager | null,
    bucketName: string,
    fileUrl: string,
  ): Promise<boolean> {
    const isOurFile = fileUrl.includes(`storage.googleapis.com/${bucketName}`);

    if (!isOurFile) return false;

    // the best phase to run file deletions is in the commit phase since it can't be undone or rolled back.
    // since commits run after the tx's success, worst case scenario we have an orphaned file in storage
    if (tx) {
      tx.onCommit(() => this.delete(bucketName, fileUrl));

      return true;
    }

    return this.delete(bucketName, fileUrl);
  }
}
