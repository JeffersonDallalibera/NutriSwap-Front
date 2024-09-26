// src/api/dietApi.ts
import api from '../services/api';
import { TipoAlimento, Alimento } from '../types/dietTypes';

export const fetchTiposAlimento = async (): Promise<TipoAlimento[]> => {
    try {
        const response = await api.get("/api/tipos_alimento");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar tipos de alimentos:", error);
        return [];
    }
};

export const fetchAlimentos = async (tipoId: number): Promise<Alimento[]> => {
    if (tipoId === 0) return [];
    try {
        const response = await api.get(`/api/alimentos?tipo=${tipoId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar alimentos:", error);
        return [];
    }
};

export const fetchAlimentosEquivalentes = async (alimentoId: number, quantidade: number, tipoQuantidade: string): Promise<Alimento[]> => {
    try {
        console.log(alimentoId,quantidade, tipoQuantidade)
        const response = await api.post(`/api/busca-equivalente`, {
            "alimento_id": alimentoId,
            "quantidade" : quantidade,
            "tipo_quantidade" : tipoQuantidade
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar alimentos equivalentes:", error);
        return [];
    }
};