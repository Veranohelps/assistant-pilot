import { Field, Float, ObjectType } from '@nestjs/graphql';
import { ILineStringGeometry, IPointGeometry } from '../types/geojson.type';

@ObjectType('PointGeometry')
export class PointGeometryModel implements IPointGeometry {
  @Field(() => String)
  type!: 'Point';

  @Field(() => [Float])
  coordinates!: [number, number, number];
}

@ObjectType('LineStringGeometry')
export class LineStringGeometryModel implements ILineStringGeometry {
  @Field(() => String)
  type!: 'LineString';

  @Field(() => [[Float]])
  coordinates!: [number, number, number][];
}
