import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sizeOf from 'image-size';
import imageType from 'image-type';
import path from 'path';
import { v4 } from 'uuid';
import { ErrorCodes } from '../errors/error-codes';
import { BadRequestError, ServerError } from '../errors/http.error';

@Injectable()
export class GcpService {
  constructor(/*private storage: Storage,*/ private configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File) {
    this.checkImage(file);

    const type = imageType(file.buffer);
    const extension = type?.mime == 'image/jpeg' ? 'jpg' : 'png';
    const uuid = v4();
    const fileName = `${uuid}.${extension}`;

    const storage = new Storage();
    const bucketName = this.configService.get('PROFILE_IMAGES_BUCKET_NAME');
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

  async deleteFile(fileName: string) {
    const storage = new Storage();
    const bucketName = this.configService.get('PROFILE_IMAGES_BUCKET_NAME');
    const bucket = storage.bucket(bucketName);
    await bucket
      .file(fileName)
      .delete()
      .catch((err) => {
        console.error(err.message);
        throw new ServerError(ErrorCodes.SERVER_ERROR, 'Something went wrong');
      });
  }
  async deleteAvatar(avatarUrl: string | null) {
    const currentAvatarFileName = avatarUrl ? path.basename(avatarUrl) : null;

    if (avatarUrl != null && currentAvatarFileName != null && this.isGcpFile(avatarUrl)) {
      await this.deleteFile(currentAvatarFileName);
    } else {
      console.info(
        `Current avatar is empty or not GCP, ignoring deletion from storage: ${avatarUrl}`,
      );
    }
  }

  isGcpFile(fileUrl: string): boolean {
    return fileUrl.match(/storage\.googleapis\.com/i) ? true : false;
  }

  checkImage(file: Express.Multer.File) {
    const mimetype = file.mimetype.toLowerCase();
    if (mimetype != 'image/jpeg' && mimetype != 'image/jpg' && mimetype != 'image/png') {
      throw new BadRequestError(
        ErrorCodes.INVALID_MIME_TYPE,
        'MimeType must be: image/jpeg, image/jpg or image/png',
      );
    }

    //checks the real type
    const actualType = imageType(file.buffer);
    const actualMimeType = actualType?.mime.toLowerCase();
    if (
      actualMimeType != 'image/jpeg' &&
      actualMimeType != 'image/jpg' &&
      actualMimeType != 'image/png'
    ) {
      throw new BadRequestError(
        ErrorCodes.INVALID_MIME_TYPE,
        'MimeType must be: image/jpeg, image/jpg or image/png',
      );
    }

    if (file.size > 1024 * 1024) {
      throw new BadRequestError(ErrorCodes.INVALID_IMAGE_SIZE, 'File size must not exceed 1Mb');
    }

    const dimensions = sizeOf(file.buffer);
    if (
      dimensions &&
      dimensions.height &&
      dimensions.width &&
      (dimensions.width > 512 || dimensions.height > 512)
    ) {
      throw new BadRequestError(
        ErrorCodes.INVALID_IMAGE_DIMENSIONS,
        'Image size must not exceed 512 x 512',
      );
    }
  }
}
