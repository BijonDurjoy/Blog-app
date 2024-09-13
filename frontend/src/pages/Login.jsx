import React from 'react'
import { Link } from 'react-router-dom'

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
          Dont have any account? <Link to = "/register">Register</Link>
        </span>
      </form>
    </div>
  )
}

export default Login