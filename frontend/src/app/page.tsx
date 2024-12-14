"use client";

import React from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';

const HomePage = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4 bg-background">
        <h1 className="text-3xl font-bold text-primary">Welcome to the E-Learning Platform</h1>
        <p className="mt-4 text-text">Explore our courses and start learning today!</p>
        <Button onClick={() => alert('Get Started!')} className="bg-highlight">Get Started</Button>
      </div>
    </Layout>
  );
};

export default HomePage;