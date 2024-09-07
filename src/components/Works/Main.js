import React from 'react';
import './Main.css';
import {useNavigate } from 'react-router-dom';

function Main() {
    const navigate= useNavigate();

    const handleLeftClick = () =>{
        navigate('/character')
    }

    const handleRightClick = () =>{
        navigate('/environment')
    }

  return (
    <div className='mbimage'>
         <button className="hidden-button left-button" onClick={handleLeftClick} aria-label="Navigate to left page"></button>
         <button className="hidden-button right-button" onClick={handleRightClick} aria-label="Navigate to right page"></button>
        <h2 className='left-heading'>CHARACTER</h2>
        <h2 className='right-heading'>ENVIRONMENT</h2>
    
    </div>
  )
}

export default Main