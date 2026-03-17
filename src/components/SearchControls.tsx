import {
  Input,
  PrimaryButton,
  SearchRow,
  SecondaryButton,
} from "../styles/App.styles";

type SearchControlsProps = {
  numero: string;
  carregando: boolean;
  onNumeroChange: (value: string) => void;
  onBuscarConcurso: () => void;
  onBuscarMaisRecente: () => void;
};

export function SearchControls({
  numero,
  carregando,
  onNumeroChange,
  onBuscarConcurso,
  onBuscarMaisRecente,
}: SearchControlsProps) {
  return (
    <SearchRow>
      <Input
        type="number"
        value={numero}
        onChange={(e) => onNumeroChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onBuscarConcurso();
          }
        }}
        placeholder="Digite o número do concurso"
      />
      <PrimaryButton onClick={onBuscarConcurso} disabled={carregando}>
        Buscar
      </PrimaryButton>
      <SecondaryButton onClick={onBuscarMaisRecente} disabled={carregando}>
        Mais recente
      </SecondaryButton>
    </SearchRow>
  );
}
