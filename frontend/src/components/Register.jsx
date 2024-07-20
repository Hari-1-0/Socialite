import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';


const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        username,
        password
      });
      console.log(response.data); // Handle successful registration
      // Optionally handle login after successful registration
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      // Handle registration error, display message to user
    }
  };

  return (
    <div className='register-container'>
      <h2 className='register'>Register</h2>
      <form onSubmit={handleRegister} className='register-form'>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit" className='register-btn'>Register</button>
      </form>
    </div>
  );
};

export default Register;
