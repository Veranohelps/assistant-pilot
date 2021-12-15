import { cloneDeep, merge } from 'lodash';

type TFilterCallback<T> = (val: T) => void;

export class AppQuery<T = Record<string, unknown>> {
  query!: T;

  constructor(query: T) {
    this.query = merge(cloneDeep(query), query);
  }

  withFieldValue<K extends keyof T>(
    key: K,
    value: T[K],
    callback: VoidFunction,
    elseCallback?: VoidFunction,
  ) {
    const val = this.query[key];

    if (val !== value) {
      elseCallback?.();
    } else {
      callback();
    }

    return this;
  }

  withField<K extends keyof T>(
    key: K,
    callback: TFilterCallback<Required<T>[K]>,
    elseCallback?: VoidFunction,
  ) {
    const value = this.query[key];

    if (!value) {
      elseCallback?.();

      return this;
    }

    callback(value as Required<T>[K]);

    return this;
  }

  hasField<K extends keyof T>(key: K) {
    const val = this.query[key];

    return val !== undefined;
  }

  fieldEquals<K extends keyof T>(key: K, value: T[K]) {
    const val = this.query[key];

    return val === value;
  }

  static withOptions<T = Record<string, unknown>>(options: T) {
    const query = new AppQuery(options);

    return query;
  }
}
