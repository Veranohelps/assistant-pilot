import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../components/Button';
import { Box, FlexBox, GridBox } from '../../components/Layout';
import { Typography } from '../../components/Typography';
import appRoutes from '../../config/appRoutes';
import { appEnv } from '../../config/environment';
import { className } from '../../utils/style';

const cls = className();

const Container = styled.div`
  margin: auto;
  padding: 3rem;
  padding-top: 0;
  max-width: 500px;
`;

const dashboardLinks: { name: string; url: string }[] = [
  { name: 'Routes', url: appRoutes.route.dashboard },
  { name: 'Waypoint', url: appRoutes.waypoint.dashboard },
  { name: 'BPA', url: appRoutes.bpa.dashboard },
];

const Dashboard = () => {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();

  return (
    <Container>
      {appEnv !== 'production' && (
        <Box mBottom={25}>
          <Typography textStyle="md20" textAlign="center">
            This is a TESTING environment
          </Typography>
          <Typography textStyle="sm16" textAlign="center">
            Add, remove, change, update... you can't break things
          </Typography>
          <Typography textStyle="sm16" textAlign="center">
            Also, don't be surprised if things go up or down, we're all testing here!
          </Typography>
        </Box>
      )}
      <Typography textStyle="lg36" textAlign="center">
        Welcome to Dersu's Admin Console
      </Typography>
      {isAuthenticated ? (
        <GridBox direction="column" gap={20} justify="center" box={{ mTop: '3rem' }}>
          {dashboardLinks.map((link) => {
            return (
              <div key={link.name} className={cls.set('item')}>
                <Link to={link.url}>
                  <Typography textStyle="sm18" textAlign="center">
                    {link.name}
                  </Typography>
                </Link>
              </div>
            );
          })}
        </GridBox>
      ) : (
        <FlexBox box={{ mTop: '3rem' }}>
          <Button onClick={() => loginWithRedirect()}>
            {isLoading ? 'Authenticating...' : 'Login to get started'}
          </Button>
        </FlexBox>
      )}
    </Container>
  );
};

export default Dashboard;
