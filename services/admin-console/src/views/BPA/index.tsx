import { Link, Outlet, useMatch } from 'react-router-dom';
import styled from 'styled-components';
import { GridBox } from '../../components/Layout';
import { Typography } from '../../components/Typography';
import appRoutes from '../../config/appRoutes';
import { className } from '../../utils/style';

const cls = className();

const Container = styled.div`
  padding: 3rem;
  padding-top: 0;

  ${cls.get('top')} {
    margin: auto;
    max-width: 500px;
    margin-bottom: 3rem;
  }
`;

const bpaLinks: { id: string; name: string; url: string }[] = [
  { id: 'report', name: 'Reports', url: appRoutes.bpa.report },
  { id: 'zone', name: 'Zones', url: appRoutes.bpa.zone },
  { id: 'provider', name: 'Providers', url: appRoutes.bpa.provider },
];

const BPA = () => {
  const match = useMatch('/bpa/:id');

  return (
    <Container>
      <div className={cls.set('top')}>
        <Typography textStyle="md24" textAlign="center">
          BPA Management
        </Typography>
        <GridBox direction="column" gap={20} justify="center" box={{ mTop: '3rem' }}>
          {bpaLinks.map((link) => {
            const isActive = match?.params.id === link.id;

            return (
              <div key={link.id} className={cls.set('item')}>
                <Link to={link.url}>
                  <Typography
                    textStyle="sm18"
                    textAlign="center"
                    decoration={isActive ? 'underline' : 'none'}
                    textTheme={{ weight: isActive ? 600 : 400 }}
                  >
                    {link.name}
                  </Typography>
                </Link>
              </div>
            );
          })}
        </GridBox>
      </div>

      <div>
        <Outlet />
      </div>
    </Container>
  );
};

export default BPA;
