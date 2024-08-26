import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate em vez de useHistory
import './Login.css';
// @ts-ignore
import { ReactComponent as Logo } from '../../assets/nutriSwap_LOGO_VERDE.svg';
import api from "../../services/api";

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const navigate = useNavigate(); // Inicializa o hook useNavigate

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', {
                username,
                password
            });
            setMessage(response.data.message);

            if (response.data.redirect_url) {
                navigate(response.data.redirect_url); // Redireciona para a página inicial
            }
        } catch (error: any) {
            setMessage(error.response?.data.error || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <div className="window">
                <div className="logo-container">
                    <Logo className="logo"/>
                </div>
                <div className="form-container">
                    <form onSubmit={handleLogin}>
                        <div className="login-field">
                            <label htmlFor="username">Usuário:</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="login-field">
                            <label htmlFor="password">Senha:</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit">Login</button>
                    </form>
                    <div className="forgot-password">
                        <a href="/forgot-password">Esqueci minha senha</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
