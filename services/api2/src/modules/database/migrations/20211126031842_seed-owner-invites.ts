import { Knex } from 'knex';
import { EExpeditionInviteStatus } from '../../expedition/types/expedition-user.type';

export async function up(knex: Knex): Promise<void> {
  const expeditions = await knex('Expedition');

  if (expeditions.length) {
    await knex('ExpeditionUser').insert(
      expeditions
        .filter((e) => !!e.userId)
        .map((e) => ({
          expeditionId: e.id,
          userId: e.userId as string,
          inviteStatus: EExpeditionInviteStatus.ACCEPTED,
          isOwner: true,
        })),
    );
  }
}

export async function down(): Promise<void> {
  return;
}
