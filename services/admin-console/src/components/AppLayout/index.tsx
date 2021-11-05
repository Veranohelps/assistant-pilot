import { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { className } from '../../utils/style';
import TopBar from './TopBar';

const cls = className();

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: auto 1fr;
  overflow: auto;

  ${cls.get('main')} {
    width: 100%;
    height: 100%;
    overflow: auto;

    ${cls.get('contentWrapper')} {
      padding-top: 2rem;
      width: 95%;
      height: 100%;
      margin: auto;
      padding-bottom: 3rem;
    }
  }
`;

interface IProps {
  children?: ReactElement;
}

const AppLayout = (props: IProps) => {
  return (
    <Container>
      <TopBar />
      <div className={cls.set('main')}>
        <div className={cls.set('contentWrapper')}>{props.children ?? <Outlet />}</div>
      </div>
    </Container>
  );
};

export default AppLayout;
