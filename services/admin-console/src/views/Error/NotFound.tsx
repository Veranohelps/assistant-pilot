import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../components/Button';
import { FlexBox } from '../../components/Layout';
import { Typography } from '../../components/Typography';


const Container = styled.div`
  margin: auto;
  padding: 3rem;
  padding-top: 0;
  width: 90%;
  max-width: 62rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

const NotFound = () => {
  return (
    <Container>
      <Typography
        textStyle="lg36"
        textAlign="center"
        textTheme={{ weight: 500 }}
        box={{ mBottom: 32 }}
      >
        404
      </Typography>
      <Typography textStyle="md20" textAlign="center">
        Seems like you're lost, click the button below to start over
      </Typography>
      <FlexBox justify="center" box={{ mTop: 36 }}>
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </FlexBox>
    </Container>
  );
};

export default NotFound;
