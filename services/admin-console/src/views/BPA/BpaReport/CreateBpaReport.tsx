import { addDays, format, max, startOfDay, startOfToday } from 'date-fns';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';
import { Button } from '../../../components/Button';
import FileInput from '../../../components/Form/FileInput';
import FormErrorMessage from '../../../components/Form/FormErrorMessage';
import FormLabel from '../../../components/Form/FormLabel';
import InputContainer from '../../../components/Form/InputContainer';
import { FlexBox } from '../../../components/Layout';
import { Typography } from '../../../components/Typography';
import appRoutes from '../../../config/appRoutes';
import { useCreateBpaReport, useUpdateBpaReport } from '../../../hooks/mutations/bpaMutations';
import { useBpaProvidersQuery, useBpaZonesQuery } from '../../../hooks/queries/bpaQueries';
import { IBpaReport } from '../../../types/bpa';
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
    select,
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

interface IForm {
  zoneIds: string[];
  providerId: string;
  publishDateTime: Date;
  validUntilDateTime: Date;
  pdf: File | null;
}

const initialFormData: IForm = {
  zoneIds: [],
  providerId: '',
  publishDateTime: startOfToday(),
  validUntilDateTime: addDays(startOfToday(), 1),
  pdf: null,
};

const createSchema = yup.object().shape({
  providerId: yup.string().required('Choose a provider'),
  zoneIds: yup.array().min(1, 'Select a zone'),
  publishDateTime: yup.date().max(startOfToday(), 'Publish date must be at most today').required(),
  validUntilDateTime: yup
    .date()
    .min(startOfToday(), 'Valid until date must be at least today')
    .min(yup.ref('publishDateTime'), 'Valid until must be greater than publish date')
    .required(),
  pdf: yup.mixed().nullable().required('Report PDF is required'),
});
const editSchema = yup.object().shape({
  providerId: yup.string().required('Choose a provider'),
  zoneIds: yup.array().min(1, 'Select a zone'),
  publishDateTime: yup.date().max(startOfToday(), 'Publish date must be at most today').required(),
  validUntilDateTime: yup
    .date()
    .min(startOfToday(), 'Valid until date must be at least today')
    .min(yup.ref('publishDateTime'), 'Valid until must be greater than publish date')
    .required(),
});

interface IProps {
  editingReport: IBpaReport | null;
  reset: VoidFunction;
}

const CreateBpaReport = (props: IProps) => {
  const [formData, setFormData] = useState(initialFormData);
  const zonesQuery = useBpaZonesQuery({ select: (res) => res.data.zones });
  const providersQuery = useBpaProvidersQuery({
    select: (res) => res.data.providers,
  });
  const createReport = useCreateBpaReport();
  const editReport = useUpdateBpaReport(props.editingReport?.id ?? '');

  const resetForm = () => {
    setFormData(initialFormData);
    props.reset();
  };

  useEffect(() => {
    if (props.editingReport) {
      setFormData({
        zoneIds: props.editingReport.zoneIds,
        providerId: props.editingReport.providerId,
        publishDateTime: new Date(props.editingReport.publishDateTime),
        validUntilDateTime: new Date(props.editingReport.validUntilDateTime),
        pdf: null,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [props.editingReport]);

  return (
    <Container>
      <div className={cls.set('header')}>
        <Typography textStyle="md24">
          {props.editingReport ? 'Edit Report' : 'New Report'}
        </Typography>
      </div>
      <Formik
        initialValues={formData}
        enableReinitialize
        validationSchema={props.editingReport ? editSchema : createSchema}
        onSubmit={async (values, helpers) => {
          const data = {
            zoneIds: values.zoneIds,
            providerId: values.providerId!,
            publishDateTime: values.publishDateTime!,
            validUntilDateTime: values.validUntilDateTime!,
          };

          if (props.editingReport) {
            await editReport.mutateAsync({ ...data, pdf: values.pdf ?? undefined });
          } else {
            await createReport.mutateAsync({ ...data, pdf: values.pdf as File });
          }

          helpers.resetForm();
          resetForm();
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => {
          console.log(values.publishDateTime, startOfDay(values.publishDateTime), startOfToday())
          return (
            <Form>
              <InputContainer>
                <FormLabel>Provider</FormLabel>
                <Field as="select" name="providerId">
                  <option value="">Select provider</option>
                  {providersQuery.data?.map((provider) => {
                    return (
                      <option key={provider.id} value={provider.id}>
                        {provider.name}
                      </option>
                    );
                  })}
                </Field>
                <FormErrorMessage name="providerId" />
                <Link to={appRoutes.bpa.provider}>
                  <Typography textStyle="sm12" decoration="underline">
                    Add providers
                  </Typography>
                </Link>
              </InputContainer>
              <InputContainer>
                <FormLabel>Zones</FormLabel>
                <div className={cls.set('activityTypes')}>
                  {zonesQuery.data?.map((zone) => {
                    return (
                      <FormLabel key={zone.id}>
                        <Field type="checkbox" name="zoneIds" value={zone.id} />
                        {zone.name}
                      </FormLabel>
                    );
                  })}
                </div>
                <FormErrorMessage name="zoneIds" />
                <Link to={appRoutes.bpa.zone}>
                  <Typography textStyle="sm12" decoration="underline">
                    Add zones
                  </Typography>
                </Link>
              </InputContainer>
              <InputContainer>
                <FormLabel>Publish date</FormLabel>
                <input
                  type="date"
                  name="publishDateTime"
                  disabled={!!props.editingReport}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  value={format(values.publishDateTime, 'yyyy-MM-dd')}
                  onChange={(e) => setFieldValue('publishDateTime', startOfDay(new Date(e.target.value)))}
                />
                <FormErrorMessage name="publishDateTime" />
              </InputContainer>
              <InputContainer>
                <FormLabel>Valid until</FormLabel>
                <input
                  type="date"
                  name="validUntilDateTime"
                  disabled={!!props.editingReport}
                  min={format(max([addDays(values.publishDateTime, 1), startOfToday()]), 'yyyy-MM-dd')}
                  value={format(values.validUntilDateTime, 'yyyy-MM-dd')}
                  onChange={(e) => setFieldValue('validUntilDateTime', new Date(e.target.value))}
                />
                <FormErrorMessage name="validUntilDateTime" />
              </InputContainer>
              <InputContainer>
                <FormLabel>Upload report PDF</FormLabel>
                <FileInput name="pdf" accept=".pdf" />
                <FormErrorMessage name="pdf" />
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
                  {props.editingReport
                    ? isSubmitting
                      ? 'Saving changes...'
                      : 'Edit Report'
                    : isSubmitting
                    ? 'Creating Report...'
                    : 'Create Report'}
                </Button>
              </FlexBox>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default CreateBpaReport;
