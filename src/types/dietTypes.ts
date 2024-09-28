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
    infomacaoNutricional : InformacaoNutricional;

}

export interface InformacaoNutricional{
    alimentoId: number;
    calcio: number;
    calorias: number;
    carboidrato: number;
    ferro: number;
    fibra: number;
    lipidio: number;
    proteina: number;
    sodio: number;
    vitaminacao: number;


}

export interface AlimentoEntry {
    tipo: number;
    idAlimento: number;
    nome: string;
    tipoQuantidade: string;
    quantidade: string;
    equivalentes: Alimento[];
}

export interface TipoAlimento {
    id: number;
    nome: string;
}

export interface Meal {
    nome: string;
    alimentos: AlimentoEntry[];
}

export interface PersonData {
    // Defina os campos necessários para PersonData
}

export interface Diet{
    id: number;
    createdAt: Date;
    clientName: string;

}