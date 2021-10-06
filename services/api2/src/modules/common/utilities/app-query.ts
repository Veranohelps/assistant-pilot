import { cloneDeep, merge } from 'lodash';

type TFilterCallback<T> = (val: T) => void;

export class AppQuery<T = Record<string, unknown>> {
  query!: T;

  constructor(query: T) {
    this.query = merge(cloneDeep(query), query);
  }

  withFilter<K extends keyof T>(
    key: K,
    callback: TFilterCallback<T[K]>,
    elseCallback?: VoidFunction,
  ) {
    const value = this.query[key];

    if (!value) {
      elseCallback?.();

      return this;
    }

    callback(value);

    return this;
  }

  hasFilter(key: keyof T) {
    const value = this.query[key];

    if (!value) return false;

    return true;
  }
}
