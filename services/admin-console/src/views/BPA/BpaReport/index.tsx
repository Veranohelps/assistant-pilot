import { useState } from 'react';
import styled from 'styled-components';
import { FlexBox, GridBox } from '../../../components/Layout';
import { Typography } from '../../../components/Typography';
import { useBpaReportsQuery } from '../../../hooks/queries/bpaQueries';
import { IBpaReport } from '../../../types/bpa';
import { className } from '../../../utils/style';
import CreateBpaReport from './CreateBpaReport';

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

const BpaReport = () => {
  const providersQuery = useBpaReportsQuery({
    select: (res) => res.data.reports,
  });
  const [editingReport, setEditingReport] = useState<IBpaReport | null>(null);

  return (
    <Container>
      <div className={cls.set('left')}>
        <div className={cls.set('header')}>
          <Typography textStyle="md24">BPA Reports</Typography>
        </div>
        <div className="routeList">
          {providersQuery.data?.map((report) => {
            return (
              <div className="routeListItem" key={report.id}>
                <GridBox justify="space-between" gap={10}>
                  <Typography textStyle="sm14" display="block">
                    Provider: {report.provider?.name}
                  </Typography>
                  <Typography textStyle="sm14" display="block">
                    Zones: {report.zones?.map((zone) => zone.name).join(' | ')}
                  </Typography>
                  <Typography textStyle="sm14" display="block">
                    Resource URL: {report.resourceUrl}
                  </Typography>
                </GridBox>
                <br />
                <FlexBox justify="flex-end">
                  <button
                    className={cls.set('viewButton')}
                    onClick={() => setEditingReport(report)}
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
        <CreateBpaReport editingReport={editingReport} reset={() => setEditingReport(null)} />
      </div>
    </Container>
  );
};

export default BpaReport;
