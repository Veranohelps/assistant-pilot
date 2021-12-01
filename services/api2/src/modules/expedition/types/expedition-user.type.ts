import { IUser } from '../../user/types/user.type';
import { IExpedition } from './expedition.type';

export enum EExpeditionInviteStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  LEFT = 'LEFT',
}

export interface IExpeditionUser {
  expeditionId: string;
  userId: string;
  inviteStatus: EExpeditionInviteStatus;
  isOwner: boolean;
  acceptedOn: Date | null;
  rejectedOn: Date | null;
  leftOn: Date | null;
  createdAt: Date;
}

export interface ICreateExpeditionUser {
  expeditionId: string;
  userId: string;
  inviteStatus: EExpeditionInviteStatus;
  isOwner: boolean;
  acceptedOn?: Date | null;
  rejectedOn?: Date | null;
  leftOn?: Date | null;
}

export interface IInviteUsersToExpeditionDTO {
  invites: string[];
}

export interface IExpeditionUserFull extends IExpeditionUser {
  expedition?: IExpedition;
  user?: IUser;
}
