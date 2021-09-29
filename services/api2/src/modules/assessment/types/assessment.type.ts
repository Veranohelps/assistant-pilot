import { IUserLevel } from './user-level.type';

export interface IAssessment {
  id: string;
  userId: string;
  createdAt: Date;
}

export interface ICreateAssessment {
  userId: string;
}

export interface ICreateAssessmentDTO {
  levels: string[];
}

export interface ICreateAssessmentResult {
  assessment: IAssessment;
  userLevels: IUserLevel[];
}
