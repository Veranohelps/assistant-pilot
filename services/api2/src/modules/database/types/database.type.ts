export interface IDefaultMeta {
  [k: string]: unknown;
}

export interface IDBTimestamps {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
