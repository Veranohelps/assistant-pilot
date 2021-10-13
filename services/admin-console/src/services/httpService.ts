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

let token = '';

export const http = ky.extend({
  prefixUrl: apiBaseUrl,
  hooks: {
    beforeRequest: [
      (req) => {
        token = !token ? window.prompt('Please enter your admin token', '') ?? '' : token;

        if (!token) {
          window.alert('Please provide your admin token to complete the request');
        }

        req.headers.set('x-dersu-api-admin-token', token);
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
