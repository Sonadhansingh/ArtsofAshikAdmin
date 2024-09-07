import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const StrengthForm = ({ fetchStrength, editing, setEditing, currentStrength, setCurrentStrength }) => {
  const [name, setName] = useState('');
  const [percentage, setPercentage] = useState('');

  useEffect(() => {
    if (editing && currentStrength) {
      setName(currentStrength.name);
      setPercentage(currentStrength.percentage);
    }
  }, [editing, currentStrength]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const strengthData = { name, percentage };

    try {
      if (editing) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/strength/${currentStrength._id}`, strengthData);
        Swal.fire({
          title: 'Success',
          text: 'Strength updated successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: true
        });
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/strength`, strengthData);
        Swal.fire({
          title: 'Success',
          text: 'Strength added successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: true
        });
      }
      fetchStrength();
      setName('');
      setPercentage('');
      setEditing(false);
      setCurrentStrength(null);
    } catch (error) {
      console.error('Error saving strength:', error);
      Swal.fire('Error', 'Failed to save strength', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='skills-form'>
      <div className='form-group'>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder='Strength' 
          required 
        />
      </div>
      <div className='form-group'>
        <input 
          type="number" 
          value={percentage} 
          onChange={(e) => setPercentage(e.target.value)} 
          placeholder='Percentage' 
          required 
        />
      </div>
      <button type="submit">{editing ? 'Update Strength' : 'Add Strength'}</button>
    </form>
  );
};

export default StrengthForm;
