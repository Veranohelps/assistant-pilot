import { SRecord } from '../../../types/helpers.type';

export interface IUser {
  id: string;
  auth0Id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isRegistrationFinished: boolean;
  isSubscribedToNewsletter: boolean;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface IUserSlim {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  levels?: SRecord<string>;
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

export interface IEditedProfileDTO {
  firstName?: string;
  lastName?: string;
}

export interface IUserProfile {
  user: IUser;
}

export interface ITextDTO {
  text: string;
}

export interface ISearchUsersOptions {
  name?: string;
}
