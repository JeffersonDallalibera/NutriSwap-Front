import React, { useEffect, useState, useCallback } from "react";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import Person from "../Person/Person";
import AlimentoForm from "../AlimentoForm/AlimentoForm";
import { Meal, Alimento, TipoAlimento, PersonData, AlimentoEntry } from "../../types/dietTypes";
import { createNewMeal, createNewAlimento } from "../../utils/dietUtils";
import { fetchTiposAlimento, fetchAlimentos, fetchAlimentosEquivalentes } from "../../api/dietApi";

const CreateDiet: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([createNewMeal()]);
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [tiposAlimento, setTiposAlimento] = useState<TipoAlimento[]>([]);
  const [tipoSelecionado, setTipoSelecionado] = useState<number>(0);

  useEffect(() => {
    fetchTiposAlimento().then(setTiposAlimento);
  }, []);

  useEffect(() => {
    if (tipoSelecionado !== 0) {
      fetchAlimentos(tipoSelecionado).then(setAlimentos);
    }
  }, [tipoSelecionado]);

  const handleAlimentoChange = useCallback((
      mealIndex: number,
      alimentoIndex: number,
      field: keyof AlimentoEntry,
      value: string | number | Alimento[] // Certifique-se de que value pode ser um array de Alimento
  ) => {
    console.log(mealIndex, alimentoIndex, field, value);
    setMeals(prevMeals => prevMeals.map((meal, mIndex) =>
        mIndex === mealIndex
            ? {
              ...meal,
              alimentos: meal.alimentos.map((alimento, aIndex) =>
                  aIndex === alimentoIndex
                      ? { ...alimento, [field]: field === 'equivalentes' ? [...(value as Alimento[])] : value } // Se for 'equivalentes', espalhe o array
                      : alimento
              )
            }
            : meal
    ));
  }, []);

  const handleTipoChange = useCallback((mealIndex: number, alimentoIndex: number, tipoId: number) => {
    handleAlimentoChange(mealIndex, alimentoIndex, "tipo", tipoId);
    handleAlimentoChange(mealIndex, alimentoIndex, "idAlimento", 0);
    setTipoSelecionado(tipoId);
  }, [handleAlimentoChange]);

  const handleIdAlimentoChange = useCallback((mealIndex: number, alimentoIndex: number, alimentoId: number) => {
    handleAlimentoChange(mealIndex, alimentoIndex, "idAlimento", alimentoId);
    const selectedAlimento = alimentos.find(a => a.alimento_id === alimentoId);
    if (selectedAlimento) {
      handleAlimentoChange(mealIndex, alimentoIndex, "nome", selectedAlimento.nome);
    }
  }, [handleAlimentoChange, alimentos]);

  const handleQuantidadeChange = useCallback((mealIndex: number, alimentoIndex: number, quantidade: string) => {
    handleAlimentoChange(mealIndex, alimentoIndex, "quantidade", quantidade);
  }, [handleAlimentoChange]);

  const handleTipoQuantidadeChange = useCallback((mealIndex: number, alimentoIndex: number, tipoQuantidade: string) => {
    handleAlimentoChange(mealIndex, alimentoIndex, "tipoQuantidade", tipoQuantidade);
  }, [handleAlimentoChange]);

  const addAlimento = useCallback((mealIndex: number) => {
    setMeals(prevMeals => prevMeals.map((meal, index) =>
        index === mealIndex
            ? { ...meal, alimentos: [...meal.alimentos, createNewAlimento()] }
            : meal
    ));
  }, []);

  const removeAlimento = useCallback((mealIndex: number, alimentoIndex: number) => {
    setMeals(prevMeals => prevMeals.map((meal, index) =>
        index === mealIndex
            ? { ...meal, alimentos: meal.alimentos.filter((_, aIndex) => aIndex !== alimentoIndex) }
            : meal
    ));
  }, []);

  const addMeal = useCallback(() => setMeals(prevMeals => [...prevMeals, createNewMeal()]), []);

  const removeMeal = useCallback((mealIndex: number) => {
    setMeals(prevMeals => prevMeals.filter((_, index) => index !== mealIndex));
  }, []);

  const buscarAlimentosEquivalentes = useCallback(async (mealIndex: number, alimentoIndex: number) => {
    const alimento = meals[mealIndex].alimentos[alimentoIndex];
    if (alimento.idAlimento && alimento.quantidade && alimento.tipoQuantidade) {
      const tipoQuantidade = alimento.tipoQuantidade ==='Porção' ? 'porcao' : 'quantidade'
      const equivalentes = await fetchAlimentosEquivalentes(
          alimento.idAlimento,
          parseFloat(alimento.quantidade),
          tipoQuantidade
      );
      handleAlimentoChange(mealIndex, alimentoIndex, 'equivalentes', equivalentes);
    } else {
      console.error("Dados incompletos para buscar equivalentes");
    }
  }, [meals, handleAlimentoChange]);

  const handleSaveDiet = () => {
    console.log("Gerar PDF e salvar dieta:", meals);
  };

  const handleSavePerson = (person: PersonData) => {
    console.log("Pessoa salva:", person);
  };

  return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>Criar Dieta</Typography>
        <Person onSave={handleSavePerson} />
        {meals.map((meal, mealIndex) => (
            <Paper key={mealIndex} sx={{ padding: 2, marginBottom: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 2, paddingLeft: 2 }}>
                Refeição {mealIndex + 1}
              </Typography>
              <Grid container spacing={2}>
                {meal.alimentos.map((alimento, alimentoIndex) => (
                    <Grid item xs={12} key={alimentoIndex}>
                      <AlimentoForm
                          alimento={alimento}
                          mealIndex={mealIndex}
                          alimentoIndex={alimentoIndex}
                          tiposAlimento={tiposAlimento}
                          alimentos={alimentos}
                          onTipoChange={handleTipoChange}
                          onIdAlimentoChange={handleIdAlimentoChange}
                          onQuantidadeChange={handleQuantidadeChange}
                          onTipoQuantidadeChange={handleTipoQuantidadeChange}
                          onRemoveAlimento={removeAlimento}
                          onBuscarEquivalentes={() => buscarAlimentosEquivalentes(mealIndex, alimentoIndex)}
                      />
                    </Grid>
                ))}
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button onClick={() => addAlimento(mealIndex)} variant="outlined">
                  Adicionar Alimento
                </Button>
                <Button onClick={() => removeMeal(mealIndex)} variant="outlined" color="error">
                  Remover Refeição
                </Button>
              </Box>
            </Paper>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button onClick={addMeal} variant="contained">
            Adicionar Refeição
          </Button>
          <Button onClick={handleSaveDiet} variant="contained" color="primary">
            Salvar Dieta
          </Button>
        </Box>
      </Box>
  );
};

export default CreateDiet;