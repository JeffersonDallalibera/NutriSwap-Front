import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem, Select, InputLabel, FormControl, Typography, Paper, Grid } from '@mui/material';
import Person from '../Person';
import { PersonData } from '../Person/Person';
import '../styles/styles.css'


interface Alimento {
    id: number;
    nome: string;
}

interface AlimentoEntry {
    tipo: number;
    nome: string;
    tipoQuantidade: string;
    quantidade: string;
    equivalentes: Alimento[];
}

interface TipoAlimento {
    id: number;
    nome: string;
}

const createNewMeal = () => ({
    alimentos: [{ tipo: 0, nome: '', tipoQuantidade: '', quantidade: '', equivalentes: [] }],
});

const CreateDiet: React.FC = () => {
    const [meals, setMeals] = useState<{ alimentos: AlimentoEntry[] }[]>([createNewMeal()]);
    const [alimentos, setAlimentos] = useState<Alimento[]>([]);
    const [tiposAlimento, setTiposAlimento] = useState<TipoAlimento[]>([]);
    const [selectedTipo, setSelectedTipo] = useState<number | ''>(0);

    useEffect(() => {
        const fetchTiposAlimento = async () => {
            try {
                const response = await fetch('/api/tipos_alimento');
                const data = await response.json();
                setTiposAlimento(data);
            } catch (error) {
                console.error('Erro ao buscar tipos de alimentos:', error);
            }
        };

        fetchTiposAlimento();
    }, []);

    useEffect(() => {
        const fetchAlimentos = async () => {
            if (selectedTipo === 0) return;

            try {
                const response = await fetch(`/api/alimentos?tipo=${selectedTipo}`);
                const data = await response.json();
                setAlimentos(data);
            } catch (error) {
                console.error('Erro ao buscar alimentos:', error);
            }
        };

        fetchAlimentos();
    }, [selectedTipo]);

    const handleAlimentoChange = (
        mealIndex: number,
        alimentoIndex: number,
        field: keyof AlimentoEntry,
        value: string | number | Alimento[]
    ) => {
        setMeals((prevMeals) =>
            prevMeals.map((meal, mIndex) => {
                if (mIndex !== mealIndex) return meal;

                return {
                    ...meal,
                    alimentos: meal.alimentos.map((alimento, aIndex) =>
                        aIndex === alimentoIndex ? { ...alimento, [field]: value } : alimento
                    ),
                };
            })
        );
    };

    const addAlimento = (mealIndex: number) => {
        setMeals((prevMeals) =>
            prevMeals.map((meal, index) =>
                index === mealIndex
                    ? { ...meal, alimentos: [...meal.alimentos, { tipo: 0, nome: '', tipoQuantidade: '', quantidade: '', equivalentes: [] }] }
                    : meal
            )
        );
    };

    const addMeal = () => setMeals((prevMeals) => [...prevMeals, createNewMeal()]);

    const buscarAlimentosEquivalentes = async (mealIndex: number, alimentoIndex: number, alimentoNome: string) => {
        try {
            const response = await fetch(`/api/alimentos/equivalentes?nome=${alimentoNome}`);
            const data = await response.json();
            handleAlimentoChange(mealIndex, alimentoIndex, 'equivalentes', data);
        } catch (error) {
            console.error('Erro ao buscar alimentos equivalentes:', error);
        }
    };

    const handleSaveDiet = () => {
        console.log('Gerar PDF e salvar dieta:', meals);
    };

    const handleSavePerson = (person: PersonData) => {
        console.log('Pessoa salva:', person);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>Criar Dieta</Typography>
            <Person onSave={handleSavePerson} />
            {meals.map((meal, mealIndex) => (
                <Paper key={mealIndex} sx={{ padding: 2, marginBottom: 2 }}>
                    <Typography variant="h6">Refeição {mealIndex + 1}</Typography>
                    <Grid container spacing={2}>
                        {meal.alimentos.map((alimento, alimentoIndex) => (
                            <Grid item xs={12} key={alimentoIndex}>
                                <Box sx={{ marginBottom: 2 }}>
                                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                        <InputLabel>Tipo de alimento</InputLabel>
                                        <Select
                                            value={alimento.tipo}
                                            onChange={(e) => {
                                                const tipoValue = e.target.value as string;
                                                const tipoId = parseInt(tipoValue, 10);
                                                handleAlimentoChange(mealIndex, alimentoIndex, 'tipo', tipoId);
                                                setSelectedTipo(tipoId);
                                            }}
                                        >
                                            <MenuItem value={0}>Selecione um tipo</MenuItem>
                                            {tiposAlimento.map((tipo) => (
                                                <MenuItem key={tipo.id} value={tipo.id}>
                                                    {tipo.nome}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                        <InputLabel>Selecione um alimento</InputLabel>
                                        <Select
                                            value={alimento.nome}
                                            onChange={(e) => handleAlimentoChange(mealIndex, alimentoIndex, 'nome', e.target.value)}
                                        >
                                            <MenuItem value="">Selecione um alimento</MenuItem>
                                            {alimentos.map((alimento) => (
                                                <MenuItem key={alimento.id} value={alimento.nome}>
                                                    {alimento.nome}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                        <InputLabel>Tipo de Quantidade</InputLabel>
                                        <Select
                                            value={alimento.tipoQuantidade}
                                            onChange={(e) => handleAlimentoChange(mealIndex, alimentoIndex, 'tipoQuantidade', e.target.value)}
                                        >
                                            <MenuItem value="">Selecione o tipo</MenuItem>
                                            <MenuItem value="Porção">Porção</MenuItem>
                                            <MenuItem value="Quantidade">Quantidade</MenuItem>
                                        </Select>
                                        {alimento.tipoQuantidade === 'Porção' && (
                                            <Typography color="error" sx={{ marginTop: 1 }}>
                                                Considere 100 gramas para cada unidade de porção
                                            </Typography>
                                        )}
                                    </FormControl>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <TextField
                                            type="text"
                                            placeholder="Quantidade"
                                            value={alimento.quantidade}
                                            onChange={(e) => handleAlimentoChange(mealIndex, alimentoIndex, 'quantidade', e.target.value)}
                                            sx={{ flexWrap: 1 }}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => buscarAlimentosEquivalentes(mealIndex, alimentoIndex, alimento.nome)}
                                            sx={{ height: '40px', minWidth: '120px', fontSize: '0.875rem' }} // Ajuste o tamanho do botão
                                        >
                                            Buscar Equivalentes
                                        </Button>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginTop: 2 }}>
                                        {alimento.equivalentes.map((equivalente, index) => (
                                            <Paper key={index} sx={{ padding: 1, boxShadow: 1, textAlign: 'center', maxWidth: 150 }}>
                                                <Typography variant="body2">{equivalente.nome}</Typography>
                                            </Paper>
                                        ))}
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                        <Grid item xs={12} sx={{ display: 'flex', gap: 2, flexDirection: 'column', alignItems: 'flex-start', marginTop: 2 }}>
                            <Button variant="contained" color="primary" onClick={() => addAlimento(mealIndex)} sx={{ minWidth: '200px' }}>
                                Adicionar Alimento
                            </Button>
                            {meals.length > 1 && (
                                <Button variant="outlined" color="secondary" onClick={() => setMeals((prev) => prev.filter((_, i) => i !== mealIndex))} sx={{ minWidth: '200px' }}>
                                    Remover Refeição
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Paper>
            ))}
            <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                <Button variant="contained" color="primary" onClick={addMeal} sx={{ flexGrow: 1 }}>
                    Adicionar Refeição
                </Button>
                <Button variant="contained" color="success" onClick={handleSaveDiet} sx={{ flexGrow: 1 }}>
                    Salvar Dieta
                </Button>
            </Box>
        </Box>
    );
};

export default CreateDiet;
