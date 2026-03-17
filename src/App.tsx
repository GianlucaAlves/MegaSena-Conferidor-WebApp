import {
  AmbientGlow,
  Badge,
  Container,
  GlobalStyle,
  Page,
  SmallNote,
  SubTitle,
  Title,
  TopBar,
} from "./styles/App.styles.ts";
import { useMegaSena } from "./context/MegaSenaContext";
import { SearchControls } from "./components/SearchControls";
import { ConcursoResultado } from "./components/ConcursoResultado";
import { EstatisticasPainel } from "./components/EstatisticasPainel";

function App() {
  const {
    concurso,
    erro,
    carregando,
    numero,
    estatisticas,
    carregandoEstatisticas,
    setNumero,
    buscarMaisRecente,
    buscarConcurso,
  } = useMegaSena();

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

          <SearchControls
            numero={numero}
            carregando={carregando}
            onNumeroChange={setNumero}
            onBuscarConcurso={buscarConcurso}
            onBuscarMaisRecente={buscarMaisRecente}
          />

          <ConcursoResultado
            carregando={carregando}
            erro={erro}
            concurso={concurso}
          />

          <EstatisticasPainel
            carregandoEstatisticas={carregandoEstatisticas}
            estatisticas={estatisticas}
          />
        </Container>
      </Page>
    </>
  );
}

export default App;
