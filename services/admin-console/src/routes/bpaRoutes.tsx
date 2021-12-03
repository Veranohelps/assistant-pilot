import { Route, Routes } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import AuthRoute from '../components/AuthRoute';
import BPA from '../views/BPA';
import BpaProvider from '../views/BPA/BpaProvider';
import BpaReport from '../views/BPA/BpaReport';
import BpaZone from '../views/BPA/BpaZone';
import NotFound from '../views/Error/NotFound';

const BpaRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<AppLayout />}>
        <Route path="" element={<AuthRoute el={<BPA />} />}>
          <Route path="zone" element={<AuthRoute el={<BpaZone />} />} />
          <Route path="provider" element={<AuthRoute el={<BpaProvider />} />} />
          <Route path="report" element={<AuthRoute el={<BpaReport />} />} />
        </Route>
        <Route path=":bpaZoneId">
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default BpaRoutes;
