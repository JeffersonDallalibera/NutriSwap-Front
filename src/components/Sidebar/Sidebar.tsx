import React, { useState } from 'react';
import { Box, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { Link, useLocation } from 'react-router-dom';
// @ts-ignore
import { ReactComponent as Logo } from '../../assets/nutriSwap_LOGO_VERDE.svg';

const Sidebar: React.FC = () => {
    const [open, setOpen] = useState(true);
    const location = useLocation();

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const menuItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/home' },
        { text: 'Criar Dieta', icon: <LocalDiningIcon />, path: '/home/create-diet' },
        { text: 'Visualizar Dietas', icon: <VisibilityIcon />, path: '/home/view-diet' },
        { text: 'Adicionar Alimento', icon: <AddCircleIcon />, path: '/home/add-food' }
    ];

    return (
        <Box
            sx={{
                width: open ? 240 : 80,
                transition: 'width 0.3s',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                backgroundColor: '#f5f5f5',
                borderRight: '1px solid #ddd'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, justifyContent: open ? 'space-between' : 'center' }}>
                {open && (
                    <Box sx={{ marginLeft: 2 }}>
                        <Logo width={100} height={40} />
                    </Box>
                )}
                <IconButton onClick={handleDrawerToggle} sx={{ margin: 1 }}>
                    {open ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
            </Box>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        component={Link}
                        to={item.path}
                        selected={location.pathname === item.path}
                        sx={{ padding: 1, paddingLeft: open ? 2 : 1 }}
                    >
                        <ListItemIcon>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.3s' }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );
};

export default Sidebar;
