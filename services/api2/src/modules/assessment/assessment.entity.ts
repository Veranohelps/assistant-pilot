import { generateId } from '../common/utilities/generate-id';
import { IEntity } from '../database/types/entity.type';
import { IAssessmentHistory } from './types/assessment-history.type';
import { IAssessment } from './types/assessment.type';
import { IUserLevel } from './types/user-level.type';

export const assessmentEntity: IEntity<IAssessment> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    userId: { type: 'string' },
    createdAt: { type: 'date', select: false },
  },
};

export const userLevelEntity: IEntity<IUserLevel> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    assessmentId: { type: 'string' },
    skillId: { type: 'string' },
    levelId: { type: 'string' },
    userId: { type: 'string' },
    createdAt: { type: 'date', select: false },
  },
};

export const assessmentHistoryEntity: IEntity<IAssessmentHistory> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    assessmentId: { type: 'string' },
    skillId: { type: 'string' },
    levelId: { type: 'string' },
    userId: { type: 'string' },
    isCurrent: { type: 'boolean' },
    createdAt: { type: 'date', select: false },
  },
};
