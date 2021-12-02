import {
  assessmentEntity,
  assessmentHistoryEntity,
  userLevelEntity,
} from '../assessment/assessment.entity';
import { bpaProviderEntity, bpaREportEntity, bpaZoneEntity } from '../bpa/bpa.entity';
import {
  expeditionEntity,
  expeditionRouteEntity,
  expeditionUserEntity,
} from '../expedition/expedition.entity';
import {
  activityTypeEntity,
  routeActivityTypeEntity,
  routeEntity,
  routeOriginEntity,
} from '../route/route.entity';
import { skillCategoryEntity, skillEntity, skillLevelEntity } from '../skill/skill.entity';
import { userEntity } from '../user/user.entity';
import { waypointEntity, waypointTypeEntity } from '../waypoint/waypoint.entity';
import { IEntity } from './types/entity.type';
import { IDatabaseTables } from './types/tables.type';

export const entityMap: Record<keyof IDatabaseTables, IEntity> = {
  Waypoint: waypointEntity,
  Route: routeEntity,
  Expedition: expeditionEntity,
  ExpeditionRoute: expeditionRouteEntity,
  SkillCategory: skillCategoryEntity,
  Skill: skillEntity,
  SkillLevel: skillLevelEntity,
  User: userEntity,
  Assessment: assessmentEntity,
  UserLevel: userLevelEntity,
  AssessmentHistory: assessmentHistoryEntity,
  RouteOrigin: routeOriginEntity,
  WaypointType: waypointTypeEntity,
  ActivityType: activityTypeEntity,
  RouteActivityType: routeActivityTypeEntity,
  ExpeditionUser: expeditionUserEntity,
  BpaZone: bpaZoneEntity,
  BpaProvider: bpaProviderEntity,
  BpaReport: bpaREportEntity,
};
