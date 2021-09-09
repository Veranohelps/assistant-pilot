import { Field, ObjectType } from '@nestjs/graphql';
import { LineStringGeometryModel } from '../../../common/graphql/geojson.model';
import { ILineStringGeometry } from '../../../common/types/geojson.type';
import { IRoute } from '../../types/route.type';

@ObjectType('Route')
export class RouteModel implements IRoute {
  @Field()
  id!: string;

  @Field()
  name!: string;

  @Field(() => [LineStringGeometryModel])
  coordinate!: ILineStringGeometry;

  @Field()
  updatedAt!: Date;
}
