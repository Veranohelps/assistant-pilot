import { Route, Routes } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Dashboard from '../views/Dashboard';
import RouteRoutes from './routeRoutes';
import WaypointRoutes from './waypointRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="route/*" element={<RouteRoutes />} />
      <Route path="waypoint/*" element={<WaypointRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
