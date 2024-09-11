// src/components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.css';

const Layout: React.FC = () => {
    return (
        <div className="layout-container">
            <Sidebar />
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
