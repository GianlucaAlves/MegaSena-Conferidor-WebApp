import {
  Ball,
  BallsGrid,
  ErrorMessage,
  LoadingCard,
  Message,
  PulseLine,
  ResultCard,
  ResultDate,
  ResultHeader,
  ResultTitle,
} from "../styles/App.styles";
import type { Concurso } from "../types/megasena";
import { formatarData, obterDezenas } from "../utils/megasenaHelpers";

type ConcursoResultadoProps = {
  carregando: boolean;
  erro: string;
  concurso: Concurso | null;
};

export function ConcursoResultado({
  carregando,
  erro,
  concurso,
}: ConcursoResultadoProps) {
  const dezenas = obterDezenas(concurso);

  if (carregando) {
    return (
      <LoadingCard>
        <PulseLine />
        <PulseLine />
        <PulseLine />
      </LoadingCard>
    );
  }

  if (erro) {
    return <ErrorMessage>{erro}</ErrorMessage>;
  }

  if (!concurso) {
    return <Message>Nenhum concurso encontrado.</Message>;
  }

  return (
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
  );
}
