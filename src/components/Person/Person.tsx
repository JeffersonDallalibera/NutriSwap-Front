import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, FormControlLabel, Checkbox } from '@mui/material';
import '../styles/styles.css';

export interface PersonData {
    id_pessoa?: number;
    nome: string;
    idade: number;
    peso: number;
    altura: number;
    email: string;
    telefone: string;
    imc_pessoa?: number; // Adicionado para manter consistência com o cálculo original
    restricoes: {
        vegetariano: boolean;
        intoleranteLactose: boolean;
        alergiaNozes: boolean;
        alergiaGluten: boolean;
        alergiaMariscos: boolean;
    };
}

interface PersonProps {
    onSave: (person: PersonData) => void;
}

const getIMCLevel = (imc: number) => {
    if (imc < 18.5) {
        return 'Adulto com baixo peso';
    } else if (imc >= 18.5 && imc < 25.0) {
        return 'Adulto com peso adequado (eutrófico)';
    } else if (imc >= 25.0 && imc < 30.0) {
        return 'Sobrepeso';
    } else if (imc >= 30.0 && imc < 35.0) {
        return 'Obesidade grau I';
    } else if (imc >= 35.0 && imc < 40.0) {
        return 'Obesidade grau II';
    } else {
        return 'Obesidade grau III';
    }
};

const Person: React.FC<PersonProps> = ({ onSave }) => {
    const [person, setPerson] = useState<PersonData>({
        id_pessoa: undefined,
        nome: '',
        idade: 0,
        peso: 0,
        altura: 0,
        email: '',
        telefone: '',
        restricoes: {
            vegetariano: false,
            intoleranteLactose: false,
            alergiaNozes: false,
            alergiaGluten: false,
            alergiaMariscos: false,
        },
    });

    const [savedPerson, setSavedPerson] = useState<PersonData | null>(null);

    function replaceCommaWithDot(value: string): string {
        return value.replace(',', '.');
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedValue = name === 'peso' || name === 'altura' ? replaceCommaWithDot(value) : value;
        setPerson({ ...person, [name]: updatedValue });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setPerson(prevState => ({
            ...prevState,
            restricoes: {
                ...prevState.restricoes,
                [name]: checked,
            },
        }));
    };

    const handleSave = async () => {
        const alturaMetros = person.altura / 100;
        const imcValue = person.peso / (alturaMetros * alturaMetros);
        const roundedImc = Math.round(imcValue * 100) / 100;

        const personData = {
            ...person,
            imc_pessoa: roundedImc,
        };

        try {
            const apiUrl = process.env.REACT_APP_API_URL;

            const response = await fetch(apiUrl + '/api/pessoa/adicionar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(personData),
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar os dados');
            }

            const data = await response.json();
            const savedPersonData: PersonData = {
                id_pessoa: data.id_pessoa,
                nome: data.nome_pessoa,
                idade: data.idade_pessoa,
                peso: data.peso_pessoa,
                altura: data.altura_pessoa,
                email: data.email_pessoa,
                telefone: data.telefone_pessoa,
                imc_pessoa: data.imc_pessoa,
                restricoes: {
                    vegetariano: data.vegetariano,
                    intoleranteLactose: data.intolerante_lactose,
                    alergiaNozes: data.alergia_nozes,
                    alergiaGluten: data.alergia_gluten,
                    alergiaMariscos: data.alergia_mariscos,
                },
            };
            setSavedPerson(savedPersonData);
            onSave(savedPersonData);

            // Limpar formulário
            setPerson({
                id_pessoa: undefined,
                nome: '',
                idade: 0,
                peso: 0,
                altura: 0,
                email: '',
                telefone: '',
                restricoes: {
                    vegetariano: false,
                    intoleranteLactose: false,
                    alergiaNozes: false,
                    alergiaGluten: false,
                    alergiaMariscos: false,
                },
            });
        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Adicionar Pessoa
            </Typography>
            <Paper sx={{ padding: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Nome"
                        name="nome"
                        value={person.nome}
                        onChange={handleChange}
                        placeholder="Nome"
                        size="small"
                        multiline
                    />
                    <TextField
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
                        size="small"
                        multiline
                    />
                    <TextField
                        label="Altura (cm)"
                        name="altura"
                        type="number"
                        value={person.altura}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        multiline
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={person.email}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        label="Telefone"
                        name="telefone"
                        value={person.telefone}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                        multiline
                    />
                </Box>
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="h6">Restrições Alimentares</Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={person.restricoes.vegetariano}
                                onChange={handleCheckboxChange}
                                name="vegetariano"
                            />
                        }
                        label="Vegetariano"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={person.restricoes.intoleranteLactose}
                                onChange={handleCheckboxChange}
                                name="intoleranteLactose"
                            />
                        }
                        label="Intolerante à Lactose"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={person.restricoes.alergiaNozes}
                                onChange={handleCheckboxChange}
                                name="alergiaNozes"
                            />
                        }
                        label="Alergia a Nozes"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={person.restricoes.alergiaGluten}
                                onChange={handleCheckboxChange}
                                name="alergiaGluten"
                            />
                        }
                        label="Alergia ao Glúten"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={person.restricoes.alergiaMariscos}
                                onChange={handleCheckboxChange}
                                name="alergiaMariscos"
                            />
                        }
                        label="Alergia a Mariscos"
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
                        <li><strong>ID:</strong> {savedPerson.id_pessoa}</li>
                        <li><strong>Nome:</strong> {savedPerson.nome}</li>
                        <li><strong>Idade:</strong> {savedPerson.idade}</li>
                        <li><strong>Peso:</strong> {savedPerson.peso} kg</li>
                        <li><strong>Altura:</strong> {savedPerson.altura} cm</li>
                        <li><strong>Email:</strong> {savedPerson.email}</li>
                        <li><strong>Telefone:</strong> {savedPerson.telefone}</li>
                        <li><strong>IMC:</strong> {parseFloat(String(savedPerson.imc_pessoa!)).toFixed(2)} ({getIMCLevel(parseFloat(String(savedPerson.imc_pessoa!)))})</li>
                        <li><strong>Vegetariano:</strong> {savedPerson.restricoes.vegetariano ? 'Sim' : 'Não'}</li>
                        <li><strong>Intolerante à Lactose:</strong> {savedPerson.restricoes.intoleranteLactose ? 'Sim' : 'Não'}</li>
                        <li><strong>Alergia a Nozes:</strong> {savedPerson.restricoes.alergiaNozes ? 'Sim' : 'Não'}</li>
                        <li><strong>Alergia ao Glúten:</strong> {savedPerson.restricoes.alergiaGluten ? 'Sim' : 'Não'}</li>
                        <li><strong>Alergia a Mariscos:</strong> {savedPerson.restricoes.alergiaMariscos ? 'Sim' : 'Não'}</li>
                    </ul>
                </Paper>
            )}
        </Box>
    );
};

export default Person;