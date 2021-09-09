import dottie from 'dottie';
import { Knex } from 'knex';
import { DatabaseError } from '../../common/errors/database.error';
import { entityMap } from '../database.entity';
import { IDatabaseTables } from '../types/tables.type';
import { knexClient } from './client.knex';

const nest = (data: any) => {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map((d) => dottie.transform(d));
  }

  return dottie.transform(data);
};

const beforeUpdate = (builder: any) => {
  if (builder._method !== 'update') return;

  const entity = entityMap[builder._single.table as keyof IDatabaseTables];

  if (entity?.columns?.updatedAt) {
    builder.update({ updatedAt: new Date() });
  }
};

const beforeInsert = (builder: any) => {
  if (builder._method !== 'insert') return;

  const columns = entityMap[builder._single.table as keyof IDatabaseTables]?.columns ?? {};
  const rows = [].concat(builder._single.insert);

  rows.forEach((row: Record<string, any>) => {
    Object.keys(columns).forEach((col) => {
      row[col] = row[col] ?? columns[col].defaults?.insert?.(row, builder) ?? undefined;

      if (columns[col].type === 'json') {
        row[col] = JSON.stringify(row[col]);
      }
    });
  });
};

const beforeSelect = (builder: any) => {
  if (!(builder._method === 'select' || builder._method === 'first')) return;

  const { hooks } = entityMap[builder._single.table as keyof IDatabaseTables];

  hooks?.beforeSelect?.(builder, knexClient);
};

export const attachKnexListeners = (client: Knex.QueryBuilder) => {
  let builder: Knex.QueryBuilder;

  client
    .on('start', function (qb: any) {
      builder = qb;

      beforeUpdate(builder);
      beforeInsert(builder);
      beforeSelect(builder);
    })
    .on('query-response', (response: any) => {
      response = nest(response);

      return response;
    })
    .on('query-error', (error: any) => {
      const { insert, update } = (builder as any)._single;
      const data = insert ?? update;

      throw new DatabaseError(error.constraint, builder, data, error);
    });
};
