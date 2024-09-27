// src/components/AlimentoForm/AlimentoForm.tsx
import React, { useEffect, useState } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Button,
    Typography,
    Paper,
} from '@mui/material';
import { AlimentoEntry, TipoAlimento, Alimento } from '../../types/dietTypes';
import { fetchAlimentos } from "../../api/dietApi";

interface AlimentoFormProps {
    alimento: AlimentoEntry;
    mealIndex: number;
    alimentoIndex: number;
    tiposAlimento: TipoAlimento[];
    onTipoChange: (mealIndex: number, alimentoIndex: number, tipoId: number) => void;
    onIdAlimentoChange: (mealIndex: number, alimentoIndex: number, alimentoId: number) => void;
    onQuantidadeChange: (mealIndex: number, alimentoIndex: number, quantidade: string) => void;
    onTipoQuantidadeChange: (mealIndex: number, alimentoIndex: number, tipoQuantidade: string) => void;
    onBuscarEquivalentes: (mealIndex: number, alimentoIndex: number) => void;
    onRemoveAlimento: (mealIndex: number, alimentoIndex: number) => void;
}

const AlimentoForm: React.FC<AlimentoFormProps> = ({
                                                       alimento,
                                                       mealIndex,
                                                       alimentoIndex,
                                                       tiposAlimento,
                                                       onTipoChange,
                                                       onIdAlimentoChange,
                                                       onQuantidadeChange,
                                                       onTipoQuantidadeChange,
                                                       onBuscarEquivalentes,
                                                       onRemoveAlimento,
                                                   }) => {

    const [alimentos, setAlimentos] = useState<Alimento[]>([]);

    useEffect(() => {
        if (alimento.tipo) {
            fetchAlimentos(alimento.tipo)
                .then(alimentoData => setAlimentos(alimentoData));
        }
    }, [alimento.tipo]);

    useEffect(() => {
        // Atualiza o nome do alimento quando o ID muda
        const alimentoSelecionado = alimentos.find(a => a.alimento_id === alimento.idAlimento);
        if (alimentoSelecionado) {
            onIdAlimentoChange(mealIndex, alimentoIndex, alimentoSelecionado.alimento_id);
        }
    }, [alimento.idAlimento, alimentos, onIdAlimentoChange, mealIndex, alimentoIndex]);

    return (
        <Box sx={{ marginBottom: 2 }}>
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id={`food-type-select-label-${mealIndex}-${alimentoIndex}`}>
                    Tipo de alimento
                </InputLabel>
                <Select
                    labelId={`food-type-select-label-${mealIndex}-${alimentoIndex}`}
                    value={alimento.tipo}
                    label="Tipo de alimento"
                    onChange={(e) => onTipoChange(mealIndex, alimentoIndex, Number(e.target.value))}
                >
                    <MenuItem value={0}>Selecione um tipo</MenuItem>
                    {tiposAlimento.map((tipo) => (
                        <MenuItem key={tipo.id} value={tipo.id}>{tipo.nome}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id={`food-select-label-${mealIndex}-${alimentoIndex}`}>
                    Selecione um alimento
                </InputLabel>
                <Select
                    labelId={`food-select-label-${mealIndex}-${alimentoIndex}`}
                    value={alimento.idAlimento || ''}
                    label="Selecione um alimento"
                    onChange={(e) => onIdAlimentoChange(mealIndex, alimentoIndex, Number(e.target.value))}
                >
                    <MenuItem value="">Selecione um alimento</MenuItem>
                    {alimentos.map((a) => (
                        <MenuItem key={a.alimento_id} value={a.alimento_id}>{a.nome}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id={`quantity-type-select-label-${mealIndex}-${alimentoIndex}`}>
                    Tipo de Quantidade
                </InputLabel>
                <Select
                    labelId={`quantity-type-select-label-${mealIndex}-${alimentoIndex}`}
                    value={alimento.tipoQuantidade}
                    label="Tipo de Quantidade"
                    onChange={(e) => onTipoQuantidadeChange(mealIndex, alimentoIndex, e.target.value)}
                >
                    <MenuItem value="">Selecione o tipo</MenuItem>
                    <MenuItem value="Porção">Porção</MenuItem>
                    <MenuItem value="Quantidade">Quantidade (g)</MenuItem>
                </Select>
                {alimento.tipoQuantidade === "Porção" && (
                    <Typography color="error" sx={{ marginTop: 1 }}>
                        Considere 100 gramas para cada unidade de porção
                    </Typography>
                )}
            </FormControl>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField
                    type="text"
                    placeholder="Quantidade"
                    value={alimento.quantidade}
                    onChange={(e) => onQuantidadeChange(mealIndex, alimentoIndex, e.target.value)}
                    sx={{ flexGrow: 1 }}
                    multiline
                    size="small"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onBuscarEquivalentes(mealIndex, alimentoIndex)}
                    sx={{ height: "32px", minWidth: "30px", fontSize: "0.75rem", px: 1 }}
                >
                    Buscar Equivalentes
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => onRemoveAlimento(mealIndex, alimentoIndex)}
                    sx={{ height: "32px", minWidth: "30px", fontSize: "0.75rem", px: 1 }}
                >
                    Excluir
                </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", marginTop: 2 }}>
                {alimento.equivalentes.map((equivalentes, index) => (
                    <Paper key={index} sx={{ padding: 1, boxShadow: 1, textAlign: "center", minWidth: 150 }}>
                        <Typography variant="subtitle2">{equivalentes.nome}</Typography>
                        <Typography variant="body2">
                            {equivalentes.quantidade} {equivalentes.tipo}
                        </Typography>
                        {/* Adicione mais informações nutricionais conforme necessário */}
                    </Paper>
                ))}
            </Box>
        </Box>
    );
};

export default AlimentoForm;