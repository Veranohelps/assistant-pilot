export interface IBpaProvider {
  id: string;
  name: string;
  url: string;
  logoUrl: string | null;
  description: string;
  reportCount: number;
  disabled: boolean;
}

export interface ICreateBpaProvider {
  name: string;
  description: string;
  url: string;
  disabled?: boolean;
}
