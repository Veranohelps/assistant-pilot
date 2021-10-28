export interface IActivityType {
  id: string;
  name: string;
  description: string;
}

export interface ICreateActivityType {
  id?: string;
  name: string;
  description?: string | null;
}
