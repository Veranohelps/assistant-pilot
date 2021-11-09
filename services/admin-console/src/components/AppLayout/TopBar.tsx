import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { logoPrimaryPng } from '../../assets/png';
import appRoutes from '../../config/appRoutes';
import { className } from '../../utils/style';
import { Button } from '../Button';
import { GridBox } from '../Layout';
import { Typography } from '../Typography';

const cls = className();

const Container = styled.div`
  position: relative;
  display: flex;
  padding: 1rem;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 2px 2px rgba(24, 11, 61, 0.093);
  z-index: 1;

  ${cls.get('titleBar')} {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ${cls.get('appIcon')} {
    height: 2rem;
  }

  ${cls.get('avatar')} {
    height: 2.5rem;
    border-radius: 50%;
  }
`;

const TopBar = () => {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } = useAuth0();
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({ predicate: () => true });

    // eslint-disable-next-line
  }, [isAuthenticated]);


  return (
    <Container>
      <div className={cls.set('titleBar')}>
        <Link to={appRoutes.dashboard}>
          <Typography textStyle="md24" textTheme={{ weight: 600 }}>
            Admin Console
          </Typography>
        </Link>
      </div>
      <Link to={appRoutes.dashboard}>
        <img className={cls.set('appIcon')} src={logoPrimaryPng} alt="App logo" />
      </Link>

      <GridBox direction="column" gap={10}>
        <Button
          onClick={() => {
            isAuthenticated ? logout({ returnTo: window.location.origin }) : loginWithRedirect();
          }}
        >
          {isLoading ? 'Authenticating' : isAuthenticated ? 'Logout' : 'Login'}
        </Button>
        {user?.picture && <img className={cls.set('avatar')} src={user.picture} alt="avatar"  />}
      </GridBox>
    </Container>
  );
};

export default TopBar;
