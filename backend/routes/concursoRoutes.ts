import pool from "../ds.ts";
import express from "express";

const router = express.Router();

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
