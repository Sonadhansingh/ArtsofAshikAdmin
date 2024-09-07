import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';
import Userqueries from './Userqueries';

const Navbar = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-icon" onClick={handleClick}>
          {click ? <FaTimes /> : <FaBars />}
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <a href="/home" className="nav-links" style={{textDecoration:"none", color:"whitesmoke"}}>
              Home
            </a>
          </li>
          <li className="nav-item">
            <a href="/main" className="nav-links" style={{textDecoration:"none", color:"whitesmoke"}}>
              Works
            </a>
          </li>
          <li className="nav-item">
            <a href="/scripts" className="nav-links" style={{textDecoration:"none", color:"whitesmoke"}}>
              Scripts
            </a>
          </li>
          <li className="nav-item">
            <a href="/about" className="nav-links" style={{textDecoration:"none", color:"whitesmoke"}}>
              About
            </a>
          </li>
          <li className="nav-item">
            <a href="/education" className="nav-links" style={{textDecoration:"none", color:"whitesmoke"}}>
              Education
            </a>
          </li>
          <li className="nav-item">
            <a href="/competences" className="nav-links" style={{textDecoration:"none", color:"whitesmoke"}}>
              Competences
            </a>
          </li>
          <li className="nav-item">
            <a href="/skills" className="nav-links" style={{textDecoration:"none", color:"whitesmoke"}}>
              Skills
            </a>
          </li>
          <li className="nav-item">
            <a href="/contact" className="nav-links" style={{textDecoration:"none", color:"whitesmoke"}}>
              Contact
            </a>
          </li>
        </ul>
        <Userqueries/>
      </div>
    </nav>
  );
};

export default Navbar;