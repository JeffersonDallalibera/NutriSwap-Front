import React, { useState, useEffect } from 'react';
import './CreateDiet.css';

interface Alimento {
    id: number;
    nome: string;
}

const createNewMeal = () => ({
    bebida: '',
    carboidrato1: '',
    carboidrato2: '',
    proteina1: '',
    proteina2: '',
    fruta1: ''
});

const CreateDiet: React.FC = () => {
    const [meals, setMeals] = useState<any[]>([createNewMeal()]);
    const [alimentos, setAlimentos] = useState<Alimento[]>([]);
    const [selectedAlimento, setSelectedAlimento] = useState<string>('');

    useEffect(() => {
        const fetchAlimentos = async () => {
            try {
                const response = await fetch('/api/alimentos');
                const data = await response.json();
                setAlimentos(data);
            } catch (error) {
                console.error('Error fetching alimentos:', error);
            }
        };

        fetchAlimentos();
    }, []);

    const addMeal = () => setMeals([...meals, createNewMeal()]);

    const handleSaveDiet = () => {
        console.log('Gerar PDF e salvar dieta');
    };

    return (
        <div className="create-diet-container">
            {meals.map((meal, index) => (
                <div key={index} className="meal">
                    <h3>Refeição {index + 1}</h3>
                    {['bebida', 'carboidrato1', 'carboidrato2', 'proteina1', 'proteina2', 'fruta1'].map((field) => (
                        <div key={field} className="form-group">
                            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <select
                                value={meal[field as keyof typeof meal]}
                                onChange={(e) => {
                                    const updatedMeal = { ...meal, [field]: e.target.value };
                                    setMeals(meals.map((m, i) => (i === index ? updatedMeal : m)));
                                }}
                            >
                                <option value="">Selecione um alimento</option>
                                {alimentos.map(alimento => (
                                    <option key={alimento.id} value={alimento.nome}>
                                        {alimento.nome}
                                    </option>
                                ))}
                            </select>
                            <button className="search-button">Buscar alimento equivalente</button>

                        </div>
                    ))}
                    <div className="button-group">
                        <button onClick={() => { /* lógica para adicionar mais alimentos */ }}>Adicionar mais alimentos</button>
                        <button onClick={addMeal}>Adicionar Refeição</button>
                    </div>
                </div>
            ))}
            <button onClick={handleSaveDiet}>Finalizar Dieta</button>
        </div>
    );
};

export default CreateDiet;
