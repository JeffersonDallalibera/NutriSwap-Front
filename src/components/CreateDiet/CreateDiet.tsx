import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import {
    fetchAlimentosEquivalentes, fetchGerarPdf,
    fetchTiposAlimento,
} from "../../api/dietApi";
import {
  Alimento,
  AlimentoEntry,
  Equivalente,
  Meal,
  TipoAlimento,
} from "../../types/dietTypes";
import { createNewAlimento, createNewMeal } from "../../utils/dietUtils";
import AlimentoForm from "../AlimentoForm/AlimentoForm";
import Person, {PersonData} from "../Person/Person";

const CreateDiet: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([createNewMeal()]);
  const [tiposAlimento, setTiposAlimento] = useState<TipoAlimento[]>([]);
  const [pessoaId, setPessoaId] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchTiposAlimento().then(setTiposAlimento);
  }, []);

    const handleAlimentoChange = useCallback(
        (
            mealIndex: number,
            alimentoIndex: number,
            field: keyof AlimentoEntry,
            value: string | number | Alimento[] | Equivalente[] | number
        ) => {
            setMeals((prevMeals) =>
                prevMeals.map((meal, mIndex) =>
                    mIndex === mealIndex
                        ? {
                            ...meal,
                            alimentos: meal.alimentos.map((alimento, aIndex) =>
                                aIndex === alimentoIndex
                                    ? { ...alimento, [field]: value }
                                    : alimento
                            ),
                        }
                        : meal
                )
            );
        },
        []
    );

  const handleTipoChange = useCallback(
    (mealIndex: number, alimentoIndex: number, tipoId: number) => {
      handleAlimentoChange(mealIndex, alimentoIndex, "tipo", tipoId);
      handleAlimentoChange(mealIndex, alimentoIndex, "idAlimento", 0);
      handleAlimentoChange(mealIndex, alimentoIndex, "nome", "");
    },
    [handleAlimentoChange]
  );

  const handleIdAlimentoChange = useCallback(
    (mealIndex: number, alimentoIndex: number, alimentoId: number, alimentoNome: string) => {
      handleAlimentoChange(mealIndex, alimentoIndex, "idAlimento", alimentoId);
      handleAlimentoChange(mealIndex, alimentoIndex, "nome", alimentoNome);
    },
    [handleAlimentoChange]
  );

  const handleQuantidadeChange = useCallback(
    (mealIndex: number, alimentoIndex: number, quantidade: string) => {
      handleAlimentoChange(mealIndex, alimentoIndex, "quantidade", quantidade);
    },
    [handleAlimentoChange]
  );

  const handleTipoQuantidadeChange = useCallback(
    (mealIndex: number, alimentoIndex: number, tipoQuantidade: string) => {
      handleAlimentoChange(
        mealIndex,
        alimentoIndex,
        "tipoQuantidade",
        tipoQuantidade
      );
    },
    [handleAlimentoChange]
  );

  const addAlimento = useCallback((mealIndex: number) => {
    setMeals((prevMeals) =>
      prevMeals.map((meal, index) =>
        index === mealIndex
          ? { ...meal, alimentos: [...meal.alimentos, createNewAlimento()] }
          : meal
      )
    );
  }, []);

  const removeAlimento = useCallback(
    (mealIndex: number, alimentoIndex: number) => {
      setMeals((prevMeals) =>
        prevMeals.map((meal, index) =>
          index === mealIndex
            ? {
                ...meal,
                alimentos: meal.alimentos.filter(
                  (_, aIndex) => aIndex !== alimentoIndex
                ),
              }
            : meal
        )
      );
    },
    []
  );

  const addMeal = useCallback(
    () => setMeals((prevMeals) => [...prevMeals, createNewMeal()]),
    []
  );

  const removeMeal = useCallback((mealIndex: number) => {
    setMeals((prevMeals) =>
      prevMeals.filter((_, index) => index !== mealIndex)
    );
  }, []);


  const buscarAlimentosEquivalentes = useCallback(async (mealIndex: number, alimentoIndex: number) => {
      const alimento = meals[mealIndex].alimentos[alimentoIndex];
      if (
        alimento.idAlimento &&
        alimento.quantidade &&
        alimento.tipoQuantidade
      ) {
        const tipoQuantidade =
          alimento.tipoQuantidade === "Porção" ? "porcao" : "quantidade";
        const equivalente: any = await fetchAlimentosEquivalentes(
          alimento.idAlimento,
          parseFloat(alimento.quantidade),
          tipoQuantidade
        );

        // Extrair o array "equivalentes" da resposta:
        const alimentosEquivalentes: Equivalente[] = equivalente.equivalentes;

        console.log("Alimentos equivalentes:", alimentosEquivalentes);

        // Passar apenas o array "equivalentes" (do tipo Equivalente[])
        handleAlimentoChange(
          mealIndex,
          alimentoIndex,
          "equivalente",
          alimentosEquivalentes
        );
      } else {
        console.error("Dados incompletos para buscar equivalentes");
      }
    },
    [meals, handleAlimentoChange]
  );

  const handleSaveDiet = async () => {
        console.log(pessoaId);
        console.log("Gerar PDF e salvar dieta:", pessoaId, meals);

        try {
            const pdfResponse = await fetchGerarPdf({ idPessoa: pessoaId, refeicoes: meals });
            console.log("PDF gerado com sucesso:", pdfResponse);

            // Aqui você pode implementar lógica para lidar com o PDF gerado, como abrir ou baixar o arquivo
            const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'nutriswap_report.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
        }
    };

  const handleSavePerson = (person: PersonData) => {
    console.log("Pessoa salva:", person);
    setPessoaId(person.id_pessoa);
  };

  const handleMealNameChange = (mealIndex: number, name: string) => {
    setMeals((prevMeals) =>
      prevMeals.map((meal, mIndex) =>
        mIndex === mealIndex ? { ...meal, nome: name } : meal
      )
    );
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Criar Dieta
      </Typography>
      <Person onSave={handleSavePerson} />
      {meals.map((meal, mealIndex) => (
        <Paper key={mealIndex} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2, paddingLeft: 2 }}>
            Refeição {mealIndex + 1}
          </Typography>
          <TextField
            label="Nome da Refeição"
            variant="outlined"
            multiline
            fullWidth
            value={meal.nome || ""}
            onChange={(e) => handleMealNameChange(mealIndex, e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Grid container spacing={2}>
            {meal.alimentos.map((alimento, alimentoIndex) => (
              <Grid item xs={12} key={alimentoIndex}>
                <AlimentoForm
                  alimento={alimento}
                  mealIndex={mealIndex}
                  alimentoIndex={alimentoIndex}
                  tiposAlimento={tiposAlimento}
                  onTipoChange={handleTipoChange}
                  onIdAlimentoChange={handleIdAlimentoChange}
                  onQuantidadeChange={handleQuantidadeChange}
                  onTipoQuantidadeChange={handleTipoQuantidadeChange}
                  onRemoveAlimento={removeAlimento}
                  onBuscarEquivalentes={() =>
                    buscarAlimentosEquivalentes(mealIndex, alimentoIndex)
                  }
                />
              </Grid>
            ))}
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Button onClick={() => addAlimento(mealIndex)} variant="outlined">
              Adicionar Alimento
            </Button>
            <Button
              onClick={() => removeMeal(mealIndex)}
              variant="outlined"
              color="error"
            >
              Remover Refeição
            </Button>
          </Box>
        </Paper>
      ))}
      <Box
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}
      >
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
