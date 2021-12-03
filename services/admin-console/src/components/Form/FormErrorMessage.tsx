import { ErrorMessage } from 'formik';
import styled from 'styled-components';
import { Typography } from '../Typography';

const Text = styled(Typography)`
  margin-top: 2px;
  color: red;
`;

const FormErrorMessage = (props: { name: string }) => {
  return (
    <ErrorMessage name={props.name}>{(msg) => <Text textStyle="sm12">{msg}</Text>}</ErrorMessage>
  );
};

export default FormErrorMessage;
