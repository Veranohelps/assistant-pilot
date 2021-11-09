import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  from,
  InMemoryCache,
  NextLink,
  Observable,
  Operation,
} from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import ky from 'ky';
import { apiBaseUrl } from '../config/environment';
import { auth0Client } from './auth0Service';

export const http = ky.extend({
  prefixUrl: apiBaseUrl,
  hooks: {
    beforeRequest: [
      async (req) => {
        const token = await auth0Client.getTokenSilently();

        if (token) {
          req.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
  },
});

class AdminTokenLink extends ApolloLink {
  token: string;

  constructor() {
    super();

    this.token = '';
  }

  request(operation: Operation, forward: NextLink): Observable<FetchResult> | null {
    const ctx = operation.getContext();

    if (ctx.requireAdminToken) {
      if (this.token === '') {
        this.token = window.prompt('Please enter your admin token', '') ?? '';

        if (!this.token) {
          window.alert('Please provide your admin token to complete the request');
        }
      }

      operation.setContext(({ headers }: { headers: Record<string, string> }) => ({
        headers: { ...headers, 'x-dersu-api-admin-token': this.token },
      }));
    }

    return forward(operation);
  }
}

const link = from([new AdminTokenLink(), createUploadLink({ uri: `${apiBaseUrl}/graphql` })]);

export const apolloClient = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link,
});
