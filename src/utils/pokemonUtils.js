/**
 * Formatea el número de pokémon con ceros a la izquierda
 * @param {number} id
 * @returns {string} e.g. "#0001"
 */
export const formatPokemonId = (id) => `#${String(id).padStart(4, '0')}`;

/**
 * Convierte decímetros a metros formateado
 * @param {number} decimeters
 * @returns {string} e.g. "1.7 m"
 */
export const formatHeight = (decimeters) =>
  `${(decimeters / 10).toFixed(1)} m`;

/**
 * Convierte hectogramos a kilogramos formateado
 * @param {number} hectograms
 * @returns {string} e.g. "68.5 kg"
 */
export const formatWeight = (hectograms) =>
  `${(hectograms / 10).toFixed(1)} kg`;

/**
 * Capitaliza el primer carácter de un string
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ') : '';

/**
 * Nombres de stats legibles
 */
export const statLabels = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'Sp.ATK',
  'special-defense': 'Sp.DEF',
  speed: 'SPD',
};

export const statLabelsFull = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  speed: 'Speed',
};

/**
 * Valor máximo teórico de cada stat (para las barras de progreso)
 */
export const statMaxValues = {
  hp: 255,
  attack: 190,
  defense: 230,
  'special-attack': 194,
  'special-defense': 230,
  speed: 180,
};

/**
 * Extrae el número de pokémon de una URL de PokéAPI
 * @param {string} url  e.g. "https://pokeapi.co/api/v2/pokemon/25/"
 * @returns {number}
 */
export const extractIdFromUrl = (url) => {
  const parts = url.replace(/\/$/, '').split('/');
  return parseInt(parts[parts.length - 1], 10);
};

/**
 * Obtiene la URL del sprite oficial de un pokémon por su id
 * @param {number} id
 * @returns {string}
 */
export const getSpriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

/**
 * Obtiene la URL del sprite default de un pokémon por su id
 */
export const getDefaultSpriteUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

/**
 * Obtiene el flavor text en español/inglés del pokémon
 * @param {Array} flavorEntries
 * @returns {string}
 */
export const getFlavorText = (flavorEntries = []) => {
  const esEntry = flavorEntries.find((e) => e.language.name === 'es');
  const enEntry = flavorEntries.find((e) => e.language.name === 'en');
  const entry = esEntry || enEntry;
  return entry ? entry.flavor_text.replace(/\f|\n/g, ' ') : '';
};

/**
 * Calcula el porcentaje de un stat sobre su máximo teórico
 */
export const getStatPercent = (statName, value) => {
  const max = statMaxValues[statName] || 255;
  return Math.min(100, Math.round((value / max) * 100));
};

/**
 * Nombre de generaciones en español
 */
export const generationNames = {
  1: 'Generación I',
  2: 'Generación II',
  3: 'Generación III',
  4: 'Generación IV',
  5: 'Generación V',
  6: 'Generación VI',
  7: 'Generación VII',
  8: 'Generación VIII',
  9: 'Generación IX',
};

/**
 * Extrae el ID de generación del nombre de la API ("generation-i" → 1)
 */
export const genNameToId = {
  'generation-i': 1,
  'generation-ii': 2,
  'generation-iii': 3,
  'generation-iv': 4,
  'generation-v': 5,
  'generation-vi': 6,
  'generation-vii': 7,
  'generation-viii': 8,
  'generation-ix': 9,
};

/**
 * Tipos a ignorar (no son tipos reales de pokémon)
 */
export const IGNORED_TYPES = ['unknown', 'shadow'];

/**
 * Construye un objeto pokémon simplificado para guardar en el team
 */
export const buildTeamMember = (pokemon) => ({
  id: pokemon.id,
  name: pokemon.name,
  sprite: pokemon.sprites?.other?.['official-artwork']?.front_default
    || getDefaultSpriteUrl(pokemon.id),
  types: pokemon.types?.map((t) => t.type.name) || [],
});
