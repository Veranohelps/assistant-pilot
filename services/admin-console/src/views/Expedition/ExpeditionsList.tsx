import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import styled from 'styled-components';
import { Typography } from '../../components/Typography';
import { apiBaseUrl } from '../../config/environment';
import { GetExpeditionsDocument } from '../../gql/graphql-operations';

const Container = styled.div`
  width: 90%;
  max-width: 500px;
  margin: 0 auto;

  .expeditionList {
    padding: 2rem 0;
    display: grid;
    grid-auto-flow: row;
    gap: 10px;
  }

  .expeditionListItem {
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

const ExpeditionsList = () => {
  const expeditionsQuery = useQuery(GetExpeditionsDocument, {
    fetchPolicy: 'cache-first',
    context: { requireAdminToken: true },
  });

  return (
    <Container>
      <Typography textStyle="md24" textAlign="center">
        Expedition List
      </Typography>
      <div className="expeditionList">
        {expeditionsQuery.data?.expeditions.map((expedition) => {
          return (
            <div className="expeditionListItem" key={expedition.id}>
              <Typography textStyle="sm18" display="block">
                {expedition.name}
              </Typography>
              <Typography textColor="primary600">
                {expedition.description || 'No description provided'}
              </Typography>
              <div>
                <Typography>
                  {format(new Date(expedition.startDateTime), 'do LLL yyyy @ HH:mm')}
                </Typography>{' '}
                -{' '}
                <Typography>
                  {format(new Date(expedition.endDateTime), 'do LLL yyyy @ HH:mm')}
                </Typography>
              </div>
              <div>
                <br />
                <Typography textColor="primary" textStyle="sm18">
                  Routes
                </Typography>
                {expedition.routes.map((route) => {
                  return (
                    <div className="routeContainer">
                      <Typography display="block">{route.name}</Typography>
                      <Typography as="a" href={`${apiBaseUrl}/admin/route/${route.id}`}>
                        URL: {apiBaseUrl}/admin/route/{route.id}
                      </Typography>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default ExpeditionsList;
