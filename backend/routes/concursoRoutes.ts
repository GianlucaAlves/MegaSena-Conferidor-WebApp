import pool from "../ds.ts";
import express from "express";

const router = express.Router();

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
    return res
      .status(500)
      .json({ message: "Erro ao consultar o banco", error: err });
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

    const extremosResult = await pool.query<ExtremosConcurso>(
      `
      SELECT
        (SELECT concurso::int FROM megasena ORDER BY concurso ASC LIMIT 1) AS primeiro,
        (SELECT data_do_sorteio FROM megasena ORDER BY concurso ASC LIMIT 1) AS data_primeiro,
        (SELECT concurso::int FROM megasena ORDER BY concurso DESC LIMIT 1) AS ultimo,
        (SELECT data_do_sorteio FROM megasena ORDER BY concurso DESC LIMIT 1) AS data_ultimo
      `,
    );

    const topNumerosResult = await pool.query<TopNumero>(
      `
      WITH dezenas AS (
        SELECT UNNEST(ARRAY[
          bola1::int,
          bola2::int,
          bola3::int,
          bola4::int,
          bola5::int,
          bola6::int
        ]) AS numero
        FROM megasena
      )
      SELECT numero, COUNT(*)::int AS frequencia
      FROM dezenas
      GROUP BY numero
      ORDER BY frequencia DESC, numero ASC
      LIMIT 10
      `,
    );

    const menosSorteadoResult = await pool.query<TopNumero>(
      `
      WITH dezenas AS (
        SELECT UNNEST(ARRAY[
          bola1::int,
          bola2::int,
          bola3::int,
          bola4::int,
          bola5::int,
          bola6::int
        ]) AS numero
        FROM megasena
      )
      SELECT numero, COUNT(*)::int AS frequencia
      FROM dezenas
      GROUP BY numero
      ORDER BY frequencia ASC, numero ASC
      LIMIT 1
      `,
    );

    const maiorSomaResult = await pool.query<ConcursoSoma>(
      `
      SELECT
        concurso,
        data_do_sorteio,
        (bola1::int + bola2::int + bola3::int + bola4::int + bola5::int + bola6::int)::int AS soma_dezenas,
        ARRAY[
          bola1::int,
          bola2::int,
          bola3::int,
          bola4::int,
          bola5::int,
          bola6::int
        ] AS dezenas
      FROM megasena
      ORDER BY soma_dezenas DESC, concurso DESC
      LIMIT 1
      `,
    );

    const paresRepetidosResult = await pool.query<ParRepetido>(
      `
      WITH dezenas_por_concurso AS (
        SELECT
          ARRAY[
            bola1::int,
            bola2::int,
            bola3::int,
            bola4::int,
            bola5::int,
            bola6::int
          ] AS dezenas
        FROM megasena
      ),
      pares AS (
        SELECT
          LEAST(d1.numero, d2.numero) AS n1,
          GREATEST(d1.numero, d2.numero) AS n2
        FROM dezenas_por_concurso,
          LATERAL UNNEST(dezenas) WITH ORDINALITY AS d1(numero, idx1),
          LATERAL UNNEST(dezenas) WITH ORDINALITY AS d2(numero, idx2)
        WHERE d1.idx1 < d2.idx2
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
    );

    const padraoParesResult = await pool.query<PadraoPares>(
      `
      WITH pares_por_concurso AS (
        SELECT
          (
            (bola1::int % 2 = 0)::int +
            (bola2::int % 2 = 0)::int +
            (bola3::int % 2 = 0)::int +
            (bola4::int % 2 = 0)::int +
            (bola5::int % 2 = 0)::int +
            (bola6::int % 2 = 0)::int
          ) AS qtd_pares
        FROM megasena
      ),
      frequencias AS (
        SELECT qtd_pares, COUNT(*)::int AS frequencia
        FROM pares_por_concurso
        GROUP BY qtd_pares
      )
      SELECT qtd_pares, frequencia
      FROM frequencias
      ORDER BY frequencia DESC, qtd_pares DESC
      LIMIT 1
      `,
    );

    const distribuicaoParesResult = await pool.query<PadraoPares>(
      `
      WITH pares_por_concurso AS (
        SELECT
          (
            (bola1::int % 2 = 0)::int +
            (bola2::int % 2 = 0)::int +
            (bola3::int % 2 = 0)::int +
            (bola4::int % 2 = 0)::int +
            (bola5::int % 2 = 0)::int +
            (bola6::int % 2 = 0)::int
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
    );

    const mediaSomaResult = await pool.query<{ media_soma: string | number }>(
      `
      SELECT ROUND(AVG(bola1::int + bola2::int + bola3::int + bola4::int + bola5::int + bola6::int)::numeric, 2) AS media_soma
      FROM megasena
      `,
    );

    const totalRow = totalResult.rows[0];
    const extremosRow = extremosResult.rows[0];
    const mediaSomaRow = mediaSomaResult.rows[0];

    if (!totalRow || !extremosRow || !mediaSomaRow) {
      return res
        .status(500)
        .json({ message: "Erro ao consolidar estatísticas" });
    }

    const dezenaMaisSorteadaRow = topNumerosResult.rows[0];
    const dezenaMenosSorteadaRow = menosSorteadoResult.rows[0];
    const concursoMaiorSomaRow = maiorSomaResult.rows[0];
    const padraoParesRow = padraoParesResult.rows[0];

    return res.json({
      total_concursos: Number(totalRow.total),
      top_numeros: topNumerosResult.rows.map((item) => ({
        numero: Number(item.numero),
        frequencia: Number(item.frequencia),
      })),
      dezena_mais_sorteada: dezenaMaisSorteadaRow
        ? {
            numero: Number(dezenaMaisSorteadaRow.numero),
            frequencia: Number(dezenaMaisSorteadaRow.frequencia),
          }
        : null,
      dezena_menos_sorteada: dezenaMenosSorteadaRow
        ? {
            numero: Number(dezenaMenosSorteadaRow.numero),
            frequencia: Number(dezenaMenosSorteadaRow.frequencia),
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
            qtd_pares: Number(padraoParesRow.qtd_pares),
            frequencia: Number(padraoParesRow.frequencia),
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
    return res
      .status(500)
      .json({ message: "Erro ao gerar estatísticas", error: err });
  }
});

router.get("/concurso/:numero", async (req, res) => {
  try {
    const numero = Number(req.params.numero);
    if (Number.isNaN(numero)) {
      return res.status(400).json({ message: "Número de concurso inválido " });
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
    return res
      .status(500)
      .json({ message: "Erro ao consultar o banco", error: err });
  }
});

export default router;
