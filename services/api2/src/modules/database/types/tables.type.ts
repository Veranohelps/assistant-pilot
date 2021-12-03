import { Knex } from 'knex';
import {
  IAssessmentHistory,
  ICreateAssessmentHistory,
} from '../../assessment/types/assessment-history.type';
import { IAssessment, ICreateAssessment } from '../../assessment/types/assessment.type';
import { ICreateUserLevel, IUserLevel } from '../../assessment/types/user-level.type';
import { IBpaProvider, ICreateBpaProvider } from '../../bpa/types/bpa-provider.type';
import { IBpaReport, ICreateBpaReport } from '../../bpa/types/bpa-report.type';
import { IBpaZoneReport, ICreateBpaZoneReport } from '../../bpa/types/bpa-zone-report.type';
import { IBpaZone, ICreateBpaZone } from '../../bpa/types/bpa-zone.type';
import {
  ICreateExpeditionRoute,
  IExpeditionRoute,
} from '../../expedition/types/expedition-route.type';
import {
  ICreateExpeditionUser,
  IExpeditionUser,
} from '../../expedition/types/expedition-user.type';
import { ICreateExpedition, IExpedition } from '../../expedition/types/expedition.type';
import { IActivityType, ICreateActivityType } from '../../route/types/activity-type.type';
import {
  ICreateRouteActivityType,
  IRouteActivityType,
} from '../../route/types/route-activity-type.type';
import { IRouteOrigin } from '../../route/types/route-origin.type';
import { ICreateRoute, IRoute } from '../../route/types/route.type';
import { ICreateSkillCategory, ISkillCategory } from '../../skill/types/skill-category.type';
import { ICreateSkillLevel, ISkillLevel } from '../../skill/types/skill-level.type';
import { ICreateSkill, ISkill } from '../../skill/types/skill.type';
import { ICreateUser, IUser } from '../../user/types/user.type';
import { IWaypointType } from '../../waypoint/types/waypoint-type.type';
import { ICreateWaypoint, IWaypoint } from '../../waypoint/types/waypoint.type';

export interface IDatabaseTables {
  Waypoint: Knex.CompositeTableType<IWaypoint, ICreateWaypoint, Partial<Omit<IWaypoint, 'id'>>>;
  Route: Knex.CompositeTableType<IRoute, ICreateRoute, Partial<ICreateRoute>>;
  Expedition: Knex.CompositeTableType<
    IExpedition,
    ICreateExpedition,
    Partial<Omit<IExpedition, 'id'>>
  >;
  ExpeditionRoute: Knex.CompositeTableType<
    IExpeditionRoute,
    ICreateExpeditionRoute,
    Partial<Omit<IExpeditionRoute, 'id'>>
  >;
  SkillCategory: Knex.CompositeTableType<
    ISkillCategory,
    ICreateSkillCategory,
    Partial<Omit<ISkillCategory, 'id'>>
  >;
  Skill: Knex.CompositeTableType<ISkill, ICreateSkill, Partial<Omit<IExpeditionRoute, 'id'>>>;
  SkillLevel: Knex.CompositeTableType<
    ISkillLevel,
    ICreateSkillLevel,
    Partial<Omit<ISkillLevel, 'id'>>
  >;
  User: Knex.CompositeTableType<IUser, ICreateUser, Partial<Omit<IUser, 'id'>>>;
  Assessment: Knex.CompositeTableType<
    IAssessment,
    ICreateAssessment,
    Partial<Omit<IAssessment, 'id'>>
  >;
  UserLevel: Knex.CompositeTableType<IUserLevel, ICreateUserLevel, Partial<Omit<IUserLevel, 'id'>>>;
  AssessmentHistory: Knex.CompositeTableType<
    IAssessmentHistory,
    ICreateAssessmentHistory,
    Partial<Omit<IAssessmentHistory, 'id'>>
  >;
  RouteOrigin: Knex.CompositeTableType<
    IRouteOrigin,
    IRouteOrigin,
    Partial<Omit<IRouteOrigin, 'id'>>
  >;
  WaypointType: Knex.CompositeTableType<
    IWaypointType,
    IWaypointType,
    Partial<Omit<IWaypointType, 'id'>>
  >;
  ActivityType: Knex.CompositeTableType<
    IActivityType,
    ICreateActivityType,
    Partial<Omit<IActivityType, 'id'>>
  >;
  RouteActivityType: Knex.CompositeTableType<
    IRouteActivityType,
    ICreateRouteActivityType,
    Partial<Omit<IRouteActivityType, 'id'>>
  >;
  ExpeditionUser: Knex.CompositeTableType<
    IExpeditionUser,
    ICreateExpeditionUser,
    Partial<Omit<IExpeditionUser, 'id'>>
  >;
  BpaZone: Knex.CompositeTableType<IBpaZone, ICreateBpaZone, Partial<ICreateBpaZone>>;
  BpaProvider: Knex.CompositeTableType<
    IBpaProvider,
    ICreateBpaProvider,
    Partial<ICreateBpaProvider>
  >;
  BpaReport: Knex.CompositeTableType<IBpaReport, ICreateBpaReport, Partial<ICreateBpaReport>>;
  BpaZoneReport: Knex.CompositeTableType<
    IBpaZoneReport,
    ICreateBpaZoneReport,
    Partial<ICreateBpaZoneReport>
  >;
}
