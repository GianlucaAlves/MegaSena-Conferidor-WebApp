import {
  ChartFill,
  ChartLabel,
  ChartList,
  ChartMeta,
  ChartRow,
  ChartRowLabel,
  ChartTrack,
  ChartValue,
  LoadingCard,
  Message,
  NumberChip,
  NumberChips,
  PulseLine,
  RankingChartList,
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

const POSICOES_RANKING = [
  "PRIMEIRO LUGAR",
  "SEGUNDO LUGAR",
  "TERCEIRO LUGAR",
  "QUARTO LUGAR",
  "QUINTO LUGAR",
  "SEXTO LUGAR",
  "SETIMO LUGAR",
  "OITAVO LUGAR",
  "NONO LUGAR",
  "DECIMO LUGAR",
];

function getPosicaoRanking(index: number) {
  return POSICOES_RANKING[index] ?? `${index + 1}o LUGAR`;
}

export function EstatisticasPainel({
  carregandoEstatisticas,
  estatisticas,
}: EstatisticasPainelProps) {
  const totalTopPares = estatisticas
    ? estatisticas.top_pares_repetidos.reduce(
        (acc, item) => acc + item.frequencia,
        0,
      )
    : 0;

  const totalTopNumeros = estatisticas
    ? estatisticas.top_numeros.reduce((acc, item) => acc + item.frequencia, 0)
    : 0;

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
                      <ChartValue>
                        {item.frequencia} ({percentual.toFixed(1)}%)
                      </ChartValue>
                    </ChartRow>
                  );
                })}
              </ChartList>
            </StatCard>

            <StatCard>
              <StatLabel>Top pares de dezenas que mais saíram juntos</StatLabel>
              <RankingChartList>
                {estatisticas.top_pares_repetidos.map((item, index) => {
                  const rank = index + 1;
                  const percentual = calcularPercentual(
                    item.frequencia,
                    totalTopPares,
                  );

                  return (
                    <ChartRow
                      key={`par-${item.par[0]}-${item.par[1]}`}
                      $rank={rank}
                    >
                      <ChartLabel>
                        <ChartMeta $rank={rank}>
                          {getPosicaoRanking(index)}
                        </ChartMeta>
                        <ChartRowLabel>
                          {String(item.par[0]).padStart(2, "0")} +{" "}
                          {String(item.par[1]).padStart(2, "0")}
                        </ChartRowLabel>
                      </ChartLabel>
                      <ChartTrack>
                        <ChartFill $width={percentual} $rank={rank} />
                      </ChartTrack>
                      <ChartValue>
                        {item.frequencia}x ({percentual.toFixed(1)}%)
                      </ChartValue>
                    </ChartRow>
                  );
                })}
              </RankingChartList>
            </StatCard>

            <StatCard>
              <StatLabel>Top 10 dezenas mais sorteadas</StatLabel>
              <RankingChartList>
                {estatisticas.top_numeros.map((item, index) => {
                  const rank = index + 1;
                  const percentual = calcularPercentual(
                    item.frequencia,
                    totalTopNumeros,
                  );

                  return (
                    <ChartRow key={`top-${item.numero}`} $rank={rank}>
                      <ChartLabel>
                        <ChartMeta $rank={rank}>
                          {getPosicaoRanking(index)}
                        </ChartMeta>
                        <ChartRowLabel>
                          Dezena {String(item.numero).padStart(2, "0")}
                        </ChartRowLabel>
                      </ChartLabel>
                      <ChartTrack>
                        <ChartFill $width={percentual} $rank={rank} />
                      </ChartTrack>
                      <ChartValue>
                        {item.frequencia}x ({percentual.toFixed(1)}%)
                      </ChartValue>
                    </ChartRow>
                  );
                })}
              </RankingChartList>
            </StatCard>
          </StatsStack>
        </>
      )}
    </StatsSection>
  );
}
