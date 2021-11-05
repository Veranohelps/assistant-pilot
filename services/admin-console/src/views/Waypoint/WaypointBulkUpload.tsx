import L from 'leaflet';
import React, { MutableRefObject, useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { Button } from '../../components/Button';
import { GridBox } from '../../components/Layout';
import { Typography } from '../../components/Typography';
import { createWaypointBulkService } from '../../services/waypointService';
import { className } from '../../utils/style';

const cls = className();

const Container = styled.div`
  width: 100%;
  max-width: 500px;

  ${cls.get('header')} {
    position: relative;
    margin-bottom: 1rem;
  }

  ${cls.get('submitButton')} {
    padding: 10px;
    margin: auto;
    display: block;
    margin-top: 2rem;
  }
`;

interface IProps {
  mapRef: MutableRefObject<L.Map | null>;
}

const WaypointBulkUpload = (props: IProps) => {
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [ignoreDuplicates, setIgnoreDuplicates] = useState(false);
  const queryClient = useQueryClient();

  const bulkCreateWaypoint = useMutation(createWaypointBulkService, {
    onSuccess: (data) => {
      if (data.boundingBox) {
        props.mapRef.current?.flyToBounds(L.geoJSON(data.boundingBox).getBounds());
      }

      queryClient.invalidateQueries('waypoint');
    },
  });

  const onSubmit = () => {
    if (!file) {
      window.alert('Please select a GPX file to upload waypoints from');

      return;
    }

    if (window.confirm('You are attempting to upload multiple waypoints at once. Are you sure?')) {
      bulkCreateWaypoint.mutate(
        { gpx: file, ignoreDuplicates },
        {
          onSuccess: () => {
            inputFileRef.current!.value = '';
            setFile(null);
          },
        }
      );
    }
  };

  return (
    <Container>
      <div className={cls.set('header')}>
        <Typography textStyle="md24">Bulk Upload Waypoints</Typography>
      </div>
      <GridBox direction="row" gap={20}>
        <input
          ref={inputFileRef}
          type="file"
          accept=".gpx"
          onChange={(e) => {
            const gpx = e.target.files?.[0] ?? null;

            setFile(gpx);
          }}
        />
        <Typography
          className={cls.set('formLabel')}
          as="label"
          textStyle="sm14"
          textColor="primary"
        >
          <input
            type="checkbox"
            name="type"
            checked={ignoreDuplicates}
            onChange={(e) => setIgnoreDuplicates(e.target.checked)}
          />
          {'  '} Ignore duplicates
        </Typography>
      </GridBox>
      <Button
        type="button"
        className="submitButton"
        onClick={onSubmit}
        box={{ mTop: 30 }}
        disabled={bulkCreateWaypoint.isLoading}
      >
        {bulkCreateWaypoint.isLoading ? 'Uploading...' : 'Upload Waypoints'}
      </Button>
    </Container>
  );
};

export default WaypointBulkUpload;
