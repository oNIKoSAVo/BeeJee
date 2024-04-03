import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    

    fetch("https://asketasket.pythonanywhere.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error);
        }
        return response.json();
      })
      .then((data) => {
        onLogin(credentials.username);
        navigate('/');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', margin: '0 auto' }}>
    <input
      type="text"
      name="username"
      value={credentials.username}
      onChange={handleChange}
      placeholder="Логин"
      required
      style={{ margin: '10px 0', padding: '10px', fontSize: '16px' }}
    />
    <input
      type="password"
      name="password"
      value={credentials.password}
      onChange={handleChange}
      placeholder="Пароль"
      title="Пароль обязателен"
      required
      style={{ margin: '10px 0', padding: '10px', fontSize: '16px'}}
    />
    <button type="submit" style={{ padding: '10px', fontSize: '16px', cursor: 'pointer'}}>Войти</button>
    {error && <div style={{ color: "red", marginTop: '10px', textAlign: 'center' }}>{error}</div>}{" "}
  </form>
  );
};

export default Login;
