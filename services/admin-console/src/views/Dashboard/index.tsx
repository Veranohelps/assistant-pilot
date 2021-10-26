import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { GridBox } from '../../components/Layout';
import { Typography } from '../../components/Typography';
import appRoutes from '../../config/appRoutes';
import { className } from '../../utils/style';

const cls = className();

const Container = styled.div`
  margin: auto;
  padding: 3rem;
  max-width: 500px;
`;

const Dashboard = () => {
  return (
    <Container>
      <Typography textStyle="lg36" textAlign="center">
        Welcome to Dersu's Admin Console
      </Typography>
      <GridBox direction="column" gap={20} justify="center" box={{mTop: '3rem'}}>
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
