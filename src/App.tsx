// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import CreateDiet from './components/CreateDiet';
import AddFood from './components/AddFood';
import PrivateRoute from './components/PrivateRoute';
import ViewDiet from "./components/ViewDiets";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/home" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="create-diet" element={<CreateDiet />} />
                        <Route path="add-food" element={<AddFood />} />
                        <Route path="view-diet" element={<ViewDiet />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
