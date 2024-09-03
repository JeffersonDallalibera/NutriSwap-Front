import React, { useState, useEffect } from 'react';
import './CreateDiet.css';
// Certifique-se de que o caminho para o componente Person está correto
// @ts-ignore
import Person from "../Person";
import {PersonData} from "../Person/Person";

// Interfaces para tipagem
interface Alimento {
    id: number;
    nome: string;
}

interface AlimentoEntry {
    tipo: string;
    nome: string;
    tipoQuantidade: string;
    quantidade: string;
    equivalentes: Alimento[];
}

// Dados estáticos (idealmente, buscar do backend)
const tiposAlimento = [
    { id: 1, nome: 'Proteína' },
    { id: 2, nome: 'Carboidrato' },
    { id: 3, nome: 'Bebida' },
    { id: 4, nome: 'Fruta' },
];

// Função auxiliar para criar uma nova refeição
const createNewMeal = () => ({
    alimentos: [{ tipo: '', nome: '', tipoQuantidade: '', quantidade: '', equivalentes: [] }],
});

const CreateDiet: React.FC = () => {
    const [meals, setMeals] = useState<{ alimentos: AlimentoEntry[] }[]>([createNewMeal()]);
    const [alimentos, setAlimentos] = useState<Alimento[]>([]);
    const [selectedTipo, setSelectedTipo] = useState<string>('');

    // Buscar alimentos do backend quando o tipo for selecionado
    useEffect(() => {
        const fetchAlimentos = async () => {
            if (!selectedTipo) return;

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

    // Função genérica para atualizar campos de um alimento
    const handleAlimentoChange = (
        mealIndex: number,
        alimentoIndex: number,
        field: keyof AlimentoEntry,
        value: string | Alimento[]
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

    // Adicionar um novo alimento a uma refeição
    const addAlimento = (mealIndex: number) => {
        setMeals((prevMeals) =>
            prevMeals.map((meal, index) =>
                index === mealIndex
                    ? { ...meal, alimentos: [...meal.alimentos, { tipo: '', nome: '', tipoQuantidade: '', quantidade: '', equivalentes: [] }] }
                    : meal
            )
        );
    };

    // Adicionar uma nova refeição
    const addMeal = () => setMeals((prevMeals) => [...prevMeals, createNewMeal()]);

    // Buscar alimentos equivalentes
    const buscarAlimentosEquivalentes = async (mealIndex: number, alimentoIndex: number, alimentoNome: string) => {
        try {
            const response = await fetch(`/api/alimentos/equivalentes?nome=${alimentoNome}`);
            const data = await response.json();
            handleAlimentoChange(mealIndex, alimentoIndex, 'equivalentes', data);
        } catch (error) {
            console.error('Erro ao buscar alimentos equivalentes:', error);
        }
    };

    // Salvar a dieta (implementação simulada)
    const handleSaveDiet = () => {
        console.log('Gerar PDF e salvar dieta:', meals);
    };
    // Dentro do seu componente CreateDiet:
    const handleSavePerson = (person: PersonData) => {
        console.log('Pessoa salva:', person);
        // Aqui você pode adicionar a pessoa a uma lista ou fazer outra lógica
    };


    return (
        <div className="create-diet-container">
            <h2>Criar Dieta</h2>

            {/* Componente para adicionar pessoas à dieta */}
            <Person onSave={handleSavePerson} />

            {meals.map((meal, mealIndex) => (
                <div key={mealIndex} className="meal">
                    <h3>Refeição {mealIndex + 1}</h3>
                    {meal.alimentos.map((alimento, alimentoIndex) => (
                        <div key={alimentoIndex} className="form-group">
                            {/* Seleção do tipo de alimento */}
                            <label htmlFor={`tipo-${mealIndex}-${alimentoIndex}`}>Tipo de alimento</label>
                            <select
                                id={`tipo-${mealIndex}-${alimentoIndex}`}
                                value={alimento.tipo}
                                onChange={(e) => {
                                    const tipo = e.target.value;
                                    handleAlimentoChange(mealIndex, alimentoIndex, 'tipo', tipo);
                                    setSelectedTipo(tipo);
                                }}
                            >
                                <option value="">Selecione um tipo</option>
                                {tiposAlimento.map((tipo) => (
                                    <option key={tipo.id} value={tipo.nome}>
                                        {tipo.nome}
                                    </option>
                                ))}
                            </select>

                            {/* Seleção do nome do alimento */}
                            <label htmlFor={`nome-${mealIndex}-${alimentoIndex}`}>Selecione um alimento</label>
                            <select
                                id={`nome-${mealIndex}-${alimentoIndex}`}
                                value={alimento.nome}
                                onChange={(e) => handleAlimentoChange(mealIndex, alimentoIndex, 'nome', e.target.value)}
                            >
                                <option value="">Selecione um alimento</option>
                                {alimentos.map((alimento) => (
                                    <option key={alimento.id} value={alimento.nome}>
                                        {alimento.nome}
                                    </option>
                                ))}
                            </select>
                            {/* Botão para buscar alimentos equivalentes */}


                            {/* Seleção do tipo de quantidade */}
                            <div className="tipo-container">
                                <label htmlFor={`tipoQuantidade-${mealIndex}-${alimentoIndex}`}>Tipo de
                                    Quantidade</label>
                                <select
                                    id={`tipoQuantidade-${mealIndex}-${alimentoIndex}`}
                                    value={alimento.tipoQuantidade}
                                    onChange={(e) =>
                                        handleAlimentoChange(mealIndex, alimentoIndex, 'tipoQuantidade', e.target.value)
                                    }
                                >
                                    <option value="">Selecione o tipo</option>
                                    <option value="Porção">Porção</option>
                                    <option value="Quantidade">Quantidade</option>
                                </select>
                                {alimento.tipoQuantidade === 'Porção' && (
                                    <div className="porcao-aviso">Considere 100 gramas para cada unidade de porção</div>
                                )}
                                <input
                                    type="text"
                                    placeholder="Quantidade"
                                    value={alimento.quantidade}
                                    onChange={(e) =>
                                        handleAlimentoChange(mealIndex, alimentoIndex, 'quantidade', e.target.value)
                                    }
                                />
                                <button
                                    className="search-button"
                                    onClick={() => buscarAlimentosEquivalentes(mealIndex, alimentoIndex, alimento.nome)}
                                >
                                    Buscar Equivalentes
                                </button>

                                {/* Exibição dos alimentos equivalentes */}
                                <div className="equivalentes-container">
                                    {alimento.equivalentes.map((equivalente, index) => (
                                        <div key={index} className="card">
                                            <h4>{equivalente.nome}</h4>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Botões para adicionar alimentos e refeições */}
                    <div className="button-group">
                        <button onClick={() => addAlimento(mealIndex)}>Adicionar mais alimentos</button>
                        <button onClick={addMeal}>Adicionar Refeição</button>
                    </div>
                </div>
            ))}
            <button onClick={handleSaveDiet}>Finalizar Dieta</button>
        </div>
    );
};

export default CreateDiet;
