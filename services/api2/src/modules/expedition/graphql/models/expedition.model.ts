import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IRoute } from 'express';
import { PointGeometryModel } from '../../../common/graphql/geojson.model';
import { SMeta } from '../../../common/graphql/scalars/meta.scalar';
import { IPointGeometry } from '../../../common/types/geojson.type';
import { RouteModel } from '../../../route/graphql/models/route.model';
import { WaypointModel } from '../../../waypoint/graphql/models/waypoint.model';
import { IWaypoint } from '../../../waypoint/types/waypoint.type';
import { ICreateExpeditionDTO, IExpedition } from '../../types/expedition.type';

@ObjectType('Expedition')
export class ExpeditionModel implements IExpedition {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description!: string;

  @Field(() => PointGeometryModel)
  coordinate!: IPointGeometry;

  @Field()
  startDateTime!: Date;

  @Field()
  endDateTime!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => [RouteModel])
  routes!: IRoute[];

  @Field(() => [WaypointModel])
  waypoints!: IWaypoint[];
}

@InputType()
export class CreateExpeditionInput implements ICreateExpeditionDTO {
  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field()
  longitude!: number;

  @Field()
  latitude!: number;

  @Field({ nullable: true })
  altitude!: number;

  @Field()
  startDateTime!: Date;

  @Field()
  endDateTime!: Date;
}
