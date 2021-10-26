import { Route, Routes } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Waypoint from '../views/Waypoint';

const WaypointRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<AppLayout />}>
        <Route path="" element={<Waypoint />} />
      </Route>
    </Routes>
  );
};

export default WaypointRoutes;
