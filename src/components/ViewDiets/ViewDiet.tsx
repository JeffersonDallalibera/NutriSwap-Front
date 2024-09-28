import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Container,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { styled } from '@mui/system';
import { fetchDiets, downloadDiet } from '../../api/dietApi';
import { Diet } from '../../types/dietTypes';

// Removemos o StyledTableContainer e usaremos o TableContainer diretamente
const StyledButton = styled(Button)({
    marginRight: '0.5rem',
});

const ViewDiets: React.FC = () => {
    const [diets, setDiets] = useState<Diet[]>([]);
    const [loading, setLoading] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const loadDiets = async () => {
            try {
                const fetchedDiets = await fetchDiets();
                setDiets(fetchedDiets);

                // Abrir Snackbar se nenhuma dieta for encontrada
                if (fetchedDiets.length === 0) {
                    setSnackbarMessage('Nenhuma dieta encontrada!');
                    setOpenSnackbar(true);
                }
            } catch (error) {
                console.error('Erro ao carregar dietas:', error);
                setSnackbarMessage('Erro ao carregar dietas!');
                setOpenSnackbar(true);
            } finally {
                setLoading(false);
            }
        };

        loadDiets();
    }, []);

    const handleDownload = async (dietId: number) => {
        try {
            await downloadDiet(dietId);
        } catch (error) {
            console.error('Erro ao baixar dieta:', error);
        }
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Visualizar Dietas Criadas
            </Typography>
            <TableContainer component={Paper} sx={{ marginTop: '2rem' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome do Cliente</TableCell>
                            <TableCell>Data de Criação</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {diets.map((diet) => (
                            <TableRow key={diet.id}>
                                <TableCell>{diet.id}</TableCell>
                                <TableCell>{diet.clientName}</TableCell>
                                <TableCell>{new Date(diet.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <StyledButton
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleDownload(diet.id)}
                                    >
                                        Download
                                    </StyledButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Snackbar para exibir a mensagem de aviso quando não há dietas */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" variant="filled" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ViewDiets;
