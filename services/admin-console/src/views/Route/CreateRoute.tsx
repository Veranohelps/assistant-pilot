import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';
import { Button } from '../../components/Button';
import { FlexBox } from '../../components/Layout';
import { Typography } from '../../components/Typography';
import appRoutes from '../../config/appRoutes';
import {
  createRouteService, deleteRouteService, editRouteService, getRouteByIdService
} from '../../services/routeService';
import { ICreateRoutePayload } from '../../types/route';
import { className } from '../../utils/style';

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
const InputContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  margin-bottom: 14px;

  ${cls.get('formLabel')} {
    margin-bottom: 5px;
  }

  ${cls.get('errorMsg')} {
    margin-top: 2px;
  }
`;
// const FormInput = styled(Field)`
//   padding: 5px 8px;
//   border-radius: 4px;
// `;

interface IForm {
  name: string;
  description: string;
}

const initialFormData: IForm = {
  name: '',
  description: '',
};
const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string(),
});

const ErrorMsg = (props: { name: string }) => {
  return (
    <ErrorMessage name={props.name}>
      {(msg) => (
        <Typography className={cls.set('errorMsg')} textStyle="sm12" style={{ color: 'red' }}>
          {msg}
        </Typography>
      )}
    </ErrorMessage>
  );
};
const FormLabel = (props: { children: string }) => {
  return (
    <Typography className={cls.set('formLabel')} textStyle="sm14" textColor="primary600">
      {props.children}
    </Typography>
  );
};

interface IProps {
  isEditing?: boolean;
}

const CreateRoute = (props: IProps) => {
  const params = useParams<'routeId'>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries('route');
  const createRoute = useMutation(createRouteService, {
    onSuccess: () => {
      invalidate();
      navigate(appRoutes.route.dashboard);
    },
  });
  const editRoute = useMutation(
    (data: Partial<ICreateRoutePayload>) => editRouteService(params.routeId as string, data),
    {
      onSuccess: () => {
        invalidate();
      },
    }
  );
  const deleteRoute = useMutation(deleteRouteService, {
    onSuccess: () => {
      invalidate();
      navigate(appRoutes.route.dashboard);
    },
  });
  const routesQuery = useQuery(
    ['route', params.routeId],
    () => getRouteByIdService(params.routeId!),
    {
      select: (res) => res.data.route,
      refetchOnMount: true,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    if (props.isEditing && routesQuery.data) {
      setFormData({
        name: routesQuery.data.name,
        description: routesQuery.data.description ?? '',
      });
    }
  }, [routesQuery.data, props.isEditing]);

  return (
    <Container>
      <div className={cls.set('header')}>
        <Typography textStyle="md24">{props.isEditing ? 'Edit Route' : 'New Route'}</Typography>{' '}
        {props.isEditing && (
          <Button
            className={cls.set('deleteButton')}
            onClick={() => {
              if (window.confirm('Are you sure you want to permanently delete this route?')) {
                deleteRoute.mutateAsync(params.routeId as string);
              }
            }}
            disabled={deleteRoute.isLoading}
          >
            Delete Route
          </Button>
        )}
      </div>
      <Formik
        initialValues={formData}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          if (props.isEditing) {
            if (file) {
              if (
                !window.confirm(
                  'You are updating the coordinates of this route, this would have serious implications for ongoing and upcoming expeditions. Are you sure?'
                )
              ) {
                return;
              }
            }

            await editRoute.mutateAsync({
              name: values.name,
              description: values.description || null,
              gpx: file ?? undefined,
            });
          } else {
            if (!file) {
              return alert('Please upload a valid GPX file');
            }

            await createRoute.mutateAsync({
              name: values.name,
              description: values.description || null,
              gpx: file,
            });
          }

          resetForm();
        }}
      >
        {({ isSubmitting, values }) => {
          return (
            <Form>
              <InputContainer>
                <FormLabel>Name</FormLabel>
                <Field name="name" />
                <ErrorMsg name="name" />
              </InputContainer>
              <InputContainer>
                <FormLabel>Description</FormLabel>
                <Field name="description" as="textarea" />
                <ErrorMsg name="description" />
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
              <FlexBox box={{ mTop: 30 }}>
                <Button type="submit" className="submitButton">
                  {props.isEditing
                    ? isSubmitting
                      ? 'Saving changes...'
                      : 'Edit Route'
                    : isSubmitting
                    ? 'Creating Route...'
                    : 'Create Route'}
                </Button>
              </FlexBox>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default CreateRoute;
