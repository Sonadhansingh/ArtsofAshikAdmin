import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const StrengthList = ({ strength, fetchStrength, setEditing, setCurrentStrength }) => {
  const handleEdit = (strength) => {
    setEditing(true);
    setCurrentStrength(strength);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/strength/${id}`);
          fetchStrength();
          Swal.fire('Deleted!', 'The strength has been deleted.', 'success', { timer: 1500 });
        } catch (error) {
          console.error('Error deleting strength:', error);
          Swal.fire('Error', 'Failed to delete strength', 'error', { timer: 1500 });
        }
      }
    });
  };

  return (
    <>
    <h2 className='skills-title'>Strength List</h2>
    <div className='skills-list-container'>
      
      {strength.length === 0 ? (
        <p>No strength available</p>
      ) : (
        strength.map((strength) => (
          <div key={strength._id} className='skills-list'>
            <h3>{strength.name}</h3>
            <p>{strength.percentage}%</p>
            <div className='skills-button-container'>
                <button className='skills-button' onClick={() => handleEdit(strength)}>Edit</button>
                <button className='skills-button' onClick={() => handleDelete(strength._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
    </>
  );
};

export default StrengthList;
