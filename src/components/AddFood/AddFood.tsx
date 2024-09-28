import React, { useEffect, useState } from 'react';
import './AddFood.css';
import { fetchTiposAlimento, fetchInserirNovoAlimento } from "../../api/dietApi";
import { TipoAlimento } from "../../types/dietTypes";
import { Button, Snackbar, Alert, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent, Grid, TextField } from '@mui/material';
import Sidebar from '../Sidebar'; // Importe seu componente de Sidebar

interface NutritionalInfo {
    proteina: string; // Mudou para string
    carboidrato: string; // Mudou para string
    lipidio: string; // Mudou para string
    fibra: string; // Mudou para string
    calorias: string; // Mudou para string
    vitaminac: string; // Mudou para string
    calcio: string; // Mudou para string
    ferro: string; // Mudou para string
    sodio: string; // Mudou para string
}

interface Food {
    nome: string;
    categoria: string;
    descricao: string;
    tipo: string;
}

const AddFood: React.FC = () => {
    const [tiposAlimento, setTiposAlimento] = useState<TipoAlimento[]>([]);
    const [food, setFood] = useState<Food>({
        nome: '',
        categoria: '',
        descricao: '',
        tipo: ''
    });

    const [nutritionalInfo, setNutritionalInfo] = useState<NutritionalInfo>({
        proteina: '',
        carboidrato: '',
        lipidio: '',
        fibra: '',
        calorias: '',
        vitaminac: '',
        calcio: '',
        ferro: '',
        sodio: ''
    });

    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchTiposAlimento().then(setTiposAlimento);
    }, []);

    const handleFoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFood({ ...food, [name as keyof Food]: value });
    };

    const handleNutritionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNutritionalInfo({ ...nutritionalInfo, [name as keyof NutritionalInfo]: value });
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        setFood({ ...food, tipo: e.target.value });
    };

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const alimentoData = {
            nome: food.nome,
            categoria: food.categoria,
            descricao: food.descricao,
            tipo_alimento_id: food.tipo,
            informacoes_nutricionais: {
                proteina: parseFloat(nutritionalInfo.proteina) || 0,
                carboidrato: parseFloat(nutritionalInfo.carboidrato) || 0,
                lipidio: parseFloat(nutritionalInfo.lipidio) || 0,
                fibra: parseFloat(nutritionalInfo.fibra) || 0,
                calorias: parseFloat(nutritionalInfo.calorias) || 0,
                vitaminac: parseFloat(nutritionalInfo.vitaminac) || 0,
                calcio: parseFloat(nutritionalInfo.calcio) || 0,
                ferro: parseFloat(nutritionalInfo.ferro) || 0,
                sodio: parseFloat(nutritionalInfo.sodio) || 0
            }
        };

        try {
            await fetchInserirNovoAlimento(alimentoData);
            handleClick();
            setFood({ nome: '', categoria: '', descricao: '', tipo: '' });
            setNutritionalInfo({
                proteina: '',
                carboidrato: '',
                lipidio: '',
                fibra: '',
                calorias: '',
                vitaminac: '',
                calcio: '',
                ferro: '',
                sodio: ''
            });
        } catch (error) {
            console.error("Erro ao adicionar alimento:", error);
        }
    };

    return (
        <div className="add-food-container">
            <Grid container>
                <Grid item xs={10}>
                    <h1>Adicionar Alimento</h1>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <h2>Informações do Alimento</h2>
                                {['nome', 'categoria', 'descricao'].map(field => (
                                    <TextField
                                        key={field}
                                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                                        name={field}
                                        value={food[field as keyof Food]} // Acesso correto
                                        onChange={handleFoodChange}
                                        fullWidth
                                        multiline
                                        margin="normal" // Adiciona espaçamento
                                    />
                                ))}
                                <FormControl fullWidth margin="normal"> {/* Adiciona espaçamento */}
                                    <InputLabel>Tipo</InputLabel>
                                    <Select
                                        name="tipo"
                                        value={food.tipo}
                                        onChange={handleSelectChange}
                                        label="Tipo"
                                    >
                                        {tiposAlimento.map(tipo => (
                                            <MenuItem key={tipo.id} value={tipo.id}>
                                                {tipo.nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <h2>Informação Nutricional</h2>
                                {[
                                    'proteina', 'carboidrato', 'lipidio', 'fibra',
                                    'calorias', 'vitaminac', 'calcio', 'ferro', 'sodio'
                                ].map(field => (
                                    <TextField
                                        key={field}
                                        label={`${field.charAt(0).toUpperCase() + field.slice(1)} (g)`} // Ajusta o label
                                        name={field}
                                        type="number"
                                        value={nutritionalInfo[field as keyof NutritionalInfo]} // Acesso correto
                                        onChange={handleNutritionalChange}
                                        fullWidth
                                        multiline
                                        margin="normal" // Adiciona espaçamento
                                        placeholder="0" // Adiciona um placeholder
                                    />
                                ))}
                            </Grid>
                        </Grid>
                        <Button type="submit" variant="contained" color="primary">
                            Adicionar Alimento
                        </Button>
                    </form>

                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                            Alimento adicionado com sucesso!
                        </Alert>
                    </Snackbar>
                </Grid>
            </Grid>
        </div>
    );
};

export default AddFood;
