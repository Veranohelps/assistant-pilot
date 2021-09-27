import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('User', (table) => {
    table.string('id', 50).primary({ constraintName: DatabaseConstraints.USER_PKEY });
    table
      .string('auth0Id', 50)
      .notNullable()
      .unique({ indexName: DatabaseConstraints.USER_AUTH0ID_UNIQUE });
    table
      .string('email', 255)
      .notNullable()
      .unique({ indexName: DatabaseConstraints.USER_EMAIL_UNIQUE });
    table.string('firstName', 255).nullable();
    table.string('lastName', 255).nullable();
    table.string('otherName', 255).nullable();
    table.boolean('isRegistrationFinished').notNullable().defaultTo(false);
    table.boolean('isSubscribedToNewsletter').notNullable().defaultTo(false);
    table.text('avatar').nullable();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('User');
}
