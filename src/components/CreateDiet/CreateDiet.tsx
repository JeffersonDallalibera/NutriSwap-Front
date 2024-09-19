import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Person from "../Person";
import { PersonData } from "../Person/Person";
import "../styles/styles.css";

interface Alimento {
  idAlimento: number;
  nome: string;
  descricao: string;
}

interface AlimentoEntry {
  tipo: number;
  idAlimento: number;
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
  alimentos: [
    {
      tipo: 0,
      idAlimento: 0,
      nome: "",
      tipoQuantidade: "",
      quantidade: "",
      equivalentes: [],
    },
  ],
});

function excluirAlimento(mealIndex: number, alimentoIndex: number) {
  // Implemente a lógica de exclusão aqui
}

const AlimentoSelect: React.FC<{
  alimentos: Alimento[];
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
}> = ({ alimentos, value, onChange }) => {
  const getMenuItemLabel = (alimento: Alimento) => {
    if (alimento.descricao && alimento.descricao.trim() !== "") {
      return `${alimento.nome} - ${alimento.descricao}`;
    }
    return alimento.nome;
  };

  return (
    <FormControl fullWidth sx={{ marginBottom: 2 }}>
      <InputLabel id="food-select-label">Selecione um alimento</InputLabel>
      <Select
        labelId="food-select-label"
        id="food-select"
        value={value}
        label="Selecione um alimento"
        onChange={onChange}
      >
        <MenuItem value="">Selecione um alimento</MenuItem>
        {alimentos.map((alimento) => (
          <MenuItem
            key={alimento.idAlimento}
            value={getMenuItemLabel(alimento)}
          >
            {getMenuItemLabel(alimento)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const CreateDiet: React.FC = () => {
  const [meals, setMeals] = useState<{ alimentos: AlimentoEntry[] }[]>([
    createNewMeal(),
  ]);
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [tiposAlimento, setTiposAlimento] = useState<TipoAlimento[]>([]);
  const [selectedTipo, setSelectedTipo] = useState<number | "">(0);

  useEffect(() => {
    const fetchTiposAlimento = async () => {
      try {
        const response = await fetch("/api/tipos_alimento");
        const data = await response.json();
        setTiposAlimento(data);
      } catch (error) {
        console.error("Erro ao buscar tipos de alimentos:", error);
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
        console.log(data);
        setAlimentos(data);
      } catch (error) {
        console.error("Erro ao buscar alimentos:", error);
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
            aIndex === alimentoIndex
              ? { ...alimento, [field]: value }
              : alimento
          ),
        };
      })
    );
  };

  const addAlimento = (mealIndex: number) => {
    setMeals((prevMeals) =>
      prevMeals.map((meal, index) =>
        index === mealIndex
          ? {
              ...meal,
              alimentos: [
                ...meal.alimentos,
                {
                  tipo: 0,
                  idAlimento: 0,
                  nome: "",
                  tipoQuantidade: "",
                  quantidade: "",
                  equivalentes: [],
                },
              ],
            }
          : meal
      )
    );
  };

  const addMeal = () =>
    setMeals((prevMeals) => [...prevMeals, createNewMeal()]);

  const buscarAlimentosEquivalentes = async (
    mealIndex: number,
    alimentoIndex: number,
    alimento: AlimentoEntry
  ) => {
    console.log(alimento);
    try {
      //const response = await fetch(`/api/alimentos/equivalentes?id=${alimento.id}`);
      //const data = await response.json();
      //handleAlimentoChange(mealIndex, alimentoIndex, 'equivalentes', data);
    } catch (error) {
      console.error("Erro ao buscar alimentos equivalentes:", error);
    }
  };

  const handleSaveDiet = () => {
    console.log("Gerar PDF e salvar dieta:", meals);
  };

  const handleSavePerson = (person: PersonData) => {
    console.log("Pessoa salva:", person);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Criar Dieta
      </Typography>
      <Person onSave={handleSavePerson} />
      {meals.map((meal, mealIndex) => (
        <Paper key={mealIndex} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography
            variant="h6"
            sx={{
              marginBottom: 2,
              paddingLeft: 2,
            }}
          >
            Refeição {mealIndex + 1}
          </Typography>
          <Grid container spacing={2}>
            {meal.alimentos.map((alimento, alimentoIndex) => (
              <Grid item xs={12} key={alimentoIndex}>
                <Box sx={{ marginBottom: 2 }}>
                  <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="food-type-select-label">
                      Tipo de alimento
                    </InputLabel>
                    <Select
                      labelId="food-type-select-label"
                      id="food-type-select"
                      value={alimento.tipo}
                      label="Tipo de alimento"
                      onChange={(e) => {
                        const tipoValue = e.target.value as string;
                        const tipoId = parseInt(tipoValue, 10);
                        handleAlimentoChange(
                          mealIndex,
                          alimentoIndex,
                          "tipo",
                          tipoId
                        );
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

                  <AlimentoSelect
                    alimentos={alimentos}
                    value={alimento.nome}
                    onChange={(e: SelectChangeEvent<string>) =>
                      handleAlimentoChange(
                        mealIndex,
                        alimentoIndex,
                        "nome",
                        e.target.value
                      )
                    }
                  ></AlimentoSelect>

                  <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel id="quantity-type-select-label">
                      Tipo de Quantidade
                    </InputLabel>
                    <Select
                      labelId="quantity-type-select-label"
                      id="quantity-type-select"
                      value={alimento.tipoQuantidade}
                      label="Tipo de Quantidade"
                      onChange={(e) =>
                        handleAlimentoChange(
                          mealIndex,
                          alimentoIndex,
                          "tipoQuantidade",
                          e.target.value
                        )
                      }
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
                      onChange={(e) =>
                        handleAlimentoChange(
                          mealIndex,
                          alimentoIndex,
                          "quantidade",
                          e.target.value
                        )
                      }
                      sx={{ flexGrow: 1 }}
                      multiline
                      size="small"
                    />

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        buscarAlimentosEquivalentes(
                          mealIndex,
                          alimentoIndex,
                          alimento
                        )
                      }
                      sx={{
                        height: "32px",
                        minWidth: "30px",
                        fontSize: "0.75rem",
                        px: 1,
                      }}
                    >
                      Buscar Equivalentes
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => excluirAlimento(mealIndex, alimentoIndex)}
                      sx={{
                        height: "32px",
                        minWidth: "30px",
                        fontSize: "0.75rem",
                        px: 1,
                      }}
                    >
                      Excluir
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexWrap: "wrap",
                      marginTop: 2,
                    }}
                  >
                    {alimento.equivalentes.map((equivalente, index) => (
                      <Paper
                        key={index}
                        sx={{
                          padding: 1,
                          boxShadow: 1,
                          textAlign: "center",
                          maxWidth: 150,
                        }}
                      >
                        <Typography variant="body2">
                          {equivalente.nome}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              </Grid>
            ))}
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: "column",
                alignItems: "flex-start",
                marginTop: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => addAlimento(mealIndex)}
                sx={{ minWidth: "200px" }}
              >
                Adicionar Alimento
              </Button>
              {meals.length > 1 && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() =>
                    setMeals((prev) => prev.filter((_, i) => i !== mealIndex))
                  }
                  sx={{ minWidth: "200px" }}
                >
                  Remover Refeição
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={addMeal}
          sx={{ flexGrow: 1 }}
        >
          Adicionar Refeição
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSaveDiet}
          sx={{ flexGrow: 1 }}
        >
          Salvar Dieta
        </Button>
      </Box>
    </Box>
  );
};

export default CreateDiet;
