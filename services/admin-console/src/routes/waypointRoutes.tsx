import { Route, Routes } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import AuthRoute from '../components/AuthRoute';
import NotFound from '../views/Error/NotFound';
import Waypoint from '../views/Waypoint';

const WaypointRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<AppLayout />}>
        <Route path="" element={<AuthRoute el={<Waypoint />} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default WaypointRoutes;
