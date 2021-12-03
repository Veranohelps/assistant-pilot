import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as yup from 'yup';
import { Button } from '../../../components/Button';
import FileInput from '../../../components/Form/FileInput';
import FormErrorMessage from '../../../components/Form/FormErrorMessage';
import FormLabel from '../../../components/Form/FormLabel';
import InputContainer from '../../../components/Form/InputContainer';
import { FlexBox } from '../../../components/Layout';
import { Typography } from '../../../components/Typography';
import { useCreateBpaZone, useUpdateBpaZone } from '../../../hooks/mutations/bpaMutations';
import { IBpaZone } from '../../../types/bpa';
import { className } from '../../../utils/style';

const cls = className();

const Container = styled.div`
  margin: 0 auto;
  width: 90%;
  max-width: 500px;
  padding: 2rem 0;

  ${cls.get('header')} {
    text-align: center;
    position: relative;

    ${cls.get('deleteButton')} {
      position: absolute;
      right: 0;
    }
  }

  form {
    padding: 2rem 0;

    input,
    textarea {
      padding: 5px 8px;
      border-radius: 4px;
    }
  }

  ${cls.get('submitButton')} {
    padding: 10px;
    margin: auto;
    display: block;
    margin-top: 2rem;
  }
`;

interface IForm {
  name: string;
  description: string;
  geojson: File | null;
}

const initialFormData: IForm = {
  name: '',
  description: '',
  geojson: null,
};

const createSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string(),
  geojson: yup.mixed().nullable().required('Geojson file is required'),
});
const editSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string(),
});

interface IProps {
  editingZone: IBpaZone | null;
  reset: VoidFunction;
}

const CreateBpaZone = (props: IProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const createZone = useCreateBpaZone();
  const editZone = useUpdateBpaZone(props.editingZone?.id!);

  const resetForm = () => {
    setFormData(initialFormData);
    props.reset();
  };

  useEffect(() => {
    if (props.editingZone) {
      setFormData({
        name: props.editingZone.name,
        description: props.editingZone.description ?? '',
        geojson: null,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [props.editingZone]);

  return (
    <Container>
      <div className={cls.set('header')}>
        <Typography textStyle="md24">{props.editingZone ? 'Edit Zone' : 'New Zone'}</Typography>
      </div>
      <Formik
        initialValues={formData}
        enableReinitialize
        validationSchema={props.editingZone ? editSchema : createSchema}
        onSubmit={async (values, helpers) => {
          const data = {
            name: values.name,
            description: values.description || null,
          };

          if (props.editingZone) {
            await editZone.mutateAsync({ ...data, geojson: values.geojson ?? undefined });
          } else {
            await createZone.mutateAsync({ ...data, geojson: values.geojson as File });
          }

          helpers.resetForm();
          resetForm();
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <InputContainer>
                <FormLabel>Name</FormLabel>
                <Field name="name" />
                <FormErrorMessage name="name" />
              </InputContainer>
              <InputContainer>
                <FormLabel>Description</FormLabel>
                <Field name="description" as="textarea" />
                <FormErrorMessage name="description" />
              </InputContainer>
              <InputContainer>
                <FormLabel>Upload GEOJSON</FormLabel>
                <FileInput name="geojson" accept=".geojson" />
                <FormErrorMessage name="geojson" />
              </InputContainer>

              <FlexBox box={{ mTop: 30 }}>
                <Button
                  type="reset"
                  className="submitButton"
                  onClick={resetForm}
                  box={{ mRight: 10 }}
                >
                  Reset
                </Button>
                <Button type="submit" className="submitButton">
                  {props.editingZone
                    ? isSubmitting
                      ? 'Saving changes...'
                      : 'Edit Zone'
                    : isSubmitting
                    ? 'Creating Zone...'
                    : 'Create Zone'}
                </Button>
              </FlexBox>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default CreateBpaZone;
