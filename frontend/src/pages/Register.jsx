import React from 'react'

const Register = () => {
  return (
    <div className='auth'>
      <h1>Welcome to the Register page</h1>
      <form>
        <input required type="email" placeholder='email' />
        <input required type="text" placeholder='username'/>
        <input required type="password" placeholder='password'/>
        <button>Register</button>
        <span>
          Dont have an account? <a href="http://localhost:5173/login">Login</a>
        </span>
      </form>
    </div>
  )
}

export default Register