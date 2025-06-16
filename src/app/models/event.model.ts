export interface Event {
  id?: number; // O ID pode ser opcional para criação
  nome: string;
  descricao: string;
  local: string;
  dataInicio: string; // Use string para datas vindas da API
  dataFim: string;     // Use string para datas vindas da API
  publicoAlvoAdulto: boolean;
}
