import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Base.css';  // Import the CSS file

const Base = () => {
  return (
    <div className="base-container">
      <h1 className='base-main'>Socialite</h1>
      <h2 className="base-title">Welcome!</h2>
      <p className="base-subtitle">You must Login or Register to continue</p>
      <nav>
        <ul className="base-nav">
          <li>
            <Link to="/login" className="base-link">Login</Link>
          </li>
          <li>
            <Link to="/register" className="base-link">Register</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Base;
