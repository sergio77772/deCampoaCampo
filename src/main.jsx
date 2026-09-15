import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { store, persistor } from './app/store';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* PersistGate bloquea el renderizado hasta que el store sea rehidratado */}
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <BrowserRouter>
            <App />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1e1e2e',
                  color: '#e2e8f0',
                  border: '1px solid rgba(108, 99, 255, 0.3)',
                  borderRadius: '12px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px',
                },
                success: {
                  iconTheme: { primary: '#4ade80', secondary: '#1e1e2e' },
                },
                error: {
                  iconTheme: { primary: '#ff6b6b', secondary: '#1e1e2e' },
                },
              }}
            />
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
