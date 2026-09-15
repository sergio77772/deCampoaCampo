import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Team from './pages/Team';
import Compare from './pages/Compare';
import NotFound from './pages/NotFound';
import useOnlineStatus from './hooks/useOnlineStatus';

function App() {
  // Registra los listeners de online/offline en el nivel raíz
  useOnlineStatus();

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:name" element={<Detail />} />
        <Route path="/team" element={<Team />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
