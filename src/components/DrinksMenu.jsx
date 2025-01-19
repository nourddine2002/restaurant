    // DrinksMenu.jsx
    import React from 'react';
    import styled from 'styled-components';
    import { ArrowLeft } from 'lucide-react';

    const PageContainer = styled.div`
    min-height: 100vh;
    background: linear-gradient(to bottom right, #fff3e0, #ffebee);
    `;

    const Header = styled.header`
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    background: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    const BackButton = styled.button`
    padding: 0.4rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    background-color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-right: 1rem;
    
    &:hover {
        background-color: #f5f5f5;
    }
    `;

    const Title = styled.h1`
    font-size: 1.1rem;
    font-weight: bold;
    color: #c62828;
    `;

    const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
    padding: 1rem;
    max-width: 600px;
    margin: 0 auto;
    `;

    const DrinkCard = styled.div`
    background-color: #e8f5e9;
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

    const DrinkName = styled.h2`
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    color: #333;
    margin-bottom: 0.5rem;
    `;

    const Price = styled.p`
    margin: 0;
    font-size: 0.9rem;
    color: #666;
    `;

    const BottomBar = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background: white;
    box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
    `;

    const ActionButton = styled.button`
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
    
    &.affiche {
        background-color: #f5f5f5;
        color: #333;
    }
    
    &.send {
        background-color: #c62828;
        color: white;
        
        &:hover {
        background-color: #b71c1c;
        }
    }
    `;

    const DrinksMenu = ({ onBack }) => {
    const drinks = [
        { name: 'Cola', price: '30DH' },
        { name: 'Hawai', price: '30DH' },
        { name: 'Poms', price: '30DH' },
        { name: 'Redbull', price: '30DH' },
        { name: 'Oasis', price: '30DH' },
        { name: 'Oualmas', price: '30DH' },
        { name: 'Sprit', price: '30DH' },
        { name: 'Sprit Mojito', price: '30DH' }
    ];

    return (
        <PageContainer>
        <Header>
            <BackButton onClick={onBack}>
            <ArrowLeft size={18} />
            </BackButton>
            <Title>DRINKS</Title>
        </Header>

        <GridContainer>
            {drinks.map((drink) => (
            <DrinkCard key={drink.name}>
                <DrinkName>{drink.name}</DrinkName>
                <Price>{drink.price}</Price>
            </DrinkCard>
            ))}
        </GridContainer>

        <BottomBar>
            <ActionButton className="affiche">AFFICHE</ActionButton>
            <ActionButton className="send">SEND</ActionButton>
        </BottomBar>
        </PageContainer>
    );
    };

    export default DrinksMenu;