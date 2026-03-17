import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { Concurso, Estatisticas } from "../types/megasena";

type MegaSenaContextData = {
  concurso: Concurso | null;
  erro: string;
  carregando: boolean;
  numero: string;
  estatisticas: Estatisticas | null;
  carregandoEstatisticas: boolean;
  setNumero: (value: string) => void;
  buscarMaisRecente: () => void;
  buscarConcurso: () => void;
  buscarEstatisticas: () => void;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

const MegaSenaContext = createContext<MegaSenaContextData | undefined>(
  undefined,
);

export function MegaSenaProvider({ children }: { children: ReactNode }) {
  const [concurso, setConcurso] = useState<Concurso | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [numero, setNumero] = useState("");
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [carregandoEstatisticas, setCarregandoEstatisticas] = useState(true);

  const buscarMaisRecente = useCallback(() => {
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
      .catch((error: Error) => setErro(error.message))
      .finally(() => setCarregando(false));
  }, []);

  const buscarConcurso = useCallback(() => {
    const numeroBusca = numero.trim();
    if (!numeroBusca) {
      return;
    }

    setCarregando(true);
    setErro("");
    fetch(`${API_URL}/concurso/${numeroBusca}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Concurso não encontrado");
        }
        return res.json();
      })
      .then((data: Concurso) => setConcurso(data))
      .catch((error: Error) => setErro(error.message))
      .finally(() => setCarregando(false));
  }, [numero]);

  const buscarEstatisticas = useCallback(() => {
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
  }, []);

  useEffect(() => {
    buscarMaisRecente();
    buscarEstatisticas();
  }, [buscarMaisRecente, buscarEstatisticas]);

  const value = useMemo(
    () => ({
      concurso,
      erro,
      carregando,
      numero,
      estatisticas,
      carregandoEstatisticas,
      setNumero,
      buscarMaisRecente,
      buscarConcurso,
      buscarEstatisticas,
    }),
    [
      concurso,
      erro,
      carregando,
      numero,
      estatisticas,
      carregandoEstatisticas,
      buscarMaisRecente,
      buscarConcurso,
      buscarEstatisticas,
    ],
  );

  return (
    <MegaSenaContext.Provider value={value}>
      {children}
    </MegaSenaContext.Provider>
  );
}

export function useMegaSena() {
  const context = useContext(MegaSenaContext);

  if (!context) {
    throw new Error("useMegaSena deve ser usado dentro de MegaSenaProvider");
  }

  return context;
}
