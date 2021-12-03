import L from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Polyline, TileLayer, Tooltip } from 'react-leaflet';
import styled from 'styled-components';
import GetMap from '../../../components/GetMap';
import { FlexBox, GridBox } from '../../../components/Layout';
import { Typography } from '../../../components/Typography';
import { useBpaZonesQuery } from '../../../hooks/queries/bpaQueries';
import { IBpaZone } from '../../../types/bpa';
import { className } from '../../../utils/style';
import CreateBpaZone from './CreateBpaZone';

const cls = className();

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  height: 100%;
  overflow: auto;

  ${cls.get('left')} {
    width: 90%;
    max-width: 500px;
    margin: 0 auto;
    padding-bottom: 2rem;
    padding-right: 10px;
    max-height: 100%;
    overflow: auto;
    position: relative;
    background-color: #fff;

    ${cls.get('header')} {
      position: sticky;
      top: 0;
      text-align: center;
      background-color: #fff;
      padding-bottom: 1rem;

      ${cls.get('createLink')} {
        position: absolute;
        right: 0;
      }
    }

    .routeList {
      padding: 2rem 0;
      display: grid;
      grid-auto-flow: row;
      gap: 10px;
    }

    .routeListItem {
      border: 1px solid;
      padding: 1rem;
      border-radius: 5px;
      display: grid;
      grid-auto-flow: row;
      gap: 5px;
    }

    .routeContainer {
      margin-bottom: 10px;
    }

    ${cls.get('viewButton')} {
      outline: none;
      background: none;
      border: none;
      cursor: pointer;
    }
  }

  ${cls.get('right')} {
    position: sticky;
    top: 50px;

    .leaflet-container {
      width: 60rem;
      height: 30rem;
      border: 2px solid black;
      border-radius: 5px;
    }

    ${cls.get('formContainer')} {
    }
  }
`;

const BpaZone = () => {
  const mapRef = useRef<L.Map | null>(null);
  const zonesQuery = useBpaZonesQuery({ select: (res) => res.data.zones });
  const [viewingZone, setViewingZone] = useState<IBpaZone | null>(null);
  const [editingZone, setEditingZone] = useState<IBpaZone | null>(null);
  const zoneTrack = useMemo(() => {
    if (viewingZone) {
      return viewingZone.coordinate!.coordinates.flat().map((c) => L.latLng(c[1], c[0]));
    }

    return [];
  }, [viewingZone]);

  useEffect(() => {
    if (viewingZone) {
      mapRef.current?.flyToBounds(L.geoJSON(viewingZone.coordinate).getBounds());
    }
  }, [viewingZone]);

  return (
    <Container>
      <div className={cls.set('left')}>
        <div className={cls.set('header')}>
          <Typography textStyle="md24">BPA Zones</Typography>
        </div>
        <div className="routeList">
          {zonesQuery.data?.map((zone) => {
            return (
              <div className="routeListItem" key={zone.id}>
                <FlexBox justify="space-between">
                  <Typography textStyle="sm18" display="block">
                    {zone.name}
                  </Typography>
                  <button className={cls.set('viewButton')} onClick={() => setViewingZone(zone)}>
                    <Typography textStyle="sm14">view</Typography>
                  </button>
                </FlexBox>
                <Typography textStyle="sm14" display="block">
                  {zone.description}
                </Typography>
                <Typography textStyle="sm14" display="block">
                  No. of reports: {zone.reportCount}
                </Typography>
                <GridBox justify="flex-end" direction="column" gap={16}>
                  <button className={cls.set('viewButton')} onClick={() => setEditingZone(zone)}>
                    <Typography textStyle="sm14" style={{ color: 'red' }}>
                      Delete
                    </Typography>
                  </button>
                  <button className={cls.set('viewButton')} onClick={() => setEditingZone(zone)}>
                    <Typography textStyle="sm14">Edit</Typography>
                  </button>
                </GridBox>
              </div>
            );
          })}
        </div>
      </div>
      <div className={cls.set('right')}>
        <MapContainer center={L.latLng(40.416775, -3.70379)} zoom={13} scrollWheelZoom>
          <Polyline positions={zoneTrack}>
            <Tooltip>{viewingZone?.name}</Tooltip>
          </Polyline>
          <GetMap ref={mapRef} />
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
        <CreateBpaZone editingZone={editingZone} reset={() => setEditingZone(null)} />
      </div>
    </Container>
  );
};

export default BpaZone;
