export interface ISkill {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  updatedAt: string;
}

export interface ISkillLevel {
  id: string;
  name: string;
  description: string;
  skillId: string;
  level: number;
  updatedAt: string;
}

export interface ISkillCategory {
  id: string;
  name: string;
  description: string;
  updatedAt: Date;
}
