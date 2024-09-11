import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper } from '@mui/material';
import '../styles/styles.css'

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

    const [savedPerson, setSavedPerson] = useState<PersonData | null>(null);
    const [imc, setImc] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPerson({ ...person, [name]: value });
    };

    const handleSave = () => {
        setSavedPerson(person);
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

    const calculateIMC = () => {
        const alturaMetros = person.altura / 100;
        const imcValue = person.peso / (alturaMetros * alturaMetros);
        setImc(imcValue);
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Adicionar Pessoa
            </Typography>
            <Paper sx={{ padding: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                    <TextField
                        id="outlined-textarea"
                        label="Nome"
                        name="nome"
                        value={person.nome}
                        onChange={handleChange}
                        placeholder="Nome"
                        size="small"
                        multiline
                    />
                    <TextField
                        id="outlined-textarea"
                        label="Idade"
                        name="idade"
                        type="number"
                        value={person.idade}
                        onChange={handleChange}
                        size="small"
                        multiline
                    />
                    <TextField
                        label="Peso (kg)"
                        name="peso"
                        type="number"
                        value={person.peso}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        size="small"
                    />
                    <TextField
                        label="Altura (cm)"
                        name="altura"
                        type="number"
                        value={person.altura}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        size="small"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={person.email}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        size="small"
                    />
                    <TextField
                        label="Telefone"
                        name="telefone"
                        value={person.telefone}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        size="small"
                    />
                </Box>
                <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Salvar Pessoa
                    </Button>
                </Box>
            </Paper>
            {savedPerson && (
                <Paper sx={{ padding: 2, marginTop: 2 }}>
                    <Typography variant="h6">Dados da Pessoa Adicionada:</Typography>
                    <ul>
                        <li><strong>Nome:</strong> {savedPerson.nome}</li>
                        <li><strong>Idade:</strong> {savedPerson.idade}</li>
                        <li><strong>Peso:</strong> {savedPerson.peso} kg</li>
                        <li><strong>Altura:</strong> {savedPerson.altura} cm</li>
                        <li><strong>Email:</strong> {savedPerson.email}</li>
                        <li><strong>Telefone:</strong> {savedPerson.telefone}</li>
                        {imc !== null && (
                            <li><strong>IMC:</strong> {imc.toFixed(2)}</li>
                        )}
                    </ul>
                    <Button variant="contained" color="secondary" onClick={calculateIMC} sx={{ minWidth: '120px' }}>
                        Calcular IMC
                    </Button>
                </Paper>
            )}
        </Box>
    );
};

export default Person;
