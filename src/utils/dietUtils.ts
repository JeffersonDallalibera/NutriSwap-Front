import { AlimentoEntry, Meal } from '../types/dietTypes';

export const createNewAlimento = (): AlimentoEntry => ({
    tipo: 0,
    idAlimento: 0,
    nome: "",
    tipoQuantidade: "",
    quantidade: "",
    equivalentes: [],
});

export const createNewMeal = (): { nome: string; alimentos: AlimentoEntry[] } => ({
    nome: "",
    alimentos: [createNewAlimento()],
});