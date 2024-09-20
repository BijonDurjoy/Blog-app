import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

const Navbar = () => {
  const {currentUser,logout} = useContext(AuthContext)
  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
          <img src="https://riseuplabs.com/wp-content/uploads/2021/03/substitution-of-colors-in-riseup-labs-logo.png" alt="Riseup labs logo" />
          </Link>
        </div>
        <div className="links">
          <Link className='link' to="/?cat=art">
          <h6>ART</h6>
          </Link>

          <Link className='link' to="/?cat=movie">
          <h6>MOVIE</h6>
          </Link>

          <Link className='link' to="/?cat=sport">
          <h6>SPORT</h6>
          </Link>

          <Link className='link' to="/?cat=food">
          <h6>FOOD</h6>
          </Link>

          <Link className='link' to="/?cat=culture">
          <h6>CULTURE</h6>
          </Link>
          <span>{currentUser?.username}</span>
          {currentUser ? <span onClick={logout}>Logout</span>: <Link className='link' to="/login">Login</Link>}
          <span className='write'>
            <Link className='link' to="/write">Write</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Navbar