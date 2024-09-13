import React from 'react'

const Login = () => {
  return (
    <div className='auth'>
      <h1>Welcome to the Login page</h1>
      <form>
        <input type="text" placeholder='username'/>
        <input type="password" placeholder='password'/>
        <button>Log in</button>
        <p>Wrong Username or Password</p>
        <span>
          Dont have any account? <a href="http://localhost:5173/register">Register</a>
        </span>
      </form>
    </div>
  )
}

export default Login