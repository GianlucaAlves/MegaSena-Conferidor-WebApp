import express, { type Request, type Response } from "express";
import cors from "cors";
import concursoRoutes from "./routes/concursoRoutes.ts";

const app = express();
const port = Number(process.env.PORT || 3333);
app.use(cors());
app.use(express.json());

app.use(concursoRoutes);

app.get("/", (_req: Request, res: Response) => {
  return res.json({ message: "Olá Typescript com Express!" });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
