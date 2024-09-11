// src/components/Home/Home.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

import './Home.css';

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <div className="content">
                <Outlet/>
            </div>
        </div>
    );
};

export default Home;
