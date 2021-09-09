import { useMutation } from '@apollo/client';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useState } from 'react';
import styled from 'styled-components';
import * as yup from 'yup';
import { Typography } from '../../components/Typography';
import { CreateExpeditionDocument } from '../../gql/graphql-operations';

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
  description: yup.string().required('Description is required'),
  startDate: yup.date().nullable().required('Start date is required'),
  endDate: yup
    .date()
    .nullable()
    .min(yup.ref('startDate'), 'End date cannot be before start date')
    .required('End date is required'),
  longitude: yup.number().nullable().required('Longitude is required'),
  latitude: yup.number().nullable().required('Latitude is required'),
  altitude: yup.number().nullable(),
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

const CreateExpedition = () => {
  const [file, setFile] = useState<File | null>(null);
  const [createExpedition] = useMutation(CreateExpeditionDocument, {
    refetchQueries: ['GetExpeditions'],
    context: { requireAdminToken: true },
  });

  return (
    <Container>
      <Typography textStyle="md24" textAlign="center">
        New Expedition
      </Typography>
      <Formik
        initialValues={initialFormData}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          if (!file) {
            return alert('Please upload a valid GPX file');
          }

          await createExpedition({
            variables: {
              expedition: {
                name: values.name,
                description: values.description,
                startDateTime: values.startDate!,
                endDateTime: values.endDate!,
                longitude: values.longitude!,
                latitude: values.latitude!,
                altitude: values.altitude,
              },
              gpxFile: file,
            },
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
                <FormLabel>Description</FormLabel>
                <FormInput name="description" />
                <ErrorMsg name="description" />
              </InputContainer>
              <InputContainer>
                <FormLabel>Start Date</FormLabel>
                <FormInput type="datetime-local" name="startDate" />
                <ErrorMsg name="startDate" />
              </InputContainer>
              <InputContainer>
                <FormLabel>End Date</FormLabel>
                <FormInput type="datetime-local" name="endDate" />
                <ErrorMsg name="endDate" />
              </InputContainer>
              <InputContainer>
                <FormLabel>Longitude</FormLabel>
                <FormInput type="number" name="longitude" />
                <ErrorMsg name="longitude" />
              </InputContainer>
              <InputContainer>
                <FormLabel>Latitude</FormLabel>
                <FormInput type="number" name="latitude" />
                <ErrorMsg name="latitude" />
              </InputContainer>
              <InputContainer>
                <FormLabel>Altitude</FormLabel>
                <FormInput type="number" name="altitude" />
                <ErrorMsg name="altitude" />
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
                {isSubmitting ? 'Creating Expedition...' : 'Create Expedition'}
              </button>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default CreateExpedition;
