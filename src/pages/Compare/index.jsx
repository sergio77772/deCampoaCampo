import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

import { useGetPokemonDetailQuery, useGetAllPokemonNamesQuery } from '../../services/pokemonApi';
import TypeBadge from '../../components/TypeBadge';
import { capitalize, formatPokemonId, statLabelsFull, getSpriteUrl } from '../../utils/pokemonUtils';

// ──── Validation Schema ────
const CompareSchema = Yup.object().shape({
  pokemon1: Yup.string()
    .required('Ingresá el nombre del primer pokémon')
    .min(2, 'Nombre muy corto')
    .lowercase()
    .trim(),
  pokemon2: Yup.string()
    .required('Ingresá el nombre del segundo pokémon')
    .min(2, 'Nombre muy corto')
    .lowercase()
    .trim()
    .notOneOf([Yup.ref('pokemon1')], 'No podés comparar el mismo pokémon'),
});

// ──── Styled Components ────
const PageWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
  margin-bottom: 8px;
`;

const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const VSBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  color: white;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  align-self: center;
  margin-top: 24px;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0 auto;
    width: 40px;
    height: 40px;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.surfaceElevated};
  border: 1px solid ${({ $error, theme }) => $error ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.9rem;
  font-family: ${({ theme }) => theme.fonts.primary};
  transition: border-color ${({ theme }) => theme.transitions.fast},
              box-shadow ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }

  &:focus {
    outline: none;
    border-color: ${({ $error, theme }) => $error ? theme.colors.accent : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ $error, theme }) =>
      $error ? theme.colors.accentGlow : theme.colors.primaryGlow};
  }
`;

const ErrorMsg = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.accent};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SubmitButton = styled.button`
  display: block;
  width: 100%;
  max-width: 300px;
  margin: ${({ theme }) => theme.spacing.lg} auto 0;
  padding: 14px 24px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, #a78bfa);
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.glow};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ComparisonSection = styled.div`
  animation: fadeIn 0.4s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const PokemonColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const PokemonPanel = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ $accent, theme }) => $accent ? theme.colors.accent : theme.colors.borderHover};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const CompareSprite = styled.img`
  width: 140px;
  height: 140px;
  object-fit: contain;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.4));
  margin: 0 auto 16px;
`;

const CompareName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 1.3rem;
  font-weight: 800;
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

const CompareNumber = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-weight: 600;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
`;

const TypesRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
`;

const RadarSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: 0.8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const StatsSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  margin-bottom: 12px;
`;

const StatValue = styled.div`
  font-size: 1rem;
  font-weight: 800;
  color: ${({ $winner, theme }) => $winner ? theme.colors.success : theme.colors.text.primary};
  text-align: ${({ $right }) => $right ? 'right' : 'left'};
  min-width: 36px;
