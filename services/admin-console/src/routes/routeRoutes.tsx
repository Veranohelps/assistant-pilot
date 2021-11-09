import { Route, Routes } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import AuthRoute from '../components/AuthRoute';
import NotFound from '../views/Error/NotFound';
import CreateRoute from '../views/Route/CreateRoute';
import RouteList from '../views/Route/RouteList';

const RouteRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<AppLayout />}>
        <Route path="" element={<AuthRoute el={<RouteList />} />} />
        <Route path="create" element={<AuthRoute el={<CreateRoute />} />} />
        <Route path=":routeId">
          <Route path="edit" element={<AuthRoute el={<CreateRoute isEditing />} />} />
          <Route path="clone" element={<AuthRoute el={<CreateRoute isCloning />} />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default RouteRoutes;
