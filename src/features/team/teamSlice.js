import { createSlice } from '@reduxjs/toolkit';

const MAX_TEAM_SIZE = 6;

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    members: [],       // Array de objetos pokémon simplificados
    lastUpdated: null,
  },
  reducers: {
    addToTeam: (state, action) => {
      const pokemon = action.payload;
      if (state.members.length >= MAX_TEAM_SIZE) return; // Bloqueado en el slice
      if (state.members.find((m) => m.id === pokemon.id)) return; // Evitar duplicados
      state.members.push(pokemon);
      state.lastUpdated = Date.now();
    },

    removeFromTeam: (state, action) => {
      const id = action.payload;
      state.members = state.members.filter((m) => m.id !== id);
      state.lastUpdated = Date.now();
    },

    clearTeam: (state) => {
      state.members = [];
      state.lastUpdated = Date.now();
    },

    reorderTeam: (state, action) => {
      // action.payload: { fromIndex, toIndex }
      const { fromIndex, toIndex } = action.payload;
      const [moved] = state.members.splice(fromIndex, 1);
      state.members.splice(toIndex, 0, moved);
      state.lastUpdated = Date.now();
    },
  },
});

export const { addToTeam, removeFromTeam, clearTeam, reorderTeam } =
  teamSlice.actions;

// Selectores
export const selectTeam = (state) => state.team.members;
export const selectTeamIds = (state) => state.team.members.map((m) => m.id);
export const selectIsInTeam = (id) => (state) =>
  state.team.members.some((m) => m.id === id);
export const selectTeamFull = (state) =>
  state.team.members.length >= MAX_TEAM_SIZE;
export const selectTeamCount = (state) => state.team.members.length;

export const MAX_TEAM = MAX_TEAM_SIZE;

export default teamSlice.reducer;
