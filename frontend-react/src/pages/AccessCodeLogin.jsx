import React from 'react';


function AccessCodeLogin({ setUser }) {

  const handleSubmit = () => {
    setUser({ id: 8, name: 'Johnny Appleseed', type: 'student' })
  }
  return (
    <div>
      <h2>Enter Access Code</h2>
      <form action="">
        <label htmlFor="access-code">Access Code</label>
        <input id="access-code" type="text" />
        <button onClick={handleSubmit}>Enter</button>
        <p>(Just click enter to login as Johnny)</p>
      </form>
    </div>
  );
}

export default AccessCodeLogin;