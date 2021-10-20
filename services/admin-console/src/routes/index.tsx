import { Route, Routes } from 'react-router-dom';
import Dashboard from '../views/Dashboard';
import RouteRoutes from './routeRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="route/*" element={<RouteRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
