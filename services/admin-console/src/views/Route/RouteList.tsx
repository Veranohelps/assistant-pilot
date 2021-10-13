import { useQuery } from 'react-query';
import styled from 'styled-components';
import { Typography } from '../../components/Typography';
import { getRoutesService } from '../../services/routeService';

const Container = styled.div`
  width: 90%;
  max-width: 500px;
  margin: 0 auto;

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
  const routesQuery = useQuery(['routes'], getRoutesService, {
    select: (res) => res.data.routes,
  });

  return (
    <Container>
      <Typography textStyle="md24" textAlign="center">
        Route List
      </Typography>
      <div className="routeList">
        {routesQuery.data?.map((route) => {
          return (
            <div className="routeListItem" key={route.id}>
              <Typography textStyle="sm18" display="block">
                {route.name}
              </Typography>
              <div className="routeContainer">
                <Typography display="block">{route.name}</Typography>
                <Typography as="a" href={route.url}>
                  URL: {route.url}
                </Typography>
              </div>
              <div>
                <br />
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default RouteList;
