// src/types/dietTypes.ts

export interface Alimento {
  tipo: string;
  quantidade: string;
  alimento_id: number;
  categoria: string;
  descricao: string | null;
  nome: string;
  tipo_alimento: string;
  tipo_alimento_id: number;
  equivalentes: Equivalente[];
}

export interface Equivalente {
  alimento: Alimento;
  informacaoNutricional: InformacaoNutricional; // corrigir o nome aqui
  quantidade_ajustada: number;
  grau_similaridade: number;
}

export interface InformacaoNutricional {
  alimento_id: number; // corrigir o nome aqui também
  calcio: number;
  calorias: number;
  carboidrato: number;
  ferro: number;
  fibra: number;
  lipidio: number;
  proteina: number;
  sodio: number;
  vitaminac: number | null; // vitamina C pode ser null
}

export interface AlimentoEntry {
  tipo: number;
  idAlimento: number;
  nome: string;
  tipoQuantidade: string;
  quantidade: string;
  equivalente: Alimento[];
}

export interface TipoAlimento {
  id: number;
  nome: string;
}

export interface Meal {
  nome: string;
  alimentos: AlimentoEntry[];
}

export interface Diet {
  id: number;
  createdAt: Date;
  clientName: string;
}
