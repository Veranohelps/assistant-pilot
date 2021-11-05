import L from 'leaflet';
import React, { useRef, useState } from 'react';
import { Circle, MapContainer, TileLayer, Tooltip, useMapEvents } from 'react-leaflet';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import GetMap from '../../components/GetMap';
import { waypointsByBoundingBox } from '../../services/waypointService';
import { IPolygonGeometry } from '../../types/geometry';
import { IWaypoint } from '../../types/waypoint';
import { className } from '../../utils/style';
import WaypointBulkUpload from './WaypointBulkUpload';
import WaypointForm from './WaypointForm';

const cls = className();

const Container = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;

  ${cls.get('mapContainer')} {
    width: 60rem;
    display: grid;
    grid-template-rows: 30rem auto;
    gap: 2rem;

    .leaflet-container {
      height: 100%;
      border: 2px solid black;
      border-radius: 5px;
    }
  }
`;

const boundsToPolygon = (bounds: L.LatLngBounds): IPolygonGeometry => {
  return L.rectangle(bounds).toGeoJSON().geometry as IPolygonGeometry;
};

const WaypointLayers = (props: { onWaypointSelect: (waypoint: IWaypoint) => void }) => {
  const map = useMapEvents({
    zoomend: () => setBounds(boundsToPolygon(map.getBounds())),
    moveend: () => setBounds(boundsToPolygon(map.getBounds())),
  });
  const [bounds, setBounds] = useState<IPolygonGeometry>(boundsToPolygon(map.getBounds()));
  const waypointsQuery = useQuery(['waypoint', bounds], () => waypointsByBoundingBox(bounds), {
    select: (res) => res.data.waypoints,
    keepPreviousData: true,
  });

  return (
    <>
      {waypointsQuery.data?.map((waypoint) => {
        return (
          <Circle
            key={waypoint.id}
            radius={100}
            center={L.latLng(
              waypoint.coordinate.coordinates[1],
              waypoint.coordinate.coordinates[0],
              waypoint.coordinate.coordinates[2] ?? 0
            )}
            eventHandlers={{
              click: () => props.onWaypointSelect(waypoint),
            }}
          >
            <Tooltip>{waypoint.name}</Tooltip>
          </Circle>
        );
      })}
    </>
  );
};

const Waypoint = () => {
  const [activeWaypoint, setActiveWaypoint] = useState<IWaypoint | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  return (
    <Container>
      <div className={cls.set('mapContainer')}>
        <MapContainer center={L.latLng(40.416775, -3.70379)} zoom={13} scrollWheelZoom>
          <GetMap ref={mapRef} />
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <WaypointLayers onWaypointSelect={setActiveWaypoint} />
        </MapContainer>
        <WaypointBulkUpload mapRef={mapRef} />
      </div>
      <WaypointForm waypoint={activeWaypoint} clear={() => setActiveWaypoint(null)} />
    </Container>
  );
};

export default Waypoint;
