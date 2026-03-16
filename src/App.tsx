import { useEffect, useMemo, useState } from "react";
import {
  AmbientGlow,
  Badge,
  Ball,
  BallsGrid,
  Container,
  ErrorMessage,
  GlobalStyle,
  Input,
  LoadingCard,
  Message,
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

function App() {
  const [concurso, setConcurso] = useState<Concurso | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [numero, setNumero] = useState("");

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

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
}

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
                <ResultDate>{formatarData(concurso.data_do_sorteio)}</ResultDate>
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
        </Container>
      </Page>
    </>
  );
}

export default App;
