import { Inject } from '@nestjs/common';
import { IDatabaseTables } from '../types/tables.type';

export function InjectKnexClient(entity: keyof IDatabaseTables) {
  return Inject(entity);
}
