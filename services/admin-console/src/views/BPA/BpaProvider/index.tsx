import { useState } from 'react';
import styled from 'styled-components';
import { FlexBox } from '../../../components/Layout';
import { Typography } from '../../../components/Typography';
import { useBpaProvidersQuery } from '../../../hooks/queries/bpaQueries';
import { IBpaProvider } from '../../../types/bpa';
import { className } from '../../../utils/style';
import CreateBpaProvider from './CreateBpaProvider';

const cls = className();

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  }
`;

const BpaProvider = () => {
  const providersQuery = useBpaProvidersQuery({
    select: (res) => res.data.providers,
  });
  const [editingProvider, setEditingProvider] = useState<IBpaProvider | null>(null);

  return (
    <Container>
      <div className={cls.set('left')}>
        <div className={cls.set('header')}>
          <Typography textStyle="md24">BPA Providers</Typography>
        </div>
        <div className="routeList">
          {providersQuery.data?.map((provider) => {
            return (
              <div className="routeListItem" key={provider.id}>
                <FlexBox justify="space-between">
                  <Typography textStyle="sm18" display="block">
                    {provider.name}
                  </Typography>
                </FlexBox>
                <br />
                <Typography textStyle="sm14" display="block">
                  {provider.description}
                </Typography>
                <br />
                <FlexBox justify="flex-end">
                  <button
                    className={cls.set('viewButton')}
                    onClick={() => setEditingProvider(provider)}
                  >
                    Edit
                  </button>
                </FlexBox>
              </div>
            );
          })}
        </div>
      </div>
      <div className={cls.set('right')}>
        <CreateBpaProvider
          editingProvider={editingProvider}
          reset={() => setEditingProvider(null)}
        />
      </div>
    </Container>
  );
};

export default BpaProvider;
