import type { Concurso } from "../types/megasena";

export function formatarData(data: string) {
  const date = new Date(data);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function calcularPercentual(valor: number, referencia: number) {
  if (referencia <= 0) {
    return 0;
  }

  return (valor / referencia) * 100;
}

export function obterDezenas(concurso: Concurso | null) {
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
}
