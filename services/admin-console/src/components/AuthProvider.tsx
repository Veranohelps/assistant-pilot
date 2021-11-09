import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';
import { auth0Config } from '../services/auth0Service';

interface TProps {
  children: React.ReactNode;
}

const AuthProvider = (props: TProps) => {
  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.client_id}
      redirectUri={auth0Config.redirect_uri}
      audience={auth0Config.audience}
    >
      {props.children}
    </Auth0Provider>
  );
};

export default AuthProvider;
