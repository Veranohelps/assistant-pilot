import { CustomScalar, Scalar } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

export class SMeta extends Object {
  [key: string]: any;
}

@Scalar('Meta', () => SMeta)
export class MetaScalar implements CustomScalar<string, any> {
  description = 'Meta field';

  serialize = GraphQLJSON.serialize;
  parseValue = GraphQLJSON.parseValue;
  parseLiteral = GraphQLJSON.parseLiteral;
}
