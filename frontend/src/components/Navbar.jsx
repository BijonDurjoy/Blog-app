import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <img src="https://riseuplabs.com/wp-content/uploads/2021/03/substitution-of-colors-in-riseup-labs-logo.png" alt="Riseup labs logo" />
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
          <span>Bijon</span>
          <span>Logout</span>
          <span className='write'>
            <Link className='link' to="/write">Write</Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default Navbar