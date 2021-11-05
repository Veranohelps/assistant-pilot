import { Knex } from 'knex';
import { DatabaseConstraints } from '../database.constraint';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Waypoint', (table) => {
    table.string('gFingerprint', 100).notNullable().defaultTo('');
  });

  // update fingerprints
  await knex('Waypoint').update({
    gFingerprint: knex.raw(
      `st_x(coordinate::geometry)::text || '_' || st_y(coordinate::geometry)::text || '_' || st_z(coordinate::geometry)::text`,
    ) as any,
  });

  // delete duplicate waypoints,
  const uniqueWaypoints = await knex('Waypoint')
    .select('id', 'gFingerprint')
    .distinctOn('gFingerprint')
    .orderBy('gFingerprint')
    .orderBy('createdAt', 'desc')
    .then((res) => res.map((w) => w.id));
  await knex('Waypoint').whereNotIn('id', uniqueWaypoints).del();

  // create unique indexes
  // because userId is nullable (dersu routes), we'll have to create a
  // partial index for when userId is null so that this constraint
  // is respected for dersu waypoints
  await knex.schema.alterTable('Waypoint', (table) => {
    table.string('gFingerprint', 100).notNullable().alter();
    table.unique(['userId', 'gFingerprint'], {
      indexName: DatabaseConstraints.WAYPOINT_USER_ID_G_FINGERPRINT_UNIQUE_1,
    });
  });
  await knex.raw('create unique index ?? on ?? (??) where ?? is null', [
    DatabaseConstraints.WAYPOINT_USER_ID_G_FINGERPRINT_UNIQUE_2,
    'Waypoint',
    'gFingerprint',
    'userId',
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('Waypoint', (table) => {
    table.dropUnique(
      ['userId', 'gFingerprint'],
      DatabaseConstraints.WAYPOINT_USER_ID_G_FINGERPRINT_UNIQUE_1,
    );
    table.dropUnique(['gFingerprint'], DatabaseConstraints.WAYPOINT_USER_ID_G_FINGERPRINT_UNIQUE_2);
    table.dropColumn('gFingerprint');
  });
}
