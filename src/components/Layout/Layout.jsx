import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';

const Main = styled.main`
  flex: 1;
  padding-top: 72px; /* Altura del header fijo */
  min-height: calc(100vh - 72px);
`;

function Layout() {
  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>
    </>
  );
}

export default Layout;
