import {
  expeditionEntity,
  expeditionRouteEntity,
  expeditionWaypointEntity,
} from '../expedition/expedition.entity';
import { routeEntity } from '../route/route.entity';
import { waypointEntity } from '../waypoint/waypoint.entity';
import { IEntity } from './types/entity.type';
import { IDatabaseTables } from './types/tables.type';

export const entityMap: Record<keyof IDatabaseTables, IEntity> = {
  Waypoint: waypointEntity,
  Route: routeEntity,
  Expedition: expeditionEntity,
  ExpeditionWaypoint: expeditionWaypointEntity,
  ExpeditionRoute: expeditionRouteEntity,
};
