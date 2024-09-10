// src/components/PrivateRoute.tsx
import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
    const token = localStorage.getItem('access_token'); // Verifique se o token JWT está presente no localStorage

    if (!token) {
        //return <Navigate to="/" />;
    }

    return <Outlet />; // Renderiza as rotas filhas se o usuário estiver autenticado
};

export default PrivateRoute;
