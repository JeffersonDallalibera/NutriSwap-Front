import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Link, Paper } from '@mui/material';
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
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box mb={2}>
                    <Logo width={200} />
                </Box>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
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
                                borderRadius: '4px',
                                backgroundColor: '#f9f9f9',
                                '&:hover': {
                                    borderColor: '#00796b',
                                },
                            }
                        }}
                        InputLabelProps={{
                            sx: {
                                color: '#333',
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
                                borderRadius: '4px',
                                backgroundColor: '#f9f9f9',
                                '&:hover': {
                                    borderColor: '#00796b',
                                },
                            }
                        }}
                        InputLabelProps={{
                            sx: {
                                color: '#333',
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2, mb: 2 }}
                    >
                        Login
                    </Button>
                    <Link href="/forgot-password" variant="body2" sx={{ display: 'block', textAlign: 'right' }}>
                        Esqueci minha senha
                    </Link>
                    {message && (
                        <Typography color="error" variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                            {message}
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
