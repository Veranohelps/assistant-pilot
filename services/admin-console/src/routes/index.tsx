import { Route, Routes } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Dashboard from '../views/Dashboard';
import NotFound from '../views/Error/NotFound';
import RouteRoutes from './routeRoutes';
import WaypointRoutes from './waypointRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="route/*" element={<RouteRoutes />} />
      <Route path="waypoint/*" element={<WaypointRoutes />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
