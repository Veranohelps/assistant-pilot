import { Knex } from 'knex';
import {
  ICreateExpeditionRoute,
  IExpeditionRoute,
} from '../../expedition/types/expedition-route.type';
import {
  ICreateExpeditionWaypoint,
  IExpeditionWaypoint,
} from '../../expedition/types/expedition-waypoint.type';
import { ICreateExpedition, IExpedition } from '../../expedition/types/expedition.type';
import { ICreateRoute, IRoute } from '../../route/types/route.type';
import { ICreateSkillCategory, ISkillCategory } from '../../skill/types/skill-category.type';
import { ICreateSkillLevel, ISkillLevel } from '../../skill/types/skill-level.type';
import { ICreateSkill, ISkill } from '../../skill/types/skill.type';
import { ICreateWaypoint, IWaypoint } from '../../waypoint/types/waypoint.type';

export interface IDatabaseTables {
  Waypoint: Knex.CompositeTableType<IWaypoint, ICreateWaypoint, Partial<Omit<IWaypoint, 'id'>>>;
  Route: Knex.CompositeTableType<IRoute, ICreateRoute, Partial<Omit<IRoute, 'id'>>>;
  Expedition: Knex.CompositeTableType<
    IExpedition,
    ICreateExpedition,
    Partial<Omit<IExpedition, 'id'>>
  >;
  ExpeditionWaypoint: Knex.CompositeTableType<
    IExpeditionWaypoint,
    ICreateExpeditionWaypoint,
    Partial<Omit<IExpeditionWaypoint, 'id'>>
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
}
