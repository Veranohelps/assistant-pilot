import styled from 'styled-components';
import CreateExpedition from './CreateExpedition';
import ExpeditionsList from './ExpeditionsList';

const Container = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: start;
  padding: 2rem 0;
`;

const Expedition = () => {
  return (
    <Container>
      <CreateExpedition />
      <ExpeditionsList />
    </Container>
  );
};

export default Expedition;
