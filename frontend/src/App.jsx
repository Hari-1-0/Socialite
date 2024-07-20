// frontend/src/App.js or frontend/src/index.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Base from './components/Base';
import Profile from './components/Profile';
import Update from './components/Update';
import 'vite/modulepreload-polyfill'
import './styles.css'

function App() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Base />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profiles/:id" element={<Profile />} />
                <Route path="/update-post/:id" element={<Update />} />
            </Routes>
        </Router>
    );
}

export default App;
