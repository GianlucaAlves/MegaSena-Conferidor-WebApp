import pool from "../ds.ts";
import express from "express";

const router = express.Router();

function handleInternalError(
  res: express.Response,
  logMessage: string,
  userMessage: string,
  err: unknown,
) {
  console.error(logMessage, err);
  return res.status(500).json({ message: userMessage });
}

type ConcursoSoma = {
  concurso: number;
  data_do_sorteio: string;
  soma_dezenas: string | number;
  dezenas: number[];
};

type TopNumero = {
  numero: string | number;
  frequencia: string | number;
};

type ParRepetido = {
  n1: string | number;
  n2: string | number;
  frequencia: string | number;
};

type PadraoPares = {
  qtd_pares: string | number;
  frequencia: string | number;
};

type ExtremosConcurso = {
  primeiro: string | number;
  data_primeiro: string;
  ultimo: string | number;
  data_ultimo: string;
};

router.get("/concurso/mais-recente", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM megasena ORDER BY concurso DESC LIMIT 1",
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Não existem dados do concurso mais recente" });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    return handleInternalError(
      res,
      "Erro ao consultar concurso mais recente:",
      "Erro ao consultar o banco",
      err,
    );
  }
});

router.get("/concurso/estatisticas", async (_req, res) => {
  try {
    const totalResult = await pool.query(
      "SELECT COUNT(*)::int AS total FROM megasena",
    );

    if (
      totalResult.rows.length === 0 ||
      Number(totalResult.rows[0].total) === 0
    ) {
      return res
        .status(404)
        .json({ message: "Não existem dados para estatísticas" });
    }

    const [
      extremosResult,
      frequenciaNumerosResult,
      maiorSomaResult,
      paresRepetidosResult,
      distribuicaoParesResult,
      mediaSomaResult,
    ] = await Promise.all([
      pool.query<ExtremosConcurso>(
        `
        SELECT
          (SELECT concurso FROM megasena ORDER BY concurso ASC LIMIT 1) AS primeiro,
          (SELECT data_do_sorteio FROM megasena ORDER BY concurso ASC LIMIT 1) AS data_primeiro,
          (SELECT concurso FROM megasena ORDER BY concurso DESC LIMIT 1) AS ultimo,
          (SELECT data_do_sorteio FROM megasena ORDER BY concurso DESC LIMIT 1) AS data_ultimo
        `,
      ),
      pool.query<TopNumero>(
        `
        WITH dezenas AS (
          SELECT UNNEST(ARRAY[
            bola1,
            bola2,
            bola3,
            bola4,
            bola5,
            bola6
          ]) AS numero
          FROM megasena
        )
        SELECT numero, COUNT(*)::int AS frequencia
        FROM dezenas
        GROUP BY numero
        `,
      ),
      pool.query<ConcursoSoma>(
        `
        SELECT
          concurso,
          data_do_sorteio,
          (bola1 + bola2 + bola3 + bola4 + bola5 + bola6) AS soma_dezenas,
          ARRAY[
            bola1,
            bola2,
            bola3,
            bola4,
            bola5,
            bola6
          ] AS dezenas
        FROM megasena
        ORDER BY soma_dezenas DESC, concurso DESC
        LIMIT 1
        `,
      ),
      pool.query<ParRepetido>(
        `
        WITH
        pares AS (
          SELECT LEAST(bola1, bola2) AS n1, GREATEST(bola1, bola2) AS n2 FROM megasena
          UNION ALL
          SELECT LEAST(bola1, bola3), GREATEST(bola1, bola3) FROM megasena
          UNION ALL
          SELECT LEAST(bola1, bola4), GREATEST(bola1, bola4) FROM megasena
          UNION ALL
          SELECT LEAST(bola1, bola5), GREATEST(bola1, bola5) FROM megasena
          UNION ALL
          SELECT LEAST(bola1, bola6), GREATEST(bola1, bola6) FROM megasena
          UNION ALL
          SELECT LEAST(bola2, bola3), GREATEST(bola2, bola3) FROM megasena
          UNION ALL
          SELECT LEAST(bola2, bola4), GREATEST(bola2, bola4) FROM megasena
          UNION ALL
          SELECT LEAST(bola2, bola5), GREATEST(bola2, bola5) FROM megasena
          UNION ALL
          SELECT LEAST(bola2, bola6), GREATEST(bola2, bola6) FROM megasena
          UNION ALL
          SELECT LEAST(bola3, bola4), GREATEST(bola3, bola4) FROM megasena
          UNION ALL
          SELECT LEAST(bola3, bola5), GREATEST(bola3, bola5) FROM megasena
          UNION ALL
          SELECT LEAST(bola3, bola6), GREATEST(bola3, bola6) FROM megasena
          UNION ALL
          SELECT LEAST(bola4, bola5), GREATEST(bola4, bola5) FROM megasena
          UNION ALL
          SELECT LEAST(bola4, bola6), GREATEST(bola4, bola6) FROM megasena
          UNION ALL
          SELECT LEAST(bola5, bola6), GREATEST(bola5, bola6) FROM megasena
        )
        SELECT
          n1,
          n2,
          COUNT(*)::int AS frequencia
        FROM pares
        GROUP BY n1, n2
        ORDER BY frequencia DESC, n1 ASC, n2 ASC
        LIMIT 5
        `,
      ),
      pool.query<PadraoPares>(
        `
        WITH pares_por_concurso AS (
          SELECT
            (
              (bola1 % 2 = 0)::int +
              (bola2 % 2 = 0)::int +
              (bola3 % 2 = 0)::int +
              (bola4 % 2 = 0)::int +
              (bola5 % 2 = 0)::int +
              (bola6 % 2 = 0)::int
            ) AS qtd_pares
          FROM megasena
        ),
        frequencias AS (
          SELECT qtd_pares, COUNT(*)::int AS frequencia
          FROM pares_por_concurso
          GROUP BY qtd_pares
        )
        SELECT
          g.qtd_pares,
          COALESCE(f.frequencia, 0)::int AS frequencia
        FROM GENERATE_SERIES(0, 6) AS g(qtd_pares)
        LEFT JOIN frequencias f ON f.qtd_pares = g.qtd_pares
        ORDER BY g.qtd_pares ASC
        `,
      ),
      pool.query<{ media_soma: string | number }>(
        `
        SELECT ROUND(AVG(bola1 + bola2 + bola3 + bola4 + bola5 + bola6)::numeric, 2) AS media_soma
        FROM megasena
        `,
      ),
    ]);

    const totalRow = totalResult.rows[0];
    const extremosRow = extremosResult.rows[0];
    const mediaSomaRow = mediaSomaResult.rows[0];

    if (!totalRow || !extremosRow || !mediaSomaRow) {
      return res
        .status(500)
        .json({ message: "Erro ao consolidar estatísticas" });
    }

    const frequenciaNumeros = frequenciaNumerosResult.rows
      .map((item) => ({
        numero: Number(item.numero),
        frequencia: Number(item.frequencia),
      }))
      .sort((a, b) => b.frequencia - a.frequencia || a.numero - b.numero);

    const dezenaMaisSorteadaRow = frequenciaNumeros[0];
    const dezenaMenosSorteadaRow = frequenciaNumeros
      .slice()
      .sort((a, b) => a.frequencia - b.frequencia || a.numero - b.numero)[0];

    const concursoMaiorSomaRow = maiorSomaResult.rows[0];
    const padraoParesRow = distribuicaoParesResult.rows
      .map((item) => ({
        qtd_pares: Number(item.qtd_pares),
        frequencia: Number(item.frequencia),
      }))
      .sort(
        (a, b) => b.frequencia - a.frequencia || b.qtd_pares - a.qtd_pares,
      )[0];

    return res.json({
      total_concursos: Number(totalRow.total),
      top_numeros: frequenciaNumeros.slice(0, 10),
      dezena_mais_sorteada: dezenaMaisSorteadaRow
        ? {
            numero: dezenaMaisSorteadaRow.numero,
            frequencia: dezenaMaisSorteadaRow.frequencia,
          }
        : null,
      dezena_menos_sorteada: dezenaMenosSorteadaRow
        ? {
            numero: dezenaMenosSorteadaRow.numero,
            frequencia: dezenaMenosSorteadaRow.frequencia,
          }
        : null,
      concurso_maior_soma: concursoMaiorSomaRow
        ? {
            concurso: Number(concursoMaiorSomaRow.concurso),
            data_do_sorteio: concursoMaiorSomaRow.data_do_sorteio,
            soma_dezenas: Number(concursoMaiorSomaRow.soma_dezenas),
            dezenas: concursoMaiorSomaRow.dezenas,
          }
        : null,
      top_pares_repetidos: paresRepetidosResult.rows.map((item) => ({
        par: [Number(item.n1), Number(item.n2)],
        frequencia: Number(item.frequencia),
      })),
      padrao_pares_mais_comum: padraoParesRow
        ? {
            qtd_pares: padraoParesRow.qtd_pares,
            frequencia: padraoParesRow.frequencia,
          }
        : null,
      distribuicao_pares: distribuicaoParesResult.rows.map((item) => ({
        qtd_pares: Number(item.qtd_pares),
        frequencia: Number(item.frequencia),
      })),
      media_soma_dezenas: Number(mediaSomaRow.media_soma),
      primeiro_concurso: Number(extremosRow.primeiro),
      ultimo_concurso: Number(extremosRow.ultimo),
      data_primeiro_concurso: extremosRow.data_primeiro,
      data_ultimo_concurso: extremosRow.data_ultimo,
    });
  } catch (err) {
    return handleInternalError(
      res,
      "Erro ao gerar estatísticas:",
      "Erro ao gerar estatísticas",
      err,
    );
  }
});

router.get("/concurso/:numero", async (req, res) => {
  try {
    const numero = Number(req.params.numero);
    if (!Number.isInteger(numero) || numero <= 0) {
      return res.status(400).json({ message: "Número de concurso inválido" });
    }
    const result = await pool.query(
      "SELECT * FROM megasena WHERE concurso = $1",
      [numero],
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Não existem dados do concurso ${numero}` });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    return handleInternalError(
      res,
      "Erro ao consultar concurso por número:",
      "Erro ao consultar o banco",
      err,
    );
  }
});

export default router;
