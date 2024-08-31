import React, { useState } from 'react';
import './AddFood.css';

interface NutritionalInfo {
    proteina: number;
    carboidrato: number;
    lipidio: number;
    fibra: number;
    calorias: number;
    vitaminac: number;
    calcio: number;
    ferro: number;
    sodio: number;
}

const AddFood: React.FC = () => {
    const [food, setFood] = useState({
        nome: '',
        categoria: '',
        descricao: '',
        tipo: ''
    });

    const [nutritionalInfo, setNutritionalInfo] = useState<NutritionalInfo>({
        proteina: 0,
        carboidrato: 0,
        lipidio: 0,
        fibra: 0,
        calorias: 0,
        vitaminac: 0,
        calcio: 0,
        ferro: 0,
        sodio: 0
    });

    const handleFoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFood({ ...food, [name]: value });
    };

    const handleNutritionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNutritionalInfo({ ...nutritionalInfo, [name]: parseFloat(value) });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Food:', food);
        console.log('Nutritional Info:', nutritionalInfo);
        // Handle form submission here
    };

    return (
        <div className="add-food-container">
            <h1>Adicionar Alimento</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid-container">
                    <div className="grid-item">
                        <h2>Informações do Alimento</h2>
                        <label>Nome:</label>
                        <input type="text" name="nome" value={food.nome} onChange={handleFoodChange} />

                        <label>Categoria:</label>
                        <input type="text" name="categoria" value={food.categoria} onChange={handleFoodChange} />

                        <label>Descrição:</label>
                        <input type="text" name="descricao" value={food.descricao} onChange={handleFoodChange} />

                        <label>Tipo:</label>
                        <input type="text" name="tipo" value={food.tipo} onChange={handleFoodChange} />
                    </div>

                    <div className="grid-item">
                        <h2>Informação Nutricional</h2>
                        <label>Proteína (g):</label>
                        <input type="number" name="proteina" value={nutritionalInfo.proteina} onChange={handleNutritionalChange} />

                        <label>Carboidrato (g):</label>
                        <input type="number" name="carboidrato" value={nutritionalInfo.carboidrato} onChange={handleNutritionalChange} />

                        <label>Lipídio (g):</label>
                        <input type="number" name="lipidio" value={nutritionalInfo.lipidio} onChange={handleNutritionalChange} />

                        <label>Fibra (g):</label>
                        <input type="number" name="fibra" value={nutritionalInfo.fibra} onChange={handleNutritionalChange} />

                        <label>Calorias (kcal):</label>
                        <input type="number" name="calorias" value={nutritionalInfo.calorias} onChange={handleNutritionalChange} />

                        <label>Vitamina C (mg):</label>
                        <input type="number" name="vitaminac" value={nutritionalInfo.vitaminac} onChange={handleNutritionalChange} />

                        <label>Cálcio (mg):</label>
                        <input type="number" name="calcio" value={nutritionalInfo.calcio} onChange={handleNutritionalChange} />

                        <label>Ferro (mg):</label>
                        <input type="number" name="ferro" value={nutritionalInfo.ferro} onChange={handleNutritionalChange} />

                        <label>Sódio (mg):</label>
                        <input type="number" name="sodio" value={nutritionalInfo.sodio} onChange={handleNutritionalChange} />
                    </div>
                </div>
                <button type="submit">Adicionar Alimento</button>
            </form>
        </div>
    );
};

export default AddFood;
