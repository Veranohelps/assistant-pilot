import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import Unauthorized from '../views/Error/Unauthorized';

interface IProps {
  children?: React.ReactElement;
  el?: React.ReactElement;
}

const AuthRoute = (props: IProps) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isAuthenticated || isLoading) {
    return props.el ?? props.children ?? null;
  }

  return <Unauthorized />;
};

export default AuthRoute;
