import { IExpeditionEventMappings } from '../../expedition/events/event-types/expedition.event-type';
import { IRouteEventMappings } from '../../route/events/event-types/route.event-type';
import { IUserEventMappings } from '../../user/events/event-types/user.event-type';

export interface IEventMappings
  extends IRouteEventMappings,
    IExpeditionEventMappings,
    IUserEventMappings {}
