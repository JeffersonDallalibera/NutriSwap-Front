// ViewDiets.tsx
import React, { useState, useEffect } from 'react';
import './ViewDiet.css';

interface Diet {
    id: number;
    name: string;
    description: string;
    createdAt: string;
}

const ViewDiets: React.FC = () => {
    const [diets, setDiets] = useState<Diet[]>([]);

    useEffect(() => {
        // Simulação de busca de dados
        const fetchDiets = async () => {
            // Mock data
            const mockDiets: Diet[] = [
                { id: 1, name: 'Dieta de Emagrecimento', description: 'Uma dieta balanceada para emagrecimento.', createdAt: '2024-08-01' },
                { id: 2, name: 'Dieta para Ganho de Massa', description: 'Dieta rica em proteínas para ganho de massa muscular.', createdAt: '2024-08-10' },
            ];
            setDiets(mockDiets);
        };

        fetchDiets();
    }, []);

    return (
        <div className="container">
            <div className="main-content">
                <h1>Visualizar Dietas Criadas</h1>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Data de Criação</th>
                        <th>Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {diets.map(diet => (
                        <tr key={diet.id}>
                            <td>{diet.id}</td>
                            <td>{diet.name}</td>
                            <td>{diet.description}</td>
                            <td>{diet.createdAt}</td>
                            <td>
                                <button className="edit-button">Editar</button>
                                <button className="delete-button">Excluir</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewDiets;
