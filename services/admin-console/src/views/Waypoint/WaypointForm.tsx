import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import * as yup from 'yup';
import { Button } from '../../components/Button';
import { FlexBox } from '../../components/Layout';
import { Typography } from '../../components/Typography';
import {
  createWaypointService, deleteWaypointService, updateWaypointService
} from '../../services/waypointService';
import { getWaypointTypesService } from '../../services/waypointTypeService';
import { ICreateWaypointPayload, IWaypoint } from '../../types/waypoint';
import { className } from '../../utils/style';

const cls = className();

const Container = styled.div`
  margin: 0 auto;
  width: 100%;
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

    ${cls.get('waypointTypes')} {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

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
  longitude: number | null;
  latitude: number | null;
  altitude: number | null;
  radiusInMeters: number | null;
  type: string[];
}

const initialFormData: IForm = {
  name: '',
  description: '',
  longitude: null,
  latitude: null,
  altitude: null,
  radiusInMeters: null,
  type: [],
};
const validationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string(),
  longitude: yup.number().nullable().required('Longitude is required'),
  latitude: yup.number().nullable().required('Latitude is required'),
  altitude: yup.number().nullable().required('Altitude is required'),
  radiusInMeters: yup.number().nullable().required('Radius is required'),
  type: yup.array().min(1, 'Type is required'),
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
  waypoint?: IWaypoint | null;
  clear: VoidFunction;
}

const WaypointForm = (props: IProps) => {
  const [selectedWaypoint, setSelectedWaypoint] = useState<IWaypoint | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries('waypoint');
  const createWaypoint = useMutation(createWaypointService, {
    onSuccess: () => {
      invalidate();
    },
  });
  const editWaypoint = useMutation(
    (data: Partial<ICreateWaypointPayload>) =>
      updateWaypointService(selectedWaypoint?.id as string, data),
    {
      onSuccess: () => {
        invalidate();
      },
    }
  );
  const deleteWaypoint = useMutation(deleteWaypointService, {
    onSuccess: () => {
      invalidate();
    },
  });
  const waypointTypesQuery = useQuery(['waypoint-type'], getWaypointTypesService, {
    select: (res) => res.data.waypointTypes,
    staleTime: Infinity,
  });

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedWaypoint(null);
    props.clear();
  };

  useEffect(() => {
    if (props.waypoint) {
      setSelectedWaypoint(props.waypoint);
    }
  }, [props.waypoint]);

  useEffect(() => {
    if (selectedWaypoint) {
      setFormData({
        name: selectedWaypoint.name,
        description: selectedWaypoint.description ?? '',
        longitude: selectedWaypoint.coordinate!.coordinates[0],
        latitude: selectedWaypoint.coordinate!.coordinates[1],
        altitude: selectedWaypoint.coordinate!.coordinates[2],
        radiusInMeters: selectedWaypoint.radiusInMeters,
        type: selectedWaypoint.typeIds,
      });
    }
  }, [selectedWaypoint]);

  return (
    <Container>
      <div className={cls.set('header')}>
        <Typography textStyle="md24">
          {selectedWaypoint ? 'Edit Waypoint' : 'New Waypoint'}
        </Typography>
        {selectedWaypoint && (
          <Button
            className={cls.set('deleteButton')}
            onClick={async () => {
              if (window.confirm('Are you sure you want to permanently delete this waypoint?')) {
                await deleteWaypoint.mutateAsync(selectedWaypoint.id as string);

                resetForm();
              }
            }}
            disabled={deleteWaypoint.isLoading}
          >
            Delete Waypoint
          </Button>
        )}
      </div>
      <Formik
        initialValues={formData}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          const data: ICreateWaypointPayload = {
            types: values.type,
            name: values.name,
            description: values.description || undefined,
            radiusInMeters: values.radiusInMeters!,
            longitude: values.longitude!,
            latitude: values.latitude!,
            altitude: values.altitude!,
          };

          if (selectedWaypoint) {
            await editWaypoint.mutateAsync(data);
          } else {
            await createWaypoint.mutateAsync(data);
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
              <InputContainer>
                <FormLabel>Longitude</FormLabel>
                <Field name="longitude" type="number" />
                <ErrorMsg name="longitude" />
              </InputContainer>
              <InputContainer>
                <FormLabel>Latitude</FormLabel>
                <Field name="latitude" type="number" />
                <ErrorMsg name="latitude" />
              </InputContainer>
              <InputContainer>
                <FormLabel>Altitude</FormLabel>
                <Field name="altitude" type="number" />
                <ErrorMsg name="altitude" />
              </InputContainer>
              <InputContainer>
                <FormLabel>Radius in meters</FormLabel>
                <Field name="radiusInMeters" type="number" />
                <ErrorMsg name="radiusInMeters" />
              </InputContainer>
              <InputContainer>
                <FormLabel>Type</FormLabel>
                <div className={cls.set('waypointTypes')}>
                  {waypointTypesQuery.data?.map((type) => {
                    return (
                      <FormLabel>
                        <Field type="checkbox" name="type" value={type.id} />
                        {type.name}
                      </FormLabel>
                    );
                  })}
                </div>
                <ErrorMsg name="type" />
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
                  {selectedWaypoint
                    ? isSubmitting
                      ? 'Saving changes...'
                      : 'Edit Waypoint'
                    : isSubmitting
                    ? 'Creating Waypoint...'
                    : 'Create Waypoint'}
                </Button>
              </FlexBox>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default WaypointForm;
