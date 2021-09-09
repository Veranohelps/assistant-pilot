import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { KnexClient } from './knex/client.knex';
import { IDatabaseTables } from './types/tables.type';

@Module({
  providers: [DatabaseService],
})
export class DatabaseModule {
  static forFeature(entityNames: (keyof IDatabaseTables)[]): DynamicModule {
    const providers: Provider[] = [];
    const exports: Provider[] = [];

    entityNames.forEach((entity) => {
      providers.push({
        provide: entity,
        useFactory: () => new KnexClient(entity),
      });
      exports.push({
        provide: entity,
        useClass: KnexClient,
      });
    });

    return {
      module: DatabaseModule,
      providers,
      exports,
    };
  }
}
