export interface IUserLevel {
  id: string;
  assessmentId: string;
  skillId: string;
  levelId: string;
  userId: string;
  createdAt: Date;
}

export interface ICreateUserLevel {
  assessmentId: string;
  skillId: string;
  levelId: string;
  userId: string;
  createdAt?: Date;
}
