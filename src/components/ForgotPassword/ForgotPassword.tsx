import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica para enviar o email de redefinição de senha
        console.log('Email enviado para:', email);
    };

    return (
        <div className="forgot-password-container">
            <h1>Redefinição de Senha</h1>
            <form onSubmit={handleSubmit}>
                <div className="forgot-password-field">
                    <label htmlFor="email">Digite seu e-mail:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Enviar Link de Redefinição</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
