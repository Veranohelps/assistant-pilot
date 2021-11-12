export interface IActivityType {
  id: string;
  skillId: string | null;
  name: string;
  description: string;
  defaultPace: number;
  uphillPace: number;
  downhillPace: number;
  unknownPercentage: number;
}

export interface ICreateActivityType {
  id?: string;
  skillId?: string;
  name: string;
  description?: string | null;
  defaultPace: number;
  uphillPace: number;
  downhillPace: number;
  unknownPercentage: number;
}
