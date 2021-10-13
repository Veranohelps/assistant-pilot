import styled from 'styled-components';
import CreateRoute from './CreateRoute';
import RouteList from './RouteList';

const Container = styled.div`
  display: grid;
  grid-auto-flow: column;
  align-items: start;
  padding: 2rem 0;
`;

const Expedition = () => {
  return (
    <Container>
      <CreateRoute />
      <RouteList />
    </Container>
  );
};

export default Expedition;
