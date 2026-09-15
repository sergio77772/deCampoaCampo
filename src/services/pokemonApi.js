import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://pokeapi.co/api/v2/',
  }),
  // Cache por 1 hora — datos persisten entre navegaciones
  keepUnusedDataFor: 3600,
  tagTypes: ['Pokemon', 'Type', 'Generation'],

  endpoints: (builder) => ({
    // Lista paginada de pokémon
    getPokemonList: builder.query({
      query: ({ limit = 20, offset = 0 } = {}) =>
        `pokemon?limit=${limit}&offset=${offset}`,
      providesTags: ['Pokemon'],
    }),

    // Detalle completo de un pokémon por nombre o id
    getPokemonDetail: builder.query({
      query: (nameOrId) => `pokemon/${nameOrId}`,
      providesTags: (result, error, nameOrId) => [
        { type: 'Pokemon', id: nameOrId },
      ],
    }),

    // Especie (para flavor text, grupo de huevo, tasa de captura, etc.)
    getPokemonSpecies: builder.query({
      query: (nameOrId) => `pokemon-species/${nameOrId}`,
    }),

    // Listado de todos los tipos
    getTypeList: builder.query({
      query: () => 'type?limit=30',
      providesTags: ['Type'],
    }),

    // Pokémon de un tipo específico
    getPokemonByType: builder.query({
      query: (typeName) => `type/${typeName}`,
      providesTags: (result, error, typeName) => [
        { type: 'Type', id: typeName },
      ],
    }),

    // Listado de todas las generaciones
    getGenerationList: builder.query({
      query: () => 'generation',
      providesTags: ['Generation'],
    }),

    // Pokémon de una generación específica
    getPokemonByGeneration: builder.query({
      query: (genId) => `generation/${genId}`,
      providesTags: (result, error, genId) => [
        { type: 'Generation', id: genId },
      ],
    }),

    // Habilidad con descripción
    getAbility: builder.query({
      query: (abilityName) => `ability/${abilityName}`,
    }),
  }),
});

export const {
  useGetPokemonListQuery,
  useGetPokemonDetailQuery,
  useGetPokemonSpeciesQuery,
  useGetTypeListQuery,
  useGetPokemonByTypeQuery,
  useGetGenerationListQuery,
  useGetPokemonByGenerationQuery,
  useGetAbilityQuery,
} = pokemonApi;
