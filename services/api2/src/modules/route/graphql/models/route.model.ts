import { Field, Float, InputType, ObjectType } from '@nestjs/graphql';
import { LineStringGeometryModel } from '../../../common/graphql/geojson.model';
import { ILineStringGeometry, IMultiPointGeometry } from '../../../common/types/geojson.type';
import { ERouteOrigins } from '../../types/route-origin.type';
import { ICreateRouteDTO, IRoute } from '../../types/route.type';

@ObjectType('Route')
export class RouteModel implements IRoute {
  @Field()
  id!: string;

  @Field()
  originId!: ERouteOrigins;

  @Field()
  globalId!: string;

  @Field(() => [String])
  activityTypeIds!: string[];

  @Field(() => [String])
  levelIds!: string[];

  @Field()
  userId!: string;

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => [LineStringGeometryModel])
  coordinate!: ILineStringGeometry;

  @Field(() => Float)
  distanceInMeters!: number;

  @Field(() => Float)
  elevationGainInMeters!: number;

  @Field(() => Float)
  elevationLossInMeters!: number;

  @Field(() => Float)
  highestPointInMeters!: number;

  @Field(() => Float)
  lowestPointInMeters!: number;

  @Field(() => LineStringGeometryModel)
  meteoPointsOfInterests!: IMultiPointGeometry;

  @Field()
  updatedAt!: Date;
}

@InputType()
export class CreateRouteInput implements ICreateRouteDTO {
  @Field()
  name!: string;

  @Field(() => [String])
  activityTypes!: string[];
}
