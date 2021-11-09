import { Auth0Client, Auth0ClientOptions } from '@auth0/auth0-spa-js';
import { auth0audience, auth0ClientID, auth0Domain } from '../config/environment';

export const auth0Config: Auth0ClientOptions = {
  domain: auth0Domain,
  client_id: auth0ClientID,
  redirect_uri: `${window.location.origin}`,
  audience: auth0audience,
};

export const auth0Client = new Auth0Client(auth0Config);
