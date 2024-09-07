import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); 
    const email = event.target.email.value; 
    const password = event.target.password.value;
    if (email === 'ashikartistry@gmail.com' && password === 'Ashik@2024') {
            localStorage.setItem('authToken', 'your-auth-token');
            navigate('/home');
    } else {
      alert("Login Failed");
    }
  };

  return (
    <div className='login-container'>
      <section>
        {Array(144).fill().map((_, i) => <span key={i}></span>)}
        <div className="signin">
          <div className="content">
            <h2>Sign In</h2>
            <form className="form" onSubmit={handleSubmit}>
              <div className="inputBox">
                <input type="email" name="email" required />
                <i>Email</i>
              </div>
              <div className="inputBox">
                <input type="password" name="password" required />
                <i>Password</i>
              </div>
              <div className="inputBox">
                <input type="submit" value="Login" />
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;