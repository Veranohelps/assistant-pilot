import { IDefaultMeta } from '../../database/types/database.type';

export interface ISkillLevel {
  id: string;
  name: string;
  description: string;
  skillId: string;
  level: number;
  meta?: IDefaultMeta;
  createdAt?: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ICreateSkillLevel {
  name: string;
  description: string;
  skillId: string;
  level: number;
  meta?: IDefaultMeta;
}

export interface ICreateSkillLevelDTO {
  name: string;
  description: string;
  skillId: string;
  level: number;
}
