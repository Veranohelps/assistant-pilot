import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { logoPrimaryPng } from '../../assets/png';
import appRoutes from '../../config/appRoutes';
import usePersistedState from '../../hooks/usePersistedState';
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
`;

const TopBar = () => {
  const [token, setToken] = usePersistedState<string | null>('DersuTokenStore', 'token', null);
  const [date, setDate] = usePersistedState<number | null>('DersuTokenStore', 'date', null);
  const queryClient = useQueryClient();

  const requestToken = () => {
    const tkn = window.prompt('Please enter your admin token', '');

    setToken(tkn ?? token);

    if (tkn) setDate(Date.now());
  };

  // token invalidator
  useEffect(() => {
    const id = setInterval(() => {
      if (date && Date.now() - date > 1000 * 60 * 60 * 60 * 5) {
        setToken(null);
        setDate(null);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [date, token, setDate, setToken]);

  useEffect(() => {
    queryClient.invalidateQueries({ predicate: () => true });

    // eslint-disable-next-line
  }, [token]);

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
        <Typography textStyle="sm18">{token ? 'Authorized' : 'Unauthorized'}</Typography>
        <Button onClick={requestToken}>Enter token</Button>
      </GridBox>
    </Container>
  );
};

export default TopBar;
