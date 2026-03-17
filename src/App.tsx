import { useEffect, useMemo, useState } from "react";
import {
  AmbientGlow,
  Badge,
  Ball,
  BallsGrid,
  ChartFill,
  ChartLabel,
  ChartList,
  ChartRow,
  ChartTrack,
  ChartValue,
  Container,
  ErrorMessage,
  GlobalStyle,
  Input,
  LoadingCard,
  Message,
  NumberChip,
  NumberChips,
  Page,
  PrimaryButton,
  PulseLine,
  ResultCard,
  ResultDate,
  ResultHeader,
  ResultTitle,
  SearchRow,
  SecondaryButton,
  SmallNote,
  StatCard,
  StatLabel,
  StatValue,
  StatsGrid,
  StatsSection,
  StatsTitle,
  SubTitle,
  Title,
  TopBar,
} from "./styles/App.styles.ts";

type Concurso = {
  concurso: number;
  data_do_sorteio: string;
  bola1: string;
  bola2: string;
  bola3: string;
  bola4: string;
  bola5: string;
  bola6: string;
};

type TopNumero = {
  numero: number;
  frequencia: number;
};

type ParRepetido = {
  par: [number, number];
  frequencia: number;
};

type Estatisticas = {
  total_concursos: number;
  top_numeros: TopNumero[];
  dezena_mais_sorteada: TopNumero | null;
  dezena_menos_sorteada: TopNumero | null;
  concurso_maior_soma: {
    concurso: number;
    data_do_sorteio: string;
    soma_dezenas: number;
    dezenas: number[];
  } | null;
  top_pares_repetidos: ParRepetido[];
  padrao_pares_mais_comum: {
    qtd_pares: number;
    frequencia: number;
  } | null;
  distribuicao_pares: Array<{
    qtd_pares: number;
    frequencia: number;
  }>;
  media_soma_dezenas: number;
  primeiro_concurso: number;
  ultimo_concurso: number;
  data_primeiro_concurso: string;
  data_ultimo_concurso: string;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

function App() {
  const [concurso, setConcurso] = useState<Concurso | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [numero, setNumero] = useState("");
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [carregandoEstatisticas, setCarregandoEstatisticas] = useState(true);

  const dezenas = useMemo(() => {
    if (!concurso) {
      return [] as string[];
    }

    return [
      concurso.bola1,
      concurso.bola2,
      concurso.bola3,
      concurso.bola4,
      concurso.bola5,
      concurso.bola6,
    ].filter(Boolean);
  }, [concurso]);

  useEffect(() => {
    buscarMaisRecente();
    buscarEstatisticas();
  }, []);

  const buscarMaisRecente = () => {
    setCarregando(true);
    setErro("");
    fetch(`${API_URL}/concurso/mais-recente`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Falha ao buscar concurso mais recente");
        }
        return res.json();
      })
      .then((data: Concurso) => setConcurso(data))
      .catch((error) => setErro(error.message))
      .finally(() => setCarregando(false));
  };

  const buscarConcurso = () => {
    if (!numero) {
      return;
    }
    setCarregando(true);
    setErro("");
    fetch(`${API_URL}/concurso/${numero}`)
      .then((res) => {
        if (!res.ok) throw new Error("Concurso não encontrado");
        return res.json();
      })
      .then((data: Concurso) => setConcurso(data))
      .catch((error) => setErro(error.message))
      .finally(() => setCarregando(false));
  };

  const buscarEstatisticas = () => {
    setCarregandoEstatisticas(true);
    fetch(`${API_URL}/concurso/estatisticas`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Falha ao buscar estatísticas");
        }
        return res.json();
      })
      .then((data: Estatisticas) => setEstatisticas(data))
      .catch(() => setEstatisticas(null))
      .finally(() => setCarregandoEstatisticas(false));
  };

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const calcularPercentual = (valor: number, referencia: number) => {
    if (referencia <= 0) {
      return 0;
    }
    return (valor / referencia) * 100;
  };

  return (
    <>
      <GlobalStyle />
      <Page>
        <AmbientGlow />
        <Container>
          <TopBar>
            <Badge>Conferidor oficial</Badge>
            <SmallNote>Atualizado pela API local</SmallNote>
          </TopBar>

          <Title>Mega-Sena</Title>
          <SubTitle>
            Pesquise um concurso específico ou retorne rapidamente ao resultado
            mais recente.
          </SubTitle>

          <SearchRow>
            <Input
              type="number"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  buscarConcurso();
                }
              }}
              placeholder="Digite o número do concurso"
            />
            <PrimaryButton onClick={buscarConcurso} disabled={carregando}>
              Buscar
            </PrimaryButton>
            <SecondaryButton onClick={buscarMaisRecente} disabled={carregando}>
              Mais recente
            </SecondaryButton>
          </SearchRow>

          {carregando ? (
            <LoadingCard>
              <PulseLine />
              <PulseLine />
              <PulseLine />
            </LoadingCard>
          ) : erro ? (
            <ErrorMessage>{erro}</ErrorMessage>
          ) : concurso ? (
            <ResultCard>
              <ResultHeader>
                <ResultTitle>Concurso {concurso.concurso}</ResultTitle>
                <ResultDate>
                  {formatarData(concurso.data_do_sorteio)}
                </ResultDate>
              </ResultHeader>
              <BallsGrid>
                {dezenas.map((dezena) => (
                  <Ball key={dezena}>{dezena}</Ball>
                ))}
              </BallsGrid>
            </ResultCard>
          ) : (
            <Message>Nenhum concurso encontrado.</Message>
          )}

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
                        {String(
                          estatisticas.dezena_mais_sorteada.numero,
                        ).padStart(2, "0")}{" "}
                        ({estatisticas.dezena_mais_sorteada.frequencia}x)
                      </StatValue>
                    </StatCard>
                  ) : null}

                  {estatisticas.dezena_menos_sorteada ? (
                    <StatCard>
                      <StatLabel>Dezena menos sorteada</StatLabel>
                      <StatValue>
                        {String(
                          estatisticas.dezena_menos_sorteada.numero,
                        ).padStart(2, "0")}{" "}
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
                        {estatisticas.concurso_maior_soma.dezenas.map(
                          (dezena) => (
                            <NumberChip key={`maior-soma-${dezena}`}>
                              {String(dezena).padStart(2, "0")}
                            </NumberChip>
                          ),
                        )}
                      </NumberChips>
                    </StatCard>
                  ) : null}
                </StatsGrid>

                <StatCard style={{ marginTop: 12 }}>
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
                            {item.qtd_pares} pares / {6 - item.qtd_pares}{" "}
                            impares
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

                <StatCard style={{ marginTop: 12 }}>
                  <StatLabel>
                    Top pares de dezenas que mais saíram juntos
                  </StatLabel>
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

                <StatCard style={{ marginTop: 12 }}>
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
              </>
            )}
          </StatsSection>
        </Container>
      </Page>
    </>
  );
}

export default App;
