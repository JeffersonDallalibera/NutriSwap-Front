import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
// @ts-ignore
import logo from '../../assets/nutriSwap_LOGO_VERDE.svg';

const Sidebar: React.FC = () => {
    const location = useLocation();

    const handleLogout = () => {
        // Implementar a lógica de logout, como limpar cookies ou redirecionar para uma página de login
        console.log('Logout');
    };

    return (
        <div className="sidebar">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <nav>
                <ul>
                    <li>
                        <Link to="/home" className={location.pathname === '/home' ? 'active' : ''}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/home/create-diet"
                              className={location.pathname === '/home/create-diet' ? 'active' : ''}>
                            Criar Dieta
                        </Link>
                    </li>
                    <li>
                        <Link to="/home/view-diet"
                              className={location.pathname === '/home/view-diet' ? 'active' : ''}>
                            Visualizar Dietas
                        </Link>
                    </li>
                    <li>
                        <Link to="/home/add-food" className={location.pathname === '/home/add-food' ? 'active' : ''}>
                            Adicionar Alimento
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className="sidebar-logout">
                <button className="sidebar-logout-button" onClick={handleLogout}>
                    Sair
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
