import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';
import { Button } from '../../components/Button';
import { Box, FlexBox } from '../../components/Layout';
import { Typography } from '../../components/Typography';
import appRoutes from '../../config/appRoutes';
import { getActivityTypesService } from '../../services/activityTypeService';
import { getSkillDictionary } from '../../services/dictionaryService';
import {
  cloneRouteService,
  createRouteService,
  deleteRouteService,
  editRouteService,
  getRouteByIdService,
} from '../../services/routeService';
import { ISkillDictionary } from '../../types/dictionary';
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

    ${cls.get('activityTypes')} {
      display: flex;
      flex-wrap: wrap;

      label {
        margin: 5px 10px 0;
        display: flex;
        align-items: center;

        input {
          margin-right: 5px;
        }
      }
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

interface IForm {
  name: string;
  description: string;
  activityTypes: string[];
  levels: Record<string, string>;
}

const initialFormData: IForm = {
  name: '',
  description: '',
  activityTypes: [],
  levels: {},
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
const FormLabel = (props: { children: React.ReactNode }) => {
  return (
    <Typography className={cls.set('formLabel')} as="label" textStyle="sm14" textColor="primary600">
      {props.children}
    </Typography>
  );
};

interface IProps {
  isEditing?: boolean;
  isCloning?: boolean;
}

const CreateRoute = (props: IProps) => {
  const params = useParams<'routeId'>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [defaultLevels, setDefaultLevels] = useState({} as Record<string, string>);
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
  const cloneRoute = useMutation(
    (data: Partial<ICreateRoutePayload>) => cloneRouteService(params.routeId as string, data),
    {
      onSuccess: () => {
        invalidate();
        navigate(appRoutes.route.dashboard);
      },
    }
  );
  const deleteRoute = useMutation(deleteRouteService, {
    onSuccess: () => {
      invalidate();
      navigate(appRoutes.route.dashboard);
    },
  });
  const routeQuery = useQuery(
    ['route', params.routeId],
    () => getRouteByIdService(params.routeId!),
    {
      select: (res) => res.data.route,
      refetchOnMount: true,
      staleTime: Infinity,
      enabled: !!params.routeId,
    }
  );
  const activityTypesQuery = useQuery(['activity-type'], getActivityTypesService, {
    select: (res) => res.data.activityTypes,
    staleTime: Infinity,
  });
  const skillDictQuery = useQuery(['dictionary', 'skill'], getSkillDictionary, {
    select: (res) => res.data.skills.map((s) => s.skills).flat(),
    onSuccess: (res: ISkillDictionary['skills']) => {
      const levels =
        res.reduce((acc, curr) => {
          acc[curr.id] = '';

          return acc;
        }, {} as Record<string, string>) ?? {};

      setDefaultLevels(levels);
      setFormData({ ...formData, levels: { ...levels, ...formData.levels } });
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (props.isEditing && routeQuery.data) {
      const levels =
        routeQuery.data.levels?.reduce((acc, curr) => {
          acc[curr.skillId] = curr.id;

          return acc;
        }, {} as Record<string, string>) ?? {};

      setFormData({
        name: routeQuery.data.name,
        description: routeQuery.data.description ?? '',
        activityTypes: routeQuery.data.activityTypeIds,
        levels: { ...defaultLevels, ...levels },
      });
    }
  }, [routeQuery.data, props.isEditing, defaultLevels]);

  return (
    <Container>
      <div className={cls.set('header')}>
        <Typography textStyle="md24">
          {props.isEditing
            ? 'Edit Route'
            : props.isCloning
            ? `Clone Route (${routeQuery.data?.name ?? ''})`
            : 'New Route'}
        </Typography>{' '}
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
          const data = {
            name: values.name,
            description: values.description || null,
            gpx: file ?? undefined,
            activityTypes: values.activityTypes,
            levels: Object.values(values.levels).filter((l) => l !== ''),
          };

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

            await editRoute.mutateAsync(data);
          } else if (props.isCloning) {
            await cloneRoute.mutateAsync(data);
          } else {
            if (!file) {
              return alert('Please upload a valid GPX file');
            }

            await createRoute.mutateAsync({ ...data, gpx: file });
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
                <ErrorMsg name="name" />
              </InputContainer>
              <InputContainer>
                <FormLabel>Description</FormLabel>
                <Field name="description" as="textarea" />
                <ErrorMsg name="description" />
              </InputContainer>
              {!props.isCloning && (
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
              )}
              <InputContainer>
                <FormLabel>Levels</FormLabel>
                <div className={cls.set('activityTypes')}>
                  {skillDictQuery.data?.map((skill) => {
                    return (
                      <Box key={skill.id} mBottom={10}>
                        <FormLabel>{skill.name}</FormLabel>
                        <>
                          <FormLabel>
                            <Field type="radio" name={`levels.${skill.id}`} value="" />
                            None
                          </FormLabel>
                          {skill.levels.map((level) => {
                            return (
                              <FormLabel key={level.id}>
                                <Field type="radio" name={`levels.${skill.id}`} value={level.id} />
                                {level.name}
                              </FormLabel>
                            );
                          })}
                        </>
                      </Box>
                    );
                  })}
                </div>
                <ErrorMsg name="type" />
              </InputContainer>
              <InputContainer>
                <FormLabel>Activity type</FormLabel>
                <div className={cls.set('activityTypes')}>
                  {activityTypesQuery.data?.map((type) => {
                    return (
                      <FormLabel key={type.id}>
                        <Field type="checkbox" name="activityTypes" value={type.id} />
                        {type.name}
                      </FormLabel>
                    );
                  })}
                </div>
                <ErrorMsg name="type" />
              </InputContainer>
              <FlexBox box={{ mTop: 30 }}>
                <Button type="submit" className="submitButton">
                  {props.isEditing
                    ? isSubmitting
                      ? 'Saving changes...'
                      : 'Edit Route'
                    : props.isCloning
                    ? isSubmitting
                      ? 'Cloning Route...'
                      : 'Clone'
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
