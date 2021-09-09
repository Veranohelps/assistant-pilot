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
  name: Scalars['String'];
  description: Scalars['String'];
  longitude: Scalars['Float'];
  latitude: Scalars['Float'];
  altitude?: Maybe<Scalars['Float']>;
  startDateTime: Scalars['DateTime'];
  endDateTime: Scalars['DateTime'];
};


export type Expedition = {
  __typename?: 'Expedition';
  id: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  coordinate: PointGeometry;
  startDateTime: Scalars['DateTime'];
  endDateTime: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  routes: Array<Route>;
  waypoints: Array<Waypoint>;
};

export type LineStringGeometry = {
  __typename?: 'LineStringGeometry';
  type: Scalars['String'];
  coordinates: Array<Array<Scalars['Float']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createExpedition: Expedition;
};


export type MutationCreateExpeditionArgs = {
  gpxFile: Scalars['Upload'];
  data: CreateExpeditionInput;
};

export type PointGeometry = {
  __typename?: 'PointGeometry';
  type: Scalars['String'];
  coordinates: Array<Scalars['Float']>;
};

export type Query = {
  __typename?: 'Query';
  expeditions: Array<Expedition>;
};

export type Route = {
  __typename?: 'Route';
  id: Scalars['String'];
  name: Scalars['String'];
  coordinate: Array<LineStringGeometry>;
  updatedAt: Scalars['DateTime'];
};


export type Waypoint = {
  __typename?: 'Waypoint';
  id: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
  description: Scalars['String'];
  coordinate: PointGeometry;
  radiusInMeters: Scalars['Float'];
  updatedAt: Scalars['DateTime'];
};

export type GetExpeditionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetExpeditionsQuery = { __typename?: 'Query', expeditions: Array<{ __typename?: 'Expedition', id: string, name: string, description?: Maybe<string>, startDateTime: any, endDateTime: any, routes: Array<{ __typename?: 'Route', id: string, name: string }> }> };

export type CreateExpeditionMutationVariables = Exact<{
  gpxFile: Scalars['Upload'];
  expedition: CreateExpeditionInput;
}>;


export type CreateExpeditionMutation = { __typename?: 'Mutation', createExpedition: { __typename?: 'Expedition', id: string } };


export const GetExpeditionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetExpeditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expeditions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"endDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"routes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetExpeditionsQuery, GetExpeditionsQueryVariables>;
export const CreateExpeditionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateExpedition"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gpxFile"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expedition"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateExpeditionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createExpedition"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expedition"}}},{"kind":"Argument","name":{"kind":"Name","value":"gpxFile"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gpxFile"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateExpeditionMutation, CreateExpeditionMutationVariables>;