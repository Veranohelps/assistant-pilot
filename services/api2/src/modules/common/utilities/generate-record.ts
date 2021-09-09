export type TGetId<T, R extends string = string> = (item: T) => R | undefined;
export type TGetValue<T, R = T> = (item: T) => R | undefined;
export type TRecord<T> = Record<string, T>;
export type TGroupRecord<T, R extends string = string> = Record<R, T[]>;

export function generateRecord<T>(items: T[], getKey: TGetId<T>): Record<string, T>;
export function generateRecord<T, R>(
  items: T[],
  getKey: TGetId<T>,
  getValue: TGetValue<T, R>,
): Record<string, R>;
export function generateRecord<T, R = T>(
  items: T[],
  getKey: TGetId<T>,
  getValue?: TGetValue<T, R>,
): Record<string, T | R> {
  const records: TRecord<T | R> = {};

  for (let i = 0; i < items.length; i += 1) {
    const key = getKey(items[i]);

    if (key) {
      const value = getValue ? getValue(items[i]) : items[i];

      if (value) {
        records[key] = value;
      }
    }
  }

  return records;
}

export function generateGroupRecord<T, K extends string>(
  items: T[],
  getKey: TGetId<T, K>,
): TGroupRecord<T, K>;
export function generateGroupRecord<T, K extends string, R>(
  items: T[],
  getKey: TGetId<T, K>,
  getValue: TGetValue<T, R>,
): TGroupRecord<R, K>;
export function generateGroupRecord<T, K extends string, R>(
  items: T[],
  getId: TGetId<T, K>,
  getValue?: TGetValue<T, R>,
): TGroupRecord<T | R, K> {
  const records = {} as Record<K, (T | R)[]>;

  for (let i = 0; i < items.length; i += 1) {
    const key = getId(items[i]);

    if (key) {
      records[key] = records[key] ?? [];

      const item = getValue ? getValue(items[i]) : items[i];

      if (item) {
        records[key].push(item);
      }
    }
  }

  return records;
}

export function reduceRecord<R>(
  items: string[],
  getValue: TGetValue<string, R>,
): Record<string, R> {
  const records: TRecord<R> = {};

  for (let i = 0; i < items.length; i += 1) {
    const key = items[i];
    const value = getValue(key);

    if (value) {
      records[key] = value;
    }
  }

  return records;
}

export function generateRecord2<T>(getKey: TGetId<T>): (items: T[]) => Record<string, T>;
export function generateRecord2<T, R>(
  getKey: TGetId<T>,
  getValue: TGetValue<T, R>,
): (items: T[]) => Record<string, R>;
export function generateRecord2<T, R>(getKey: TGetId<T>, getValue?: TGetValue<T, R>) {
  return (items: T[]) => {
    if (getValue) return generateRecord(items, getKey, getValue);

    return generateRecord(items, getKey);
  };
}

export function generateGroupRecord2<T, K extends string>(
  getKey: TGetId<T, K>,
): (items: T[]) => TGroupRecord<T, K>;
export function generateGroupRecord2<T, K extends string, R>(
  getKey: TGetId<T, K>,
  getValue: TGetValue<T, R>,
): (items: T[]) => TGroupRecord<R, K>;
export function generateGroupRecord2<T, K extends string, R>(
  getKey: TGetId<T, K>,
  getValue?: TGetValue<T, R>,
) {
  return (items: T[]) => {
    if (getValue) return generateGroupRecord(items, getKey, getValue);

    return generateGroupRecord(items, getKey);
  };
}
