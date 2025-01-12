    import React from 'react';
    import styled from 'styled-components';
    import { 
    Coffee, 
    UtensilsCrossed, 
    Pizza, 
    CakeSlice, 
    Settings, 
    LogOut 
    } from 'lucide-react';

    const DashboardContainer = styled.div`
    min-height: 100vh;
    background: linear-gradient(to bottom right, #fff3e0, #ffebee);
    `;

    const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    const ServerName = styled.h1`
    font-size: 1.1rem;
    font-weight: bold;
    color: #c62828;
    `;

    const ButtonGroup = styled.div`
    display: flex;
    gap: 0.5rem;
    `;

    const IconButton = styled.button`
    padding: 0.4rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    background-color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: background 0.2s;

    &:hover {
        background-color: #f5f5f5;
    }
    `;

    const LogoutButton = styled(IconButton)`
    background: #c62828;
    color: white;
    border: none;
    padding: 0.4rem 0.8rem;
    gap: 0.4rem;
    font-size: 0.9rem;

    &:hover {
        background: #b71c1c;
    }
    `;

    const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
    padding: 1rem;
    max-width: 600px;
    margin: 0 auto;
    `;

    const CategoryCard = styled.div`
    background-color: white;
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateY(0);
    }
    `;

    const CategoryIcon = styled.div`
    color: #c62828;
    margin-bottom: 0.75rem;
    `;

    const CategoryTitle = styled.h2`
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
    `;

    // Le reste du code du composant MenuDashboard reste identique
    const MenuDashboard = ({ onLogout }) => {
    const menuCategories = [
        { title: 'DRINKS', icon: Coffee },
        { title: 'DISHES', icon: UtensilsCrossed },
        { title: 'SPECIAL DISHES', icon: UtensilsCrossed },
        { title: 'ITALIAN', icon: Pizza },
        { title: 'TRADITIONAL TAJIN', icon: UtensilsCrossed },
        { title: 'DESSERT', icon: CakeSlice }
    ];

    return (
        <DashboardContainer>
        <Header>
            <ServerName>Server: ZAKARIA</ServerName>
            <ButtonGroup>
            <IconButton>
                <Settings size={18} />
            </IconButton>
            <LogoutButton onClick={onLogout}>
                <LogOut size={18} />
                Logout
            </LogoutButton>
            </ButtonGroup>
        </Header>

        <GridContainer>
            {menuCategories.map((category) => {
            const Icon = category.icon;
            return (
                <CategoryCard key={category.title}>
                <CategoryIcon>
                    <Icon size={24} />
                </CategoryIcon>
                <CategoryTitle>{category.title}</CategoryTitle>
                </CategoryCard>
            );
            })}
        </GridContainer>
        </DashboardContainer>
    );
    };

    export default MenuDashboard;