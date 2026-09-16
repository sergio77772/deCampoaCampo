import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '../services/pokemonApi';
import teamReducer from '../features/team/teamSlice';
import connectionReducer from '../features/connection/connectionSlice';
import theme from '../styles/theme';

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        [pokemonApi.reducerPath]: pokemonApi.reducer,
        team: teamReducer,
        connection: connectionReducer,
      },
      preloadedState,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }).concat(pokemonApi.middleware),
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <MemoryRouter>{children}</MemoryRouter>
        </ThemeProvider>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
