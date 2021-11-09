import { useAuth0 } from '@auth0/auth0-react';
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

const Unauthorized = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Container>
      <Typography
        textStyle="lg36"
        textAlign="center"
        textTheme={{ weight: 500 }}
        box={{ mBottom: 32 }}
      >
        401
      </Typography>
      <Typography textStyle="md20" textAlign="center">
        Hey there, we don't know you so we can't let you see whatever it is you're looking for. If
        you're one of us, kindly login
      </Typography>
      <FlexBox justify="center" box={{ mTop: 36 }}>
        <Button onClick={() => loginWithRedirect()}>Login</Button>
      </FlexBox>
    </Container>
  );
};

export default Unauthorized;
