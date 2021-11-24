import { Knex } from 'knex';
import internal, { Writable } from 'stream';

type TArrayExtract<T> = T extends (infer I)[] ? I : T;

export const createKnexStream = async <TResult>(
  builder: Knex.ChainableInterface<TResult>,
  callback: (chunk: TArrayExtract<TResult>[]) => Promise<void>,
  options?: Omit<internal.WritableOptions, 'write'>,
) => {
  const opts: internal.WritableOptions = {
    highWaterMark: 1000,
    objectMode: true,
    ...(options && options),
  };

  let bucket: TArrayExtract<TResult>[] = [];

  const writable = new Writable({
    highWaterMark: 1000,
    objectMode: true,
    write: (chunk: TArrayExtract<TResult>, encoding, next) => {
      bucket.push(chunk);

      if (bucket.length === opts.highWaterMark) {
        callback(bucket).then(() => {
          bucket = [];
          next();
        });
      } else {
        next();
      }
    },
  });

  const stream = builder.stream({ highWaterMark: opts.highWaterMark }).pipe(writable);

  await new Promise((res, rej) => {
    stream.on('close', () => {
      if (bucket.length > 0) {
        callback(bucket).then(res);
      } else {
        res(null);
      }
    });
    stream.on('error', rej);
  });
};
