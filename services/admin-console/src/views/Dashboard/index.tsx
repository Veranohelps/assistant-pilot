import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Box, GridBox } from '../../components/Layout';
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

const Dashboard = () => {
  return (
    <Container>
      {appEnv !== 'production' && (
        <Box mBottom ={25}>
          <Typography textStyle="md20" textAlign="center">
            This is a TESTING environment
          </Typography>
          <Typography textStyle="sm16" textAlign="center">
            Add, remove, change, update... you can't break things
          </Typography>
          <Typography textStyle="sm16" textAlign="center">
            Also, don't be surprised if things go up or down, we're all testing here!
          </Typography>
        </Box >
      )}
      <Typography textStyle="lg36" textAlign="center">
        Welcome to Dersu's Admin Console
      </Typography>
      <GridBox direction="column" gap={20} justify="center" box={{ mTop: '3rem' }}>
        <div className={cls.set('item')}>
          <Link to={appRoutes.route.dashboard}>
            <Typography textStyle="sm18" textAlign="center">
              Routes
            </Typography>
          </Link>
        </div>
        <div className={cls.set('item')}>
          <Link to={appRoutes.waypoint.dashboard}>
            <Typography textStyle="sm18" textAlign="center">
              Waypoints
            </Typography>
          </Link>
        </div>
      </GridBox>
    </Container>
  );
};

export default Dashboard;
