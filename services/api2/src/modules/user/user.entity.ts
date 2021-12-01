import { generateId } from '../common/utilities/generate-id';
import { IEntity } from '../database/types/entity.type';
import { IUser } from './types/user.type';

export const userEntity: IEntity<IUser> = {
  columns: {
    id: { type: 'string', defaults: { insert: () => generateId() } },
    auth0Id: { type: 'string' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    isRegistrationFinished: { type: 'boolean' },
    isSubscribedToNewsletter: { type: 'boolean' },
    avatar: { type: 'string' },
    createdAt: { type: 'date', select: false },
    updatedAt: { type: 'date' },
    deletedAt: { type: 'date', select: false },
  },
};
