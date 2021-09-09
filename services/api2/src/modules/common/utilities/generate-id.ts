import { customAlphabet } from 'nanoid';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface IOptions {
  length?: number;
  alphabet?: string;
}

export const generateId = (options?: IOptions): string => {
  return customAlphabet(options?.alphabet ?? alphabet, options?.length ?? 22)();
};
