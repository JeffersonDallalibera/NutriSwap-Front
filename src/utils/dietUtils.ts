import { AlimentoEntry } from "../types/dietTypes";

export const createNewAlimento = (): AlimentoEntry => ({
  tipo: 0,
  idAlimento: 0,
  nome: "",
  tipoQuantidade: "",
  quantidade: "",
  equivalente: [],
});

export const createNewMeal = (): {
  nome: string;
  alimentos: AlimentoEntry[];
} => ({
  nome: "",
  alimentos: [createNewAlimento()],
});
