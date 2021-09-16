import { generateId } from '../common/utilities/generate-id';
import { IEntity } from '../database/types/entity.type';
import { ISkillCategory } from './types/skill-category.type';
import { ISkillLevel } from './types/skill-level.type';
import { ISkill } from './types/skill.type';

export const skillCategoryEntity: IEntity<ISkillCategory> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    name: { type: 'string' },
    description: { type: 'string' },
    createdAt: { type: 'date', select: false },
    updatedAt: { type: 'date' },
    deletedAt: { type: 'date', select: false },
  },
};

export const skillEntity: IEntity<ISkill> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    categoryId: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
    createdAt: { type: 'date', select: false },
    updatedAt: { type: 'date' },
    deletedAt: { type: 'date', select: false },
  },
};

export const skillLevelEntity: IEntity<ISkillLevel> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    name: { type: 'string' },
    description: { type: 'string' },
    skillId: { type: 'string' },
    level: { type: 'number' },
    meta: { type: 'json', select: false },
    createdAt: { type: 'date', select: false },
    updatedAt: { type: 'date' },
    deletedAt: { type: 'date', select: false },
  },
};
