// src/api/dietApi.ts
import api from '../services/api';
import {TipoAlimento, Alimento, Diet, Meal} from '../types/dietTypes';

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

export const fetchInserirNovoAlimento = async (alimentoData: any) => {
    try {
        // Fazendo a requisição POST para o backend
        const response = await api.post(`api/inserir`, alimentoData);

        // Retorna a resposta em caso de sucesso
        return response;
    } catch (error) {
        // Lançar um erro em caso de falha
        console.error("Erro ao inserir novo alimento:", error);
        throw error;
    }
};


export const fetchDiets = async (): Promise<Diet[]> => {
    try {
        const response = await api.get(`/diets`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dietas:', error);
        throw error;
    }
};

export const downloadDiet = async (dietId: number): Promise<void> => {
    try {
        const response = await api.get(`$/diets/${dietId}/download`, {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `dieta_${dietId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Erro ao baixar dieta:', error);
        throw error;
    }
};
export const fetchGerarPdf = async (data: { idPessoa: number | undefined; refeicoes: Meal[] }) => {
    try {
        console.log(data.idPessoa);
        
        console.log(data)
        const response = await api.post('api/gerar_dieta', data, {
            responseType: 'blob', // Para lidar com o PDF
        });
        return response;
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        throw error;
    }
};