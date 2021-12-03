export interface IBpaProvider {
  id: string;
  name: string;
  description: string;
  reportCount: number;
  disabled: boolean;
}

export interface ICreateBpaProvider {
  name: string;
  description: string;
  disabled?: boolean;
}
