import { Route, Routes } from 'react-router-dom';
import CreateRoute from '../views/Route/CreateRoute';
import RouteList from '../views/Route/RouteList';

const RouteRoutes = () => {
  return (
    <Routes>
      <Route path="/*">
        <Route path="" element={<RouteList />} />
        <Route path="create" element={<CreateRoute />} />
        <Route path=":routeId/edit" element={<CreateRoute isEditing />} />
      </Route>
    </Routes>
  );
};

export default RouteRoutes;
