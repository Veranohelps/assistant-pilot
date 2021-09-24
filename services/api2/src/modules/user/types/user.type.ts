export interface IUser {
  id: string;
  auth0Id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  otherName: string | null;
  isRegistrationFinished: boolean;
  hasSubscription: boolean;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ICreateUser {
  auth0Id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  otherName?: string | null;
  isRegistrationFinished?: boolean;
  avatar?: string;
}

export interface ICreateUserDTO {
  auth0Id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  otherName?: string | null;
  avatar?: string;
}

export interface ICompleteUserRegistrationDTO {
  firstName: string;
  lastName: string;
  otherName?: string;
}

export interface IUserProfile {
  user: IUser;
}