import { Field, ObjectType } from '@nestjs/graphql';
import { PointGeometryModel } from '../../../common/graphql/geojson.model';
import { IPointGeometry } from '../../../common/types/geojson.type';
import { IWaypoint } from '../../types/waypoint.type';

@ObjectType('Waypoint')
export class WaypointModel implements IWaypoint {
  @Field()
  id!: string;

  @Field({ nullable: true })
  userId!: string;

  @Field()
  originId!: string;

  @Field()
  name!: string;

  @Field(() => [String])
  typeIds!: string[];

  @Field()
  description!: string;

  @Field(() => PointGeometryModel)
  coordinate!: IPointGeometry;

  @Field()
  radiusInMeters!: number;

  @Field()
  updatedAt!: Date;
}
