import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import * as yup from 'yup';
import { Typography } from '../../components/Typography';
import { createRouteService } from '../../services/routeService';

const Container = styled.div`
  margin: 0 auto;
  width: 90%;
  max-width: 500px;

  form {
    padding: 2rem 0;
  }

  .submitButton {
    padding: 10px;
    margin: auto;
    display: block;
    margin-top: 2rem;
  }
`;
const InputContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  margin-bottom: 14px;

  .formLabel {
    margin-bottom: 5px;
  }

  .errorMsg {
    margin-top: 2px;
  }
`;
const FormInput = styled(Field)`
  padding: 5px 8px;
  border-radius: 4px;
`;

interface IForm {
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  longitude: number | null;
  latitude: number | null;
  altitude: number | null;
}

const initialFormData: IForm = {
  name: '',
  description: '',
  startDate: null,
  endDate: null,
  longitude: null,
  latitude: null,
  altitude: null,
};
const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
});

const ErrorMsg = (props: { name: string }) => {
  return (
    <ErrorMessage name={props.name}>
      {(msg) => (
        <Typography className="errorMsg" textStyle="sm12" style={{ color: 'red' }}>
          {msg}
        </Typography>
      )}
    </ErrorMessage>
  );
};
const FormLabel = (props: { children: string }) => {
  return (
    <Typography className="formLabel" textStyle="sm14" textColor="primary600">
      {props.children}
    </Typography>
  );
};

const CreateRoute = () => {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const { mutateAsync: createRoute } = useMutation(createRouteService, {
    onSuccess: () => queryClient.invalidateQueries('routes'),
  });

  return (
    <Container>
      <Typography textStyle="md24" textAlign="center">
        New Route
      </Typography>
      <Formik
        initialValues={initialFormData}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          if (!file) {
            return alert('Please upload a valid GPX file');
          }

          await createRoute({
            name: values.name,
            gpx: file,
          });

          resetForm();
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <InputContainer>
                <FormLabel>Name</FormLabel>
                <FormInput name="name" />
                <ErrorMsg name="name" />
              </InputContainer>
              <InputContainer>
                <FormLabel>Upload GPX</FormLabel>
                <input
                  type="file"
                  accept=".gpx"
                  onChange={(e) => {
                    const gpx = e.target.files?.[0] ?? null;

                    setFile(gpx);
                  }}
                />
              </InputContainer>

              <button type="submit" className="submitButton">
                {isSubmitting ? 'Creating Route...' : 'Create Route'}
              </button>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default CreateRoute;
