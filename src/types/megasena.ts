export type Concurso = {
  concurso: number;
  data_do_sorteio: string;
  bola1: string;
  bola2: string;
  bola3: string;
  bola4: string;
  bola5: string;
  bola6: string;
};

export type TopNumero = {
  numero: number;
  frequencia: number;
};

export type ParRepetido = {
  par: [number, number];
  frequencia: number;
};

export type Estatisticas = {
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
