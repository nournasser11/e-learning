"use client";

import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/register', { email, password });
            console.log('Registration successful:', response.data);
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-4 bg-background">
                <h1 className="text-3xl font-bold text-primary">Register</h1>
                <form onSubmit={handleRegister} className="mt-4">
                    <FormInput
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FormInput
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={() => { }} className="bg-highlight">Register</Button>
                </form>
            </div>
        </Layout>
    );
};

export default RegisterPage;