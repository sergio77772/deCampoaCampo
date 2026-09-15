import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { pokemonApi } from '../services/pokemonApi';
import teamReducer from '../features/team/teamSlice';
import connectionReducer from '../features/connection/connectionSlice';

const teamPersistConfig = {
  key: 'team',
  storage,
  version: 1,
};

const apiPersistConfig = {
  key: 'pokemonApi',
  storage,
  whitelist: ['queries'], // Solo persistimos las queries
};

const rootReducer = combineReducers({
  [pokemonApi.reducerPath]: persistReducer(apiPersistConfig, pokemonApi.reducer),
  team: persistReducer(teamPersistConfig, teamReducer),
  connection: connectionReducer, // NO persiste — siempre refleja estado real
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar acciones internas de redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignorar paths donde RTK Query guarda objetos Request no-serializables
        ignoredActionPaths: [
          'meta.arg',
          'payload.timestamp',
          'meta.baseQueryMeta.request',
          'meta.baseQueryMeta.response',
        ],
        ignoredPaths: [
          `${pokemonApi.reducerPath}.queries`,
          `${pokemonApi.reducerPath}.mutations`,
          `${pokemonApi.reducerPath}.provided`,
          `${pokemonApi.reducerPath}.subscriptions`,
          `${pokemonApi.reducerPath}.config`,
        ],
      },
    }).concat(pokemonApi.middleware),
  devTools: import.meta.env.DEV,
});

export const persistor = persistStore(store);

export default store;
