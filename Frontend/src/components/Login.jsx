import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ParticlesBackground from './ParticlesBackground'; // Assuming you have this component

function Login({onLogin}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email,password)
    // navigate('/translate');
  };

  return (
    <div className="login-page">
      {/* <ParticlesBackground /> */}
      <div className="login-container glass-effect">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Username</label>
            <input
              id="email"
              name="username"
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="submit-btn">Login</button>
        </form>

        <p className="signup-text">
          Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
