export interface IAssessmentHistory {
  id: string;
  assessmentId: string;
  skillId: string;
  levelId: string;
  userId: string;
  isCurrent: boolean;
  createdAt: Date;
}

export interface ICreateAssessmentHistory {
  assessmentId: string;
  skillId: string;
  levelId: string;
  userId: string;
  isCurrent: boolean;
}

export interface ICreateAssessmentHistoryDTO {
  result: { skillId: string; levelId: string }[];
}
