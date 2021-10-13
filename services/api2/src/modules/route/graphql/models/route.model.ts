import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { LineStringGeometryModel } from '../../../common/graphql/geojson.model';
import { ILineStringGeometry } from '../../../common/types/geojson.type';
import { ICreateRouteDTO, IRoute } from '../../types/route.type';

@ObjectType('Route')
export class RouteModel implements IRoute {
  @Field()
  id!: string;

  @Field()
  originId!: string;

  @Field()
  globalId!: string;

  @Field()
  userId!: string;

  @Field()
  name!: string;

  @Field(() => [LineStringGeometryModel])
  coordinate!: ILineStringGeometry;

  @Field()
  updatedAt!: Date;
}

@InputType()
export class CreateRouteInput implements ICreateRouteDTO {
  @Field()
  name!: string;
}
