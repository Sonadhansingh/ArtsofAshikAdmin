import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Education.css';

function Education() {
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [currentEducation, setCurrentEducation] = useState({ degree: '', school: '', year: '', percentage: '' });
  const [currentExperience, setCurrentExperience] = useState({ position: '', company: '', years: '', description: '' });
  const [editingEducation, setEditingEducation] = useState(false);
  const [editingExperience, setEditingExperience] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEducations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/education`);
        setEducations(response.data);
      } catch (error) {
        console.error('Error fetching educations:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchExperiences = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/experience`);
        setExperiences(response.data);
      } catch (error) {
        console.error('Error fetching experiences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducations();
    fetchExperiences();
  }, []);

  const handleChange = (e, setCurrent) => {
    const { name, value } = e.target;
    setCurrent(prevState => ({ ...prevState, [name]: value }));
  };

  const resetForm = (setCurrent) => {
    setCurrent({ degree: '', school: '', year: '', percentage: '', position: '', company: '', years: '', description: '' });
  };

  const handleSubmit = async (e, current, setCurrent, setEntries, entries, isEditing, setEditing, type) => {
    e.preventDefault();
    setLoading(true);

     // Show SweetAlert loading popup
     Swal.fire({
      title: 'Uploading...',
      text: 'Please wait while your content is being uploaded.',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      let response;
      if (isEditing) {
        response = await axios.put(`${process.env.REACT_APP_API_URL}/api/${type}/${current._id}`, current);
        setEntries(entries.map(entry => (entry._id === current._id ? response.data : entry)));
        Swal.fire('Success', `${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully!`, 'success', { timer: 1500 });
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_URL}/api/${type}`, current);
        setEntries([...entries, response.data]);
        Swal.fire('Success', `${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`, 'success', { timer: 1500 });
      }

      setEditing(false);
      resetForm(setCurrent);
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} ${type}:`, error);
      Swal.fire('Error', `Failed to ${isEditing ? 'update' : 'add'} ${type}.`, 'error', { timer: 1500 });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry, setCurrent, setEditing) => {
    setCurrent(entry);
    setEditing(true);
  };

  const handleDelete = async (id, setEntries, entries, type) => {
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
        setLoading(true);
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/${type}/${id}`);
          setEntries(entries.filter(entry => entry._id !== id));
          Swal.fire('Deleted!', 'Your entry has been deleted.', 'success', { timer: 1500 });
        } catch (error) {
          console.error(`Error deleting ${type}:`, error);
          Swal.fire('Error', `Failed to delete ${type}.`, 'error', { timer: 1500 });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <>
    {loading && <div className="loading-spinner"></div>}
    <div className="container">
      <h2 className='education-title'>Education and Experience</h2>

      <div className="form-section">
        <h2 className='education-title'>{editingEducation ? 'Edit Education' : 'Add Education'}</h2>
        <form onSubmit={(e) => handleSubmit(e, currentEducation, setCurrentEducation, setEducations, educations, editingEducation, setEditingEducation, 'education')}>
          <input type="text" name="degree" placeholder="Degree" value={currentEducation.degree} onChange={(e) => handleChange(e, setCurrentEducation)} required />
          <input type="text" name="school" placeholder="School" value={currentEducation.school} onChange={(e) => handleChange(e, setCurrentEducation)} required />
          <input type="text" name="year" placeholder="Year" value={currentEducation.year} onChange={(e) => handleChange(e, setCurrentEducation)} required />
          <input type="text" name="percentage" placeholder="Percentage" value={currentEducation.percentage} onChange={(e) => handleChange(e, setCurrentEducation)} required />
          <button type="submit">{editingEducation ? 'Update' : 'Add'}</button>
        </form>
      </div>

      <div className="form-section">
        <h2 className='education-title'>{editingExperience ? 'Edit Experience' : 'Add Experience'}</h2>
        <form onSubmit={(e) => handleSubmit(e, currentExperience, setCurrentExperience, setExperiences, experiences, editingExperience, setEditingExperience, 'experience')}>
          <input type="text" name="position" placeholder="Position" value={currentExperience.position} onChange={(e) => handleChange(e, setCurrentExperience)} required />
          <input type="text" name="company" placeholder="Company" value={currentExperience.company} onChange={(e) => handleChange(e, setCurrentExperience)} required />
          <input type="text" name="years" placeholder="Years" value={currentExperience.years} onChange={(e) => handleChange(e, setCurrentExperience)} required />
          <input type="text" name="description" placeholder="Description" value={currentExperience.description} onChange={(e) => handleChange(e, setCurrentExperience)} required />
          <button type="submit">{editingExperience ? 'Update' : 'Add'}</button>
        </form>
      </div>

      <div className="list-section">
        <h2>Education List</h2>
        <ul>
          {educations.map(edu => (
            <li key={edu._id}>
              <p>{edu.degree} - {edu.school} ({edu.year}): {edu.percentage}%</p>
              <button onClick={() => handleEdit(edu, setCurrentEducation, setEditingEducation)}>Edit</button>
              <button onClick={() => handleDelete(edu._id, setEducations, educations, 'education')}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="list-section">
        <h2>Experience List</h2>
        <ul>
          {experiences.map(exp => (
            <li key={exp._id}>
              <p>{exp.position} at {exp.company} ({exp.years}): {exp.description}</p>
              <button onClick={() => handleEdit(exp, setCurrentExperience, setEditingExperience)}>Edit</button>
              <button onClick={() => handleDelete(exp._id, setExperiences, experiences, 'experience')}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
}

export default Education;
