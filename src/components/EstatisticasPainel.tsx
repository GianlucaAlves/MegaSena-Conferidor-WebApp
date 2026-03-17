import {
  ChartFill,
  ChartLabel,
  ChartList,
  ChartRow,
  ChartTrack,
  ChartValue,
  LoadingCard,
  Message,
  NumberChip,
  NumberChips,
  PulseLine,
  SmallNote,
  StatCard,
  StatLabel,
  StatValue,
  StatsGrid,
  StatsSection,
  StatsStack,
  StatsTitle,
} from "../styles/App.styles";
import type { Estatisticas } from "../types/megasena";
import { calcularPercentual, formatarData } from "../utils/megasenaHelpers";

type EstatisticasPainelProps = {
  carregandoEstatisticas: boolean;
  estatisticas: Estatisticas | null;
};

export function EstatisticasPainel({
  carregandoEstatisticas,
  estatisticas,
}: EstatisticasPainelProps) {
  return (
    <StatsSection>
      <StatsTitle>Estatisticas da base da Mega-Sena</StatsTitle>

      {carregandoEstatisticas ? (
        <LoadingCard>
          <PulseLine />
          <PulseLine />
        </LoadingCard>
      ) : !estatisticas ? (
        <Message>Não foi possível carregar as estatísticas.</Message>
      ) : (
        <>
          <StatsGrid>
            <StatCard>
              <StatLabel>Total de concursos</StatLabel>
              <StatValue>{estatisticas.total_concursos}</StatValue>
            </StatCard>

            <StatCard>
              <StatLabel>Media da soma das 6 dezenas</StatLabel>
              <StatValue>{estatisticas.media_soma_dezenas}</StatValue>
            </StatCard>

            <StatCard>
              <StatLabel>Primeiro e ultimo concurso</StatLabel>
              <StatValue>
                {formatarData(estatisticas.data_primeiro_concurso)} ate{" "}
                {formatarData(estatisticas.data_ultimo_concurso)}
              </StatValue>
              <SmallNote>
                concursos {estatisticas.primeiro_concurso} e{" "}
                {estatisticas.ultimo_concurso}
              </SmallNote>
            </StatCard>

            {estatisticas.dezena_mais_sorteada ? (
              <StatCard>
                <StatLabel>Dezena mais sorteada</StatLabel>
                <StatValue>
                  {String(estatisticas.dezena_mais_sorteada.numero).padStart(
                    2,
                    "0",
                  )}{" "}
                  ({estatisticas.dezena_mais_sorteada.frequencia}x)
                </StatValue>
              </StatCard>
            ) : null}

            {estatisticas.dezena_menos_sorteada ? (
              <StatCard>
                <StatLabel>Dezena menos sorteada</StatLabel>
                <StatValue>
                  {String(estatisticas.dezena_menos_sorteada.numero).padStart(
                    2,
                    "0",
                  )}{" "}
                  ({estatisticas.dezena_menos_sorteada.frequencia}x)
                </StatValue>
              </StatCard>
            ) : null}

            {estatisticas.concurso_maior_soma ? (
              <StatCard>
                <StatLabel>Maior soma de dezenas</StatLabel>
                <StatValue>
                  Concurso {estatisticas.concurso_maior_soma.concurso} (
                  {estatisticas.concurso_maior_soma.soma_dezenas})
                </StatValue>
                <SmallNote>
                  {formatarData(
                    estatisticas.concurso_maior_soma.data_do_sorteio,
                  )}
                </SmallNote>
                <NumberChips>
                  {estatisticas.concurso_maior_soma.dezenas.map((dezena) => (
                    <NumberChip key={`maior-soma-${dezena}`}>
                      {String(dezena).padStart(2, "0")}
                    </NumberChip>
                  ))}
                </NumberChips>
              </StatCard>
            ) : null}
          </StatsGrid>

          <StatsStack>
            <StatCard>
              <StatLabel>Distribuição de pares por concurso</StatLabel>
              <ChartList>
                {estatisticas.distribuicao_pares.map((item) => {
                  const percentual = calcularPercentual(
                    item.frequencia,
                    estatisticas.total_concursos,
                  );

                  return (
                    <ChartRow key={`distribuicao-${item.qtd_pares}`}>
                      <ChartLabel>
                        {item.qtd_pares} pares / {6 - item.qtd_pares} impares
                      </ChartLabel>
                      <ChartTrack>
                        <ChartFill $width={percentual} />
                      </ChartTrack>
                      <ChartValue>{item.frequencia}</ChartValue>
                    </ChartRow>
                  );
                })}
              </ChartList>
            </StatCard>

            <StatCard>
              <StatLabel>Top pares de dezenas que mais saíram juntos</StatLabel>
              <ChartList>
                {estatisticas.top_pares_repetidos.map((item) => {
                  const percentual = calcularPercentual(
                    item.frequencia,
                    estatisticas.top_pares_repetidos[0]?.frequencia ?? 0,
                  );

                  return (
                    <ChartRow key={`par-${item.par[0]}-${item.par[1]}`}>
                      <ChartLabel>
                        {String(item.par[0]).padStart(2, "0")} +{" "}
                        {String(item.par[1]).padStart(2, "0")}
                      </ChartLabel>
                      <ChartTrack>
                        <ChartFill $width={percentual} />
                      </ChartTrack>
                      <ChartValue>{item.frequencia}x</ChartValue>
                    </ChartRow>
                  );
                })}
              </ChartList>
            </StatCard>

            <StatCard>
              <StatLabel>Top 10 dezenas mais sorteadas</StatLabel>
              <ChartList>
                {estatisticas.top_numeros.map((item) => {
                  const percentual = calcularPercentual(
                    item.frequencia,
                    estatisticas.top_numeros[0]?.frequencia ?? 0,
                  );

                  return (
                    <ChartRow key={`top-${item.numero}`}>
                      <ChartLabel>
                        {String(item.numero).padStart(2, "0")}
                      </ChartLabel>
                      <ChartTrack>
                        <ChartFill $width={percentual} />
                      </ChartTrack>
                      <ChartValue>{item.frequencia}x</ChartValue>
                    </ChartRow>
                  );
                })}
              </ChartList>
            </StatCard>
          </StatsStack>
        </>
      )}
    </StatsSection>
  );
}
