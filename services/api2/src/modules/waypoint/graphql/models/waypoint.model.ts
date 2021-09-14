import { Field, ObjectType } from '@nestjs/graphql';
import { PointGeometryModel } from '../../../common/graphql/geojson.model';
import { SMeta } from '../../../common/graphql/scalars/meta.scalar';
import { IPointGeometry } from '../../../common/types/geojson.type';
import { IWaypoint } from '../../types/waypoint.type';

@ObjectType('Waypoint')
export class WaypointModel implements IWaypoint {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field()
  type!: string;

  @Field()
  description!: string;

  @Field(() => PointGeometryModel)
  coordinate!: IPointGeometry;

  @Field()
  radiusInMeters!: number;

  @Field()
  updatedAt!: Date;
}