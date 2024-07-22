import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../axiosInstance';
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_DETAILS } from '../constants';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchUserDetails = async (token) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user-details/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        localStorage.setItem('USER_DETAILS', JSON.stringify(response.data));
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
    
        try {
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/token/`, {
            username,
            password,
          });
    
          if (response.status === 200) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            await fetchUserDetails(response.data.access);
            navigate('/home');
          }
        } catch (err) {
          if (err.response && err.response.data) {
            setError('Login failed: ' + JSON.stringify(err.response.data));
          } else {
            setError('An error occurred during login. Please try again.');
          }
        }
      };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="login-container">
          <h2 className='login'>Login</h2>
          <form onSubmit={handleLogin} className="login-form">
              <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
              />
              <div className="password-container">
                  <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
                  <FontAwesomeIcon
                      icon={showPassword ? faEye : faEyeSlash}
                      onClick={togglePasswordVisibility}
                      className="password-icon"
                  />
              </div>
              <button type="submit" className='login-btn'>Login</button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
  );
};

export default Login;
