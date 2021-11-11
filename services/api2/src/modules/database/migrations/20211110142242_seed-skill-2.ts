import { Knex } from 'knex';
import { ISkillCategory } from '../../skill/types/skill-category.type';
import { ISkillLevel } from '../../skill/types/skill-level.type';
import { ISkill } from '../../skill/types/skill.type';

const categories: Partial<ISkillCategory>[] = [
  {
    id: 'nfs',
    name: 'Nivel fisico',
    description: '',
  },
  { id: 'ntc', name: 'Nivel técnico', description: '' },
  { id: 'nde', name: 'Nivel de exposición', description: '' },
];

const skills: Partial<ISkill>[] = [
  // nfs
  {
    id: 'nfs-fsc',
    name: 'Físico',
    description: '',
    categoryId: categories[0].id,
  },

  // ntc
  {
    id: 'ntc-sdr',
    name: 'Senderismo',
    description: '',
    categoryId: categories[1].id,
  },
  {
    id: 'ntc-msn',
    name: 'Montañismo (sin nieve)',
    description: '',
    categoryId: categories[1].id,
  },
  {
    id: 'ntc-acn',
    name: 'Alpinismo (con nieve)',
    description: '',
    categoryId: categories[1].id,
  },
  {
    id: 'ntc-edm',
    name: 'Esquí de montaña',
    description: '',
    categoryId: categories[1].id,
  },
  {
    id: 'ntc-rdn',
    name: 'Raquetas de nieve',
    description: '',
    categoryId: categories[1].id,
  },

  // nde
  {
    id: 'nde-pes',
    name: 'Psicológico/Exposición',
    description: '',
    categoryId: categories[2].id,
  },
];

const levels: Partial<ISkillLevel>[] = [
  // nfs-fsc
  {
    id: 'nfs-fsc-f1',
    level: 1,
    name: 'F1',
    description: '',
    skillId: skills[0].id,
  },
  {
    id: 'nfs-fsc-f2',
    level: 2,
    name: 'F2',
    description: '',
    skillId: skills[0].id,
  },
  {
    id: 'nfs-fsc-f3',
    level: 3,
    name: 'F3',
    description: '',
    skillId: skills[0].id,
  },
  {
    id: 'nfs-fsc-f4',
    level: 4,
    name: 'F4',
    description: '',
    skillId: skills[0].id,
  },
  {
    id: 'nfs-fsc-f5',
    level: 5,
    name: 'F5',
    description: '',
    skillId: skills[0].id,
  },

  // ntc-sdr
  {
    id: 'ntc-sdr-t1',
    level: 1,
    name: 'T1',
    description: '',
    skillId: skills[1].id,
  },
  {
    id: 'ntc-sdr-t2',
    level: 2,
    name: 'T2',
    description: '',
    skillId: skills[1].id,
  },
  {
    id: 'ntc-sdr-t3',
    level: 3,
    name: 'T3',
    description: '',
    skillId: skills[1].id,
  },
  {
    id: 'ntc-sdr-t4',
    level: 4,
    name: 'T4',
    description: '',
    skillId: skills[1].id,
  },
  {
    id: 'ntc-sdr-t5',
    level: 5,
    name: 'T5',
    description: '',
    skillId: skills[1].id,
  },

  // ntc-msn
  {
    id: 'ntc-msn-f',
    level: 1,
    name: 'F',
    description: '',
    skillId: skills[2].id,
  },
  {
    id: 'ntc-msn-pd',
    level: 2,
    name: 'PD',
    description: '',
    skillId: skills[2].id,
  },
  {
    id: 'ntc-msn-ad',
    level: 3,
    name: 'AD',
    description: '',
    skillId: skills[2].id,
  },
  {
    id: 'ntc-msn-d',
    level: 4,
    name: 'D',
    description: '',
    skillId: skills[2].id,
  },
  {
    id: 'ntc-msn-md',
    level: 5,
    name: 'MD',
    description: '',
    skillId: skills[2].id,
  },

  // ntc-acn
  {
    id: 'ntc-acn-f',
    level: 1,
    name: 'F',
    description: '',
    skillId: skills[3].id,
  },
  {
    id: 'ntc-acn-pd',
    level: 2,
    name: 'PD',
    description: '',
    skillId: skills[3].id,
  },
  {
    id: 'ntc-acn-ad',
    level: 3,
    name: 'AD',
    description: '',
    skillId: skills[3].id,
  },
  {
    id: 'ntc-acn-d',
    level: 4,
    name: 'D',
    description: '',
    skillId: skills[3].id,
  },
  {
    id: 'ntc-acn-md',
    level: 5,
    name: 'MD',
    description: '',
    skillId: skills[3].id,
  },

  // ntc-edm
  {
    id: 'ntc-edm-s1',
    level: 1,
    name: 'S1',
    description: '',
    skillId: skills[4].id,
  },
  {
    id: 'ntc-edm-s2',
    level: 2,
    name: 'S2',
    description: '',
    skillId: skills[4].id,
  },
  {
    id: 'ntc-edm-s3',
    level: 3,
    name: 'S3',
    description: '',
    skillId: skills[4].id,
  },
  {
    id: 'ntc-edm-s4',
    level: 4,
    name: 'S4',
    description: '',
    skillId: skills[4].id,
  },
  {
    id: 'ntc-edm-s5',
    level: 5,
    name: 'S5',
    description: '',
    skillId: skills[4].id,
  },

  // ntc-rdn
  {
    id: 'ntc-rdn-r1',
    level: 1,
    name: 'R1',
    description: '',
    skillId: skills[5].id,
  },
  {
    id: 'ntc-rdn-r2',
    level: 2,
    name: 'R2',
    description: '',
    skillId: skills[5].id,
  },
  {
    id: 'ntc-rdn-r3',
    level: 3,
    name: 'R3',
    description: '',
    skillId: skills[5].id,
  },

  // nde-pes
  {
    id: 'nde-pes-e1',
    level: 1,
    name: 'E1',
    description: '',
    skillId: skills[6].id,
  },
  {
    id: 'nde-pes-e2',
    level: 2,
    name: 'E2',
    description: '',
    skillId: skills[6].id,
  },
  {
    id: 'nde-pes-e3',
    level: 3,
    name: 'E3',
    description: '',
    skillId: skills[6].id,
  },
  {
    id: 'nde-pes-e4',
    level: 4,
    name: 'E4',
    description: '',
    skillId: skills[6].id,
  },
  {
    id: 'nde-pes-e5',
    level: 5,
    name: 'E5',
    description: '',
    skillId: skills[6].id,
  },
];

export async function up(knex: Knex): Promise<void> {
  // truncate existing data
  await knex('SkillLevel').del();
  await knex('Skill').del();
  await knex('SkillCategory').del();

  // seed
  await knex('SkillCategory').insert(categories as ISkillCategory[]);
  await knex('Skill').insert(skills as ISkill[]);
  await knex('SkillLevel').insert(levels as ISkillLevel[]);
}

export async function down(knex: Knex): Promise<void> {
  await knex('SkillLevel')
    .whereIn(
      'id',
      levels.map((l) => l.id as string),
    )
    .del();
  await knex('Skill')
    .whereIn(
      'id',
      skills.map((s) => s.id as string),
    )
    .del();
  await knex('SkillCategory')
    .whereIn(
      'id',
      categories.map((c) => c.id as string),
    )
    .del();
}
