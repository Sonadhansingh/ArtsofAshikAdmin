import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const SkillsForm = ({ fetchSkills, editing, setEditing, currentSkill, setCurrentSkill }) => {
  const [name, setName] = useState('');
  const [percentage, setPercentage] = useState('');

  useEffect(() => {
    if (editing && currentSkill) {
      setName(currentSkill.name);
      setPercentage(currentSkill.percentage);
    }
  }, [editing, currentSkill]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillData = { name, percentage };

    try {
      if (editing) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/skills/${currentSkill._id}`, skillData);
        Swal.fire({
          title: 'Success',
          text: 'Skill updated successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: true,
        });
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/skills`, skillData);
        Swal.fire({
          title: 'Success',
          text: 'Skill added successfully',
          icon: 'success',
          timer: 1500,
          showConfirmButton: true,
        });
      }
      fetchSkills();
      setName('');
      setPercentage('');
      setEditing(false);
      setCurrentSkill(null);
    } catch (error) {
      console.error('Error saving skill:', error);
      Swal.fire('Error', 'Failed to save skill', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='skills-form'>
      <div className='form-group'>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Skill'
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
      <button type="submit">{editing ? 'Update Skill' : 'Add Skill'}</button>
    </form>
  );
};

export default SkillsForm;
