    import React, { useState } from 'react';
    import styled from 'styled-components';
    import { User, Lock } from 'lucide-react';

    const PageContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom right, #fff3e0, #ffebee);
    padding: 16px;
    `;

    const LoginCard = styled.div`
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 90%;
    max-width: 320px;
    `;

    const Title = styled.h1`
    color: #c62828;
    text-align: center;
    font-size: 2rem;
    margin-bottom: 3rem;
    font-weight: 500;
    `;

    const InputWrapper = styled.div`
    position: relative;
    margin-bottom: 1rem;
    `;

    const Input = styled.input`
    width: 85%;
    padding: 12px 12px 12px 40px;
    border: none;
    border-radius: 8px;
    font-size: 0.9rem;
    background-color: #F0F2F5;
    transition: background-color 0.2s;

    &:focus {
        outline: none;
        background-color: #E4E6E9;
    }

    &::placeholder {
        color: #65676B;
    }
    `;

    const IconWrapper = styled.div`
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #65676B;
    `;

    const LoginButton = styled.button`
    width: 100%;
    padding: 12px;
    background: #c62828;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 1rem;

    &:hover {
        background: #b71c1c;
    }
    `;

    const AdminLink = styled.a`
    display: block;
    text-align: center;
    color: #c62828;
    margin-top: 1.5rem;
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
        text-decoration: underline;
    }
    `;

    const LoginPage = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(credentials);
    };

    return (
        <PageContainer>
        <LoginCard>
            <Title>ClickOrder</Title>
            <form onSubmit={handleSubmit}>
            <InputWrapper>
                <IconWrapper>
                <User size={20} />
                </IconWrapper>
                <Input
                type="text"
                placeholder="john_doe"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                />
            </InputWrapper>
            <InputWrapper>
                <IconWrapper>
                <Lock size={20} />
                </IconWrapper>
                <Input
                type="password"
                placeholder="••••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
            </InputWrapper>
            <LoginButton type="submit">Login</LoginButton>
            <AdminLink href="#">Admin Access</AdminLink>
            </form>
        </LoginCard>
        </PageContainer>
    );
    };

    export default LoginPage;