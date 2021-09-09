import { Knex } from 'knex';
import { DatabaseConstraints } from '../../database/database.constraint';

export class DatabaseError extends Error {
  constraint: DatabaseConstraints;
  original: Error;
  data: any;
  builder: Knex.QueryBuilder;
  name: string;

  constructor(
    constraint: DatabaseConstraints,
    builder: Knex.QueryBuilder,
    data: any,
    original: Error,
  ) {
    super();

    this.constraint = constraint;
    this.original = original;
    this.builder = builder;
    this.data = data;
    this.name = 'DatabaseError';
  }
}
