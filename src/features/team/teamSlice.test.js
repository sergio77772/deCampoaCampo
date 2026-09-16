import { describe, it, expect } from 'vitest';
import teamReducer, { addToTeam, removeFromTeam, clearTeam } from './teamSlice';

describe('teamSlice', () => {
  const initialState = {
    members: [],
    lastUpdated: null,
  };

  const mockPokemon = {
    id: 1,
    name: 'bulbasaur',
    sprite: 'url',
    types: ['grass', 'poison'],
  };

  it('should handle initial state', () => {
    expect(teamReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addToTeam', () => {
    const actual = teamReducer(initialState, addToTeam(mockPokemon));
    expect(actual.members.length).toEqual(1);
    expect(actual.members[0].id).toEqual(1);
  });

  it('should not add a pokemon if it is already in the team', () => {
    const stateWithOne = teamReducer(initialState, addToTeam(mockPokemon));
    const actual = teamReducer(stateWithOne, addToTeam(mockPokemon));
    expect(actual.members.length).toEqual(1);
  });

  it('should not add more than 6 pokemon', () => {
    let state = initialState;
    for (let i = 1; i <= 6; i++) {
      state = teamReducer(state, addToTeam({ ...mockPokemon, id: i }));
    }
    expect(state.members.length).toEqual(6);

    // Try to add a 7th
    const actual = teamReducer(state, addToTeam({ ...mockPokemon, id: 7 }));
    expect(actual.members.length).toEqual(6);
  });

  it('should handle removeFromTeam', () => {
    const stateWithOne = teamReducer(initialState, addToTeam(mockPokemon));
    const actual = teamReducer(stateWithOne, removeFromTeam(1));
    expect(actual.members.length).toEqual(0);
  });

  it('should handle clearTeam', () => {
    let state = initialState;
    for (let i = 1; i <= 3; i++) {
      state = teamReducer(state, addToTeam({ ...mockPokemon, id: i }));
    }
    const actual = teamReducer(state, clearTeam());
    expect(actual.members.length).toEqual(0);
  });
});
