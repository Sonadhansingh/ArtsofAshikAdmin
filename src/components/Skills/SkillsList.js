import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const SkillsList = ({ skills, fetchSkills, setEditing, setCurrentSkill }) => {
  const handleEdit = (skill) => {
    setEditing(true);
    setCurrentSkill(skill);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/skills/${id}`);
          fetchSkills();
          Swal.fire('Deleted!', 'The skill has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting skill:', error);
          Swal.fire('Error', 'Failed to delete skill', 'error');
        }
      }
    });
  };

  return (
    <>
    <h2 className='skills-title'>Skills List</h2>
    <div className='skills-list-container'>
      
      {skills.length === 0 ? (
        <p>No skills available</p>
      ) : (
        skills.map((skill) => (
          <div key={skill._id} className='skills-list'>
            <h3>{skill.name}</h3>
            <p>{skill.percentage}%</p>
            <div className='skills-button-container'>
                <button className='skills-button' onClick={() => handleEdit(skill)}>Edit</button>
                <button className='skills-button' onClick={() => handleDelete(skill._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
    </>
  );
};

export default SkillsList;
