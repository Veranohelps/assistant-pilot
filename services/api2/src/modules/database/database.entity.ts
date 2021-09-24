import {
  expeditionEntity,
  expeditionRouteEntity,
  expeditionWaypointEntity,
} from '../expedition/expedition.entity';
import { routeEntity } from '../route/route.entity';
import { skillCategoryEntity, skillEntity, skillLevelEntity } from '../skill/skill.entity';
import { userEntity } from '../user/user.entity';
import { waypointEntity } from '../waypoint/waypoint.entity';
import { IEntity } from './types/entity.type';
import { IDatabaseTables } from './types/tables.type';

export const entityMap: Record<keyof IDatabaseTables, IEntity> = {
  Waypoint: waypointEntity,
  Route: routeEntity,
  Expedition: expeditionEntity,
  ExpeditionWaypoint: expeditionWaypointEntity,
  ExpeditionRoute: expeditionRouteEntity,
  SkillCategory: skillCategoryEntity,
  Skill: skillEntity,
  SkillLevel: skillLevelEntity,
  User: userEntity,
};
