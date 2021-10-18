import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../modules/app.module';
import { knexClient } from '../modules/database/knex/init-knex';

export async function BootstrapTest(
  extend?: (builder: TestingModuleBuilder) => TestingModuleBuilder,
): Promise<TestingModule> {
  let testModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  if (extend) {
    testModuleBuilder = extend(testModuleBuilder);
  }

  const module: TestingModule = await testModuleBuilder.compile();

  // truncate all tables
  await knexClient.raw(`
  DO $$ DECLARE
    r RECORD;
  BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(r.tablename) || ' ' || 'CASCADE';
    END LOOP;
  END $$;
  `);

  return module;
}
