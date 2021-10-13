import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type CreateExpeditionInput = {
  altitude?: Maybe<Scalars['Float']>;
  description: Scalars['String'];
  endDateTime: Scalars['DateTime'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  name: Scalars['String'];
  startDateTime: Scalars['DateTime'];
};

export type Expedition = {
  __typename?: 'Expedition';
  coordinate: PointGeometry;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
  routes: Array<Route>;
  startDateTime: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  userId: Scalars['String'];
  waypoints: Array<Waypoint>;
};

export type LineStringGeometry = {
  __typename?: 'LineStringGeometry';
  coordinates: Array<Array<Scalars['Float']>>;
  type: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createExpedition: Expedition;
};

export type MutationCreateExpeditionArgs = {
  data: CreateExpeditionInput;
  gpxFile: Scalars['Upload'];
};

export type PointGeometry = {
  __typename?: 'PointGeometry';
  coordinates: Array<Scalars['Float']>;
  type: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  expeditions: Array<Expedition>;
};

export type Route = {
  __typename?: 'Route';
  coordinate: Array<LineStringGeometry>;
  globalId: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  originId: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  userId: Scalars['String'];
};

export type Waypoint = {
  __typename?: 'Waypoint';
  coordinate: PointGeometry;
  description: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  radiusInMeters: Scalars['Float'];
  type: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type GetExpeditionsQueryVariables = Exact<{ [key: string]: never }>;

export type GetExpeditionsQuery = {
  __typename?: 'Query';
  expeditions: Array<{
    __typename?: 'Expedition';
    id: string;
    name: string;
    description?: string | null | undefined;
    startDateTime: any;
    routes: Array<{ __typename?: 'Route'; id: string; name: string }>;
  }>;
};

export type CreateExpeditionMutationVariables = Exact<{
  gpxFile: Scalars['Upload'];
  expedition: CreateExpeditionInput;
}>;

export type CreateExpeditionMutation = {
  __typename?: 'Mutation';
  createExpedition: { __typename?: 'Expedition'; id: string };
};

export const GetExpeditionsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetExpeditions' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'expeditions' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                { kind: 'Field', name: { kind: 'Name', value: 'startDateTime' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'routes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetExpeditionsQuery, GetExpeditionsQueryVariables>;
export const CreateExpeditionDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateExpedition' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'gpxFile' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Upload' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'expedition' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateExpeditionInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createExpedition' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'data' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'expedition' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'gpxFile' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'gpxFile' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [{ kind: 'Field', name: { kind: 'Name', value: 'id' } }],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateExpeditionMutation, CreateExpeditionMutationVariables>;
