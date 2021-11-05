// simple function to check that all elements in a string[] are keys in a Record<string, unknown>
// this is particularly useful for find all methods that return a Record to check that all provided keys
// are valid

import { SRecord } from '../../../types/helpers.type';

const allExists = <T>(keys: string[], record: SRecord<T>, error: Error) => {
  const isValid = keys.every((key) => record[key] !== undefined);

  if (isValid) return record;

  throw error;
};

export default allExists;
