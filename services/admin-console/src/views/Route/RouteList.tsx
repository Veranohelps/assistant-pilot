import L from 'leaflet';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Polyline, TileLayer, Tooltip } from 'react-leaflet';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../components/Button';
import GetMap from '../../components/GetMap';
import { FlexBox, GridBox } from '../../components/Layout';
import { Typography } from '../../components/Typography';
import appRoutes from '../../config/appRoutes';
import { getRouteByIdService, getRoutesService } from '../../services/routeService';
import { className } from '../../utils/style';

const cls = className();

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  /* position: relative; */
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
  }
`;

const RouteList = () => {
  const mapRef = useRef<L.Map | null>(null);
  const routesQuery = useQuery(['route'], getRoutesService, {
    select: (res) => res.data.routes,
  });
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const routeQuery = useQuery(
    ['route', selectedRouteId],
    () => getRouteByIdService(selectedRouteId!),
    {
      select: (res) => res.data.route,
      enabled: !!selectedRouteId,
    }
  );

  const routeLine = useMemo(() => {
    if (routeQuery.data) {
      return routeQuery.data.coordinate!.coordinates.map((c) => L.latLng(c[1], c[0]));
    }

    return [];
  }, [routeQuery.data]);

  useEffect(() => {
    if (routeQuery.data) {
      mapRef.current?.flyToBounds(L.geoJSON(routeQuery.data.boundingBox).getBounds());
    }
  }, [routeQuery.data]);

  return (
    <Container>
      <div className={cls.set('left')}>
        <div className={cls.set('header')}>
          <Typography textStyle="md24">Route List</Typography>
          <Link className={cls.set('createLink')} to={appRoutes.route.create}>
            <Button>Create Route</Button>
          </Link>
        </div>
        <div className="routeList">
          {routesQuery.data?.map((route) => {
            return (
              <div className="routeListItem" key={route.id}>
                <FlexBox justify="space-between">
                  <Typography textStyle="sm18" display="block">
                    {route.name}
                  </Typography>
                  <button
                    className={cls.set('viewButton')}
                    onClick={() => setSelectedRouteId(route.id)}
                  >
                    view
                  </button>
                </FlexBox>
                <Typography textStyle="sm14" display="block">
                  {route.description}
                </Typography>
                <br />
                <div className="routeContainer">
                  <Typography as="a" href={route.url}>
                    URL: {route.url}
                  </Typography>
                </div>
                <FlexBox justify="flex-end">
                  <GridBox direction="column" gap={10}>
                    <Link to={appRoutes.route.edit(route.id)}>Edit route</Link>
                    <Typography>|</Typography>
                    <Link to={appRoutes.route.clone(route.id)}>Clone</Link>
                  </GridBox>
                </FlexBox>
              </div>
            );
          })}
        </div>
      </div>
      <div className={cls.set('right')}>
        <MapContainer center={L.latLng(40.416775, -3.70379)} zoom={13} scrollWheelZoom>
          <Polyline positions={routeLine}>
            <Tooltip>{routeQuery.data?.name}</Tooltip>
          </Polyline>
          <GetMap ref={mapRef} />
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>
    </Container>
  );
};

export default RouteList;
