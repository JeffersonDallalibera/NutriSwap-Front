import React, { useState } from 'react';
import './Person.css';

export interface PersonData {
    nome: string;
    idade: number;
    peso: number;
    altura: number;
    email: string;
    telefone: string;
}

interface PersonProps {
    onSave: (person: PersonData) => void;
}

const Person: React.FC<PersonProps> = ({ onSave }) => {
    const [person, setPerson] = useState<PersonData>({
        nome: '',
        idade: 0,
        peso: 0,
        altura: 0,
        email: '',
        telefone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPerson({ ...person, [name]: value });
    };

    const [savedPerson, setSavedPerson] = useState<PersonData | null>(null);

    const handleSave = () => {
            setSavedPerson(person)
            onSave(person);
            setPerson({
                nome: '',
                idade: 0,
                peso: 0,
                altura: 0,
                email: '',
                telefone: ''
            });

    };



    return (
        <div className="person-container">
            <h2>Adicionar Pessoa</h2>
            <div className="person-form">
                <label>Nome:</label>
                <input
                    type="text"
                    name="nome"
                    value={person.nome}
                    onChange={handleChange}
                />
                <label>Idade:</label>
                <input
                    type="number"
                    name="idade"
                    value={person.idade}
                    onChange={handleChange}
                />
                <label>Peso (kg):</label>
                <input
                    type="number"
                    name="peso"
                    value={person.peso}
                    onChange={handleChange}
                />
                <label>Altura (cm):</label>
                <input
                    type="number"
                    name="altura"
                    value={person.altura}
                    onChange={handleChange}
                />
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={person.email}
                    onChange={handleChange}
                />
                <label>Telefone:</label>
                <input
                    type="text"
                    name="telefone"
                    value={person.telefone}
                    onChange={handleChange}
                />
            </div>
            <button onClick={handleSave}>Salvar Pessoa</button>

            {savedPerson && (
                <div className="person-list">
                    <h3>Dados da Pessoa Adicionada:</h3>
                    <ul>
                        <li><strong>Nome:</strong> {savedPerson.nome}</li>
                        <li><strong>Idade:</strong> {savedPerson.idade}</li>
                        <li><strong>Peso:</strong> {savedPerson.peso} kg</li>
                        <li><strong>Altura:</strong> {savedPerson.altura} cm</li>
                        <li><strong>Email:</strong> {savedPerson.email}</li>
                        <li><strong>Telefone:</strong> {savedPerson.telefone}</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Person;
