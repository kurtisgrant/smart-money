import React from 'react';

function Login() {
  return (
    <div>
      <h2>Login Page</h2>
      <form action="">
        <label htmlFor="email">Email</label>
        <input id="email" type="text" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;