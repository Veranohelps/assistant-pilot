import { Knex } from 'knex';
import { generateId } from '../../common/utilities/generate-id';
import { ISkillCategory } from '../../skill/types/skill-category.type';
import { ISkillLevel } from '../../skill/types/skill-level.type';
import { ISkill } from '../../skill/types/skill.type';

const categories: Partial<ISkillCategory>[] = [
  {
    id: generateId(),
    name: 'Nivel fisico',
    description: '',
  },
  { id: generateId(), name: 'Nivel técnico', description: '' },
  { id: generateId(), name: 'Nivel de exposición', description: '' },
];

const skills: Partial<ISkill>[] = [
  {
    id: generateId(),
    name: 'Alpinismo',
    description: '',
    categoryId: categories[0].id,
  },
  {
    id: generateId(),
    name: 'Esquí',
    description: '',
    categoryId: categories[0].id,
  },
  {
    id: generateId(),
    name: 'Alpinismo invernal',
    description: '',
    categoryId: categories[1].id,
  },
  {
    id: generateId(),
    name: 'Alpinismo estival',
    description: '',
    categoryId: categories[1].id,
  },
  {
    id: generateId(),
    name: 'Esquí',
    description: '',
    categoryId: categories[1].id,
  },
  {
    id: generateId(),
    name: 'Exposición',
    description: '',
    categoryId: categories[2].id,
  },
];

const levels: Partial<ISkillLevel>[] = [
  {
    id: generateId(),
    level: 0,
    name: 'F1',
    description: '300+ 5k 2h50´',
    skillId: skills[0].id,
  },
  {
    id: generateId(),
    level: 1,
    name: 'F2',
    description: '600+ 10k 5h30´',
    skillId: skills[0].id,
  },
  {
    id: generateId(),
    level: 2,
    name: 'F3',
    description: '1000+ 15k 8h25´',
    skillId: skills[0].id,
  },
  {
    id: generateId(),
    level: 3,
    name: 'F4',
    description: '1500+ 20k 12h',
    skillId: skills[0].id,
  },
  {
    id: generateId(),
    level: 4,
    name: 'F5',
    description: '2500+ 40k 20h',
    skillId: skills[0].id,
  },

  {
    id: generateId(),
    level: 0,
    name: 'F1',
    description: '300+ 5k 2h',
    skillId: skills[1].id,
  },
  {
    id: generateId(),
    level: 1,
    name: 'F2',
    description: '600+ 10k 3h45´',
    skillId: skills[1].id,
  },
  {
    id: generateId(),
    level: 2,
    name: 'F3',
    description: '1000+ 15k 6h',
    skillId: skills[1].id,
  },
  {
    id: generateId(),
    level: 3,
    name: 'F4',
    description: '1500+ 20k  8h45´',
    skillId: skills[1].id,
  },
  {
    id: generateId(),
    level: 4,
    name: 'F5',
    description: '2500+ 40k 14h',
    skillId: skills[1].id,
  },

  {
    id: generateId(),
    skillId: skills[2].id,
    level: 0,
    name: 'F',
    description: 'Rampas de nieve hasta 40º',
  },
  {
    id: generateId(),
    skillId: skills[2].id,
    level: 1,
    name: 'PD',
    description:
      'Rampas de nieve de hasta 45º, algún largo de cuerda más expo, pasos de mixto II grado',
  },
  {
    id: generateId(),
    skillId: skills[2].id,
    level: 2,
    name: 'AD',
    description:
      'Rampas de nieve de hasta 50º, algún largo de cuerda más expo, pasos de mixto III grado',
  },
  {
    id: generateId(),
    skillId: skills[2].id,
    level: 3,
    name: 'D',
    description:
      'Rampas de nieve de hasta 55º, algún largo de cuerda entre 60º-70º, pasos de mixto IV grado',
  },
  {
    id: generateId(),
    skillId: skills[2].id,
    level: 4,
    name: 'MD',
    description:
      'Varios pasos de nieve de 60º y 1 o 2 largos de cuerda entre 70º-85º, pasos de mixto V grado',
  },

  {
    id: generateId(),
    skillId: skills[3].id,
    level: 0,
    name: 'F',
    description: 'Alguna trepada I+',
  },
  {
    id: generateId(),
    skillId: skills[3].id,
    level: 1,
    name: 'PD',
    description: 'Trepada terreno expuesto, uso de la cuerda útil, hasta II+',
  },
  {
    id: generateId(),
    skillId: skills[3].id,
    level: 2,
    name: 'AD',
    description: 'Vía de escalada, técnica de rapel,pasos técnicos III+',
  },
  {
    id: generateId(),
    skillId: skills[3].id,
    level: 3,
    name: 'D',
    description: 'Dominio técnicas de escalada y rapel. Pasos de IV grado.',
  },
  {
    id: generateId(),
    skillId: skills[3].id,
    level: 4,
    name: 'MD',
    description: 'Vía de escalada V grado.',
  },

  {
    id: generateId(),
    skillId: skills[4].id,
    level: 0,
    name: 'S1',
    description: 'Esquí de montaña de estación ó pendientes medias de 30ºmax en laderas amplias.',
  },
  {
    id: generateId(),
    skillId: skills[4].id,
    level: 1,
    name: 'S2',
    description: 'Pendiente max.35º, exposición a caída grande.',
  },
  {
    id: generateId(),
    skillId: skills[4].id,
    level: 2,
    name: 'S3',
    description: 'Pendiente media de 35º con algún paso 40-45º. Ski-alpinismo',
  },
  {
    id: generateId(),
    skillId: skills[4].id,
    level: 3,
    name: 'S4',
    description: 'Pendientes mantenidas 40º-45º. Terreno de alta accidentalidad.',
  },
  {
    id: generateId(),
    skillId: skills[4].id,
    level: 4,
    name: 'S4',
    description: 'Pendiente media de 45º unos 300m, ó 50º durante 100m.',
  },

  {
    id: generateId(),
    skillId: skills[5].id,
    level: 0,
    name: 'E0',
    description: 'Dominio esquiable de estación, sin obstáculo en la trayectoria de una caída.',
  },
  {
    id: generateId(),
    skillId: skills[5].id,
    level: 1,
    name: 'E1',
    description: 'Riesgo bajo.',
  },
  {
    id: generateId(),
    skillId: skills[5].id,
    level: 2,
    name: 'E2',
    description:
      'Riesgo mediano, en caso de caída se puede golpear obstáculos. Existen peligros objetivos.',
  },
  {
    id: generateId(),
    skillId: skills[5].id,
    level: 3,
    name: 'E3',
    description:
      'Riesgo alto. En caso de caída, graves consecuencias. Peligros objetivos y subjetivos importantes. Muerte probable.',
  },
  {
    id: generateId(),
    skillId: skills[5].id,
    level: 4,
    name: 'E4',
    description: 'Riesgo muy alto, en caso de accidente riesgo muy alto de muerte.',
  },
];

export async function up(knex: Knex): Promise<void> {
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
