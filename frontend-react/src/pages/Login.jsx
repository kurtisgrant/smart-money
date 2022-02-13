import React from 'react';

function Login({ setUser }) {
  return (
    <div>
      <h2>Login Page</h2>
      <form action="">
        <label htmlFor="email">Email</label>
        <input id="email" type="text" />
        <button onClick={() => setUser({id: 3, name: 'Mrs. Krabappel', type: 'teacher'})}>Login</button>
        <p>(Just click login to login as Mrs. K)</p>
      </form>
    </div>
  );
}

export default Login;