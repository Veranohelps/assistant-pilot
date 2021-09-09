import { Knex } from 'knex';
import { knexClient } from '../../database/knex/client.knex';

export class TransactionManager {
  private rollbacks: (() => Promise<any>)[];
  private commits: VoidFunction[];
  private _ktx?: Knex.Transaction;
  private hasCommitted: boolean;

  constructor() {
    this.rollbacks = [];
    this.commits = [];
    this._ktx = undefined;
    this.hasCommitted = false;
  }

  async init() {
    this._ktx = await knexClient.transaction(null, {
      isolationLevel: 'read committed',
    });
  }

  async run<T>(
    prom: Promise<T> | ((tx: TransactionManager) => Promise<T>),
    rollback?: (res: T) => Promise<any> | null,
    commit?: VoidFunction,
  ) {
    if (commit) {
      this.commits.push(commit);
    }

    try {
      const res = typeof prom === 'function' ? await prom(this) : await prom;

      if (rollback) {
        this.rollbacks.push(() => rollback?.(res) ?? Promise.resolve());
      }

      await this.commit();

      return res;
    } catch (error) {
      await this.rollback();

      throw error;
    }
  }

  async addRun<T>(
    prom: Promise<T> | ((tx: TransactionManager) => Promise<T>),
    rollback?: (res: T) => Promise<any> | null,
    commit?: VoidFunction,
  ) {
    if (commit) {
      this.commits.push(commit);
    }

    const res = typeof prom === 'function' ? await prom(this) : await prom;

    if (rollback) {
      this.rollbacks.push(() => rollback?.(res) ?? Promise.resolve());
    }

    return res;
  }

  get knx() {
    return this;
  }

  get ktx() {
    if (!this._ktx) {
      throw new Error(`knex transaction not initialized`);
    }

    return this._ktx;
  }

  async rollback() {
    await this._ktx?.rollback();

    let i = this.rollbacks.length - 1;

    while (i >= 0) {
      await this.rollbacks[i]();

      i -= 1;
    }

    return true;
  }

  async commit() {
    // will be used until "tx.run" is fully deprecated
    if (this.hasCommitted) return;

    this.hasCommitted = true;

    await this._ktx?.commit();

    let i = this.commits.length - 1;

    while (i >= 0) {
      this.commits[i]();

      i -= 1;
    }

    return true;
  }

  addCommit(cb: VoidFunction) {
    this.commits.push(cb);
  }
}
