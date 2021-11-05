export interface IActivityType {
  id: string;
  skillId: string | null;
  name: string;
  description: string;
}

export interface ICreateActivityType {
  id?: string;
  skillId?: string;
  name: string;
  description?: string | null;
}
