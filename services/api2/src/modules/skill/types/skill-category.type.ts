import { ICreateSkillDTO } from './skill.type';

export interface ISkillCategory {
  id: string;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ICreateSkillCategory {
  name: string;
  description: string;
}

export interface ICreateSkillCategoryDTO {
  name: string;
  description: string;
  skills?: Omit<ICreateSkillDTO, 'categoryId'>[];
}