`;

const StatName = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.muted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 40px auto;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const CompareError = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.accentGlow};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.accent};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

// ──────────────────────────────────────────────
// Sub-componente: resultado de la comparación
// ──────────────────────────────────────────────
function ComparisonResult({ name1, name2 }) {
  const { data: pokemon1, isLoading: loading1, isError: error1 } = useGetPokemonDetailQuery(name1.toLowerCase().trim());
  const { data: pokemon2, isLoading: loading2, isError: error2 } = useGetPokemonDetailQuery(name2.toLowerCase().trim());

  if (loading1 || loading2) return <LoadingSpinner />;

  if (error1 || error2) {
    return (
      <CompareError>
        ⚠️ No se pudo encontrar{' '}
        {error1 && error2 ? 'ninguno de los pokémon' : error1 ? `"${name1}"` : `"${name2}"`}.
        Verificá que el nombre sea exacto (en inglés).
      </CompareError>
    );
  }

  if (!pokemon1 || !pokemon2) return null;

  // Preparar datos para el radar
  const radarData = pokemon1.stats.map((s) => {
    const s2 = pokemon2.stats.find((st) => st.stat.name === s.stat.name);
    return {
      stat: statLabelsFull[s.stat.name] || s.stat.name,
      [capitalize(pokemon1.name)]: s.base_stat,
      [capitalize(pokemon2.name)]: s2?.base_stat || 0,
    };
  });

  const total1 = pokemon1.stats.reduce((acc, s) => acc + s.base_stat, 0);
  const total2 = pokemon2.stats.reduce((acc, s) => acc + s.base_stat, 0);

  return (
    <ComparisonSection>
      {/* Cards de pokémon */}
      <PokemonColumns>
        <PokemonPanel>
          <CompareSprite
            src={pokemon1.sprites?.other?.['official-artwork']?.front_default || getSpriteUrl(pokemon1.id)}
            alt={pokemon1.name}
          />
          <CompareName>{capitalize(pokemon1.name)}</CompareName>
          <CompareNumber>{formatPokemonId(pokemon1.id)}</CompareNumber>
          <TypesRow>
            {pokemon1.types?.map((t) => <TypeBadge key={t.type.name} type={t.type.name} />)}
          </TypesRow>
        </PokemonPanel>

        <PokemonPanel $accent>
          <CompareSprite
            src={pokemon2.sprites?.other?.['official-artwork']?.front_default || getSpriteUrl(pokemon2.id)}
            alt={pokemon2.name}
          />
          <CompareName>{capitalize(pokemon2.name)}</CompareName>
          <CompareNumber>{formatPokemonId(pokemon2.id)}</CompareNumber>
          <TypesRow>
            {pokemon2.types?.map((t) => <TypeBadge key={t.type.name} type={t.type.name} />)}
          </TypesRow>
        </PokemonPanel>
      </PokemonColumns>

      {/* Radar Chart */}
      <RadarSection>
        <SectionTitle>Comparativa de stats (Radar)</SectionTitle>
        <ResponsiveContainer width="100%" height={340}>
          <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="stat"
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
            />
            <Radar
              name={capitalize(pokemon1.name)}
              dataKey={capitalize(pokemon1.name)}
              stroke="#6c63ff"
              fill="#6c63ff"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Radar
              name={capitalize(pokemon2.name)}
              dataKey={capitalize(pokemon2.name)}
              stroke="#ff6b6b"
              fill="#ff6b6b"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Legend
              wrapperStyle={{ color: '#94a3b8', fontSize: '0.8rem', paddingTop: 16 }}
            />
            <Tooltip
              contentStyle={{
                background: '#1e1e2e',
                border: '1px solid rgba(108,99,255,0.3)',
                borderRadius: 12,
                color: '#e2e8f0',
                fontSize: '0.8rem',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </RadarSection>

      {/* Comparativa stat a stat */}
      <StatsSection>
        <SectionTitle>Estadísticas detalladas</SectionTitle>
        {pokemon1.stats.map((s) => {
          const s2 = pokemon2.stats.find((st) => st.stat.name === s.stat.name);
          const v1 = s.base_stat;
          const v2 = s2?.base_stat || 0;
          return (
            <StatRow key={s.stat.name}>
              <StatValue $winner={v1 > v2} $right={false}>{v1}</StatValue>
              <StatName>{statLabelsFull[s.stat.name] || s.stat.name}</StatName>
              <StatValue $winner={v2 > v1} $right={true}>{v2}</StatValue>
            </StatRow>
          );
        })}
        <StatRow style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12, marginTop: 8 }}>
          <StatValue $winner={total1 > total2} $right={false}>{total1}</StatValue>
          <StatName>TOTAL</StatName>
          <StatValue $winner={total2 > total1} $right={true}>{total2}</StatValue>
        </StatRow>
      </StatsSection>
    </ComparisonSection>
  );
}

// ──────────────────────────────────────────────
// Componente principal Compare
// ──────────────────────────────────────────────
function Compare() {
  const [submitted, setSubmitted] = useState(null);
  const { data: allNames = [] } = useGetAllPokemonNamesQuery();

  return (
    <PageWrapper>
      <PageHeader>
        <PageTitle>⚖️ Comparar Pokémon</PageTitle>
        <PageSubtitle>
          Seleccioná dos pokémon para comparar sus estadísticas base
        </PageSubtitle>
      </PageHeader>

      <datalist id="pokemon-names">
        {allNames.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      <FormCard>
        <Formik
          initialValues={{ pokemon1: '', pokemon2: '' }}
          validationSchema={CompareSchema}
          onSubmit={(values) => {
            setSubmitted({
              name1: values.pokemon1.toLowerCase().trim(),
              name2: values.pokemon2.toLowerCase().trim(),
            });
          }}
        >
          {({ errors, touched, values, isValid, dirty }) => (
            <Form>
              <FormGrid>
                {/* Pokémon 1 */}
                <FieldGroup>
                  <FieldLabel htmlFor="pokemon1">Pokémon 1</FieldLabel>
                  <Field name="pokemon1">
                    {({ field }) => (
                      <StyledInput
                        {...field}
                        id="pokemon1-input"
                        type="text"
                        placeholder="ej: charizard"
                        $error={errors.pokemon1 && touched.pokemon1}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        list="pokemon-names"
                      />
                    )}
                  </Field>
                  <ErrorMessage name="pokemon1">
                    {(msg) => <ErrorMsg>⚠️ {msg}</ErrorMsg>}
                  </ErrorMessage>
                </FieldGroup>

                <VSBadge>VS</VSBadge>

                {/* Pokémon 2 */}
                <FieldGroup>
                  <FieldLabel htmlFor="pokemon2">Pokémon 2</FieldLabel>
                  <Field name="pokemon2">
                    {({ field }) => (
                      <StyledInput
                        {...field}
                        id="pokemon2-input"
                        type="text"
                        placeholder="ej: blastoise"
                        $error={errors.pokemon2 && touched.pokemon2}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        list="pokemon-names"
                      />
                    )}
                  </Field>
                  <ErrorMessage name="pokemon2">
                    {(msg) => <ErrorMsg>⚠️ {msg}</ErrorMsg>}
                  </ErrorMessage>
                </FieldGroup>
              </FormGrid>

              <SubmitButton
                type="submit"
                disabled={!isValid || !dirty}
                id="compare-submit-btn"
              >
                Comparar ahora ⚡
              </SubmitButton>
            </Form>
          )}
        </Formik>
      </FormCard>

      {/* Resultado */}
      {submitted && (
        <ComparisonResult name1={submitted.name1} name2={submitted.name2} />
      )}
    </PageWrapper>
  );
}

export default Compare;
