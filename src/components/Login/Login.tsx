import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Paper, CssBaseline } from '@mui/material';
// @ts-ignore
import { ReactComponent as Logo } from '../../assets/nutriSwap_LOGO_VERDE.svg';
import api from "../../services/api";

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token } = response.data;

            if (token) {
                localStorage.setItem('access_token', token);
                navigate('/home');
            }
            setMessage(response.data.message);
        } catch (error: any) {
            console.error(error);
            setMessage(error.response?.data.error || 'Login failed');
        }
    };

    return (
        <div style={{ backgroundColor: '#00796b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CssBaseline />
            <Paper elevation={6} sx={{
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                borderRadius: 3,
                boxSizing: 'border-box',
                width: '100%',
                maxWidth: 400,
            }}>
                <Box mb={2} display="flex" justifyContent="center">
                    <Logo width={150} />
                </Box>
                <Typography component="h1" variant="h5" sx={{ color: '#00796b', fontWeight: 'bold' }}>
                    Acesse sua conta
                </Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        multiline
                        fullWidth
                        id="username"
                        label="Usuário"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        InputProps={{
                            sx: {
                                backgroundColor: '#e0f2f1',
                                borderRadius: '8px',
                                '&:hover': {
                                    borderColor: '#004d40',
                                },
                            }
                        }}
                        InputLabelProps={{
                            sx: {
                                color: '#004d40',
                            }
                        }}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Senha"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            sx: {
                                backgroundColor: '#e0f2f1',
                                borderRadius: '8px',
                                '&:hover': {
                                    borderColor: '#004d40',
                                },
                            }
                        }}
                        InputLabelProps={{
                            sx: {
                                color: '#004d40',
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="success"
                        sx={{ mt: 3, mb: 2, borderRadius: '8px', backgroundColor: '#00796b' }}
                    >
                        Entrar
                    </Button>
                    {message && (
                        <Typography color="error" variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                            {message}
                        </Typography>
                    )}
                </Box>
            </Paper>
        </div>
    );
};

export default Login;
