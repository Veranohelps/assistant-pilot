import { ICreateSkillLevelDTO } from './skill-level.type';

export interface ISkill extends ICreateSkill {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  createdAt?: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ICreateSkill {
  id?: string;
  name: string;
  description: string;
  categoryId: string;
}

export interface ICreateSkillDTO {
  name: string;
  description: string;
  categoryId: string;
  levels?: Omit<ICreateSkillLevelDTO, 'skillId'>[];
}
