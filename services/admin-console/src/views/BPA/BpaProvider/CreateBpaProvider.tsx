import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import * as yup from 'yup';
import { Button } from '../../../components/Button';
import FormErrorMessage from '../../../components/Form/FormErrorMessage';
import FormLabel from '../../../components/Form/FormLabel';
import InputContainer from '../../../components/Form/InputContainer';
import { FlexBox } from '../../../components/Layout';
import { Typography } from '../../../components/Typography';
import { createBpaProviderService, updateBpaProviderService } from '../../../services/bpaService';
import { IBpaProvider, ICreateBpaProviderPayload } from '../../../types/bpa';
import { className } from '../../../utils/style';

const cls = className();

const Container = styled.div`
  margin: 0 auto;
  width: 90%;
  max-width: 500px;

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
}

const initialFormData: IForm = {
  name: '',
  description: '',
};

const createSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
});

interface IProps {
  editingProvider: IBpaProvider | null;
  reset: VoidFunction;
}

const CreateBpaProvider = (props: IProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries(['bpa', 'provider']);
  const createProvider = useMutation(createBpaProviderService, {
    onSuccess: () => {
      invalidate();
    },
  });
  const editProvider = useMutation(
    (data: Partial<ICreateBpaProviderPayload>) =>
      updateBpaProviderService(props.editingProvider!.id, data),
    {
      onSuccess: () => {
        invalidate();
      },
    }
  );

  const resetForm = () => {
    setFormData(initialFormData);
    props.reset();
  };

  useEffect(() => {
    if (props.editingProvider) {
      setFormData({
        name: props.editingProvider.name,
        description: props.editingProvider.description,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [props.editingProvider]);

  return (
    <Container>
      <div className={cls.set('header')}>
        <Typography textStyle="md24">
          {props.editingProvider ? 'Edit Provider' : 'New Provider'}
        </Typography>
      </div>
      <Formik
        initialValues={formData}
        enableReinitialize
        validationSchema={createSchema}
        onSubmit={async (values) => {
          const data = {
            name: values.name,
            description: values.description,
          };

          if (props.editingProvider) {
            await editProvider.mutateAsync(data);
          } else {
            await createProvider.mutateAsync(data);
          }

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
                  {props.editingProvider
                    ? isSubmitting
                      ? 'Saving changes...'
                      : 'Edit Provider'
                    : isSubmitting
                    ? 'Creating Provider...'
                    : 'Create Provider'}
                </Button>
              </FlexBox>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default CreateBpaProvider;
