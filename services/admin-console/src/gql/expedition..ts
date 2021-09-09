import { gql } from '@apollo/client';

export const GET_EXPEDITIONS = gql`
  query GetExpeditions {
    expeditions {
      id
      name
      description
      startDateTime
      endDateTime
      routes {
        id
        name
      }
    }
  }
`;

export const CREATE_EXPEDITION = gql`
  mutation CreateExpedition($gpxFile: Upload!, $expedition: CreateExpeditionInput!) {
    createExpedition(data: $expedition, gpxFile: $gpxFile) {
      id
    }
  }
`;
