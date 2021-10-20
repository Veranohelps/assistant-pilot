import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../components/Button';
import { FlexBox } from '../../components/Layout';
import { Typography } from '../../components/Typography';
import appRoutes from '../../config/appRoutes';
import { getRoutesService } from '../../services/routeService';
import { className } from '../../utils/style';

const cls = className();

const Container = styled.div`
  width: 90%;
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem 0;

  ${cls.get('header')} {
    text-align: center;
    position: relative;

    ${cls.get('createLink')} {
      position: absolute;
      right: 0;
    }
  }

  .routeList {
    padding: 2rem 0;
    display: grid;
    grid-auto-flow: row;
    gap: 10px;
  }

  .routeListItem {
    border: 1px solid;
    padding: 1rem;
    border-radius: 5px;
    display: grid;
    grid-auto-flow: row;
    gap: 5px;
  }

  .routeContainer {
    margin-bottom: 10px;
  }
`;

const RouteList = () => {
  const routesQuery = useQuery(['route'], getRoutesService, {
    select: (res) => res.data.routes,
  });

  return (
    <Container>
      <div className={cls.set('header')}>
        <Typography textStyle="md24">Route List</Typography>
        <Link className={cls.set('createLink')} to={appRoutes.route.create}>
          <Button>Create Route</Button>
        </Link>
      </div>
      <div className="routeList">
        {routesQuery.data?.map((route) => {
          return (
            <div className="routeListItem" key={route.id}>
              <Typography textStyle="sm18" display="block">
                {route.name}
              </Typography>
              <Typography textStyle="sm14" display="block">
                {route.description}
              </Typography>
              <br />
              <div className="routeContainer">
                <Typography as="a" href={route.url}>
                  URL: {route.url}
                </Typography>
              </div>
              <FlexBox justify="flex-end">
                <Link to={appRoutes.route.edit(route.id)}>Edit route</Link>
              </FlexBox>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default RouteList;
