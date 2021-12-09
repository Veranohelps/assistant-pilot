import styled from 'styled-components';
import { Typography } from '../Typography';

const Text = styled(Typography)`
  margin-bottom: 5px;
`;

const FormLabel = (props: { children: React.ReactNode }) => {
  return (
    <Text as="label" textStyle="sm14" textColor="primary600">
      {props.children}
    </Text>
  );
};

export default FormLabel;
