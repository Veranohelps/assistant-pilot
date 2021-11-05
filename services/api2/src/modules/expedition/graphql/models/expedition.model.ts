import { Field, ObjectType } from '@nestjs/graphql';
import { IRoute } from 'express';
import { PointGeometryModel } from '../../../common/graphql/geojson.model';
import { IPointGeometry } from '../../../common/types/geojson.type';
import { RouteModel } from '../../../route/graphql/models/route.model';
import { IExpedition } from '../../types/expedition.type';

@ObjectType('Expedition')
export class ExpeditionModel implements IExpedition {
  @Field()
  id!: string;

  @Field(() => [String])
  activityTypeIds!: string[];

  @Field()
  userId!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description!: string;

  @Field(() => PointGeometryModel)
  coordinate!: IPointGeometry;

  @Field()
  startDateTime!: Date;

  @Field()
  updatedAt!: Date;

  @Field(() => [RouteModel])
  routes!: IRoute[];
}
