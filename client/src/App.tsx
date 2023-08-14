import React from 'react';
import './App.css';
import AuthPage from '../src/components/layouts/auth/AuthPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/layouts/home/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/newfeed" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
