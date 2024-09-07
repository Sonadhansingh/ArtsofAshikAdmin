import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Scripts.css';

function Scripts() {
  const [scripts, setScripts] = useState([]);
  const [currentScript, setCurrentScript] = useState({ title: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/scripts`);
        setScripts(response.data);
      } catch (error) {
        console.error('Error fetching scripts:', error);
      }
    };

    fetchScripts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentScript({ ...currentScript, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'image') setImageFile(files[0]);
    if (name === 'pdf') setPdfFile(files[0]);
  };

  const resetForm = () => {
    setCurrentScript({ title: '', description: '' });
    setImageFile(null);
    setPdfFile(null);
    document.getElementById('imageInput').value = '';
    document.getElementById('pdfInput').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', currentScript.title);
    formData.append('description', currentScript.description);
    if (imageFile) formData.append('image', imageFile);
    if (pdfFile) formData.append('pdf', pdfFile);

    if (editing) {
      try {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/scripts/${currentScript._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setScripts(scripts.map((script) => (script._id === currentScript._id ? response.data : script)));
        setEditing(false);
        Swal.fire('Success', 'Script updated successfully!', 'success', { timer : 1500});
      } catch (error) {
        console.error('Error updating script:', error);
        Swal.fire('Error', 'Failed to update script.', 'error', { timer : 1500});
      }
    } else {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/scripts`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setScripts([...scripts, response.data]);
        Swal.fire('Success', 'Script added successfully!', 'success', { timer : 1500});
      } catch (error) {
        console.error('Error adding script:', error);
        Swal.fire('Error', 'Failed to add script.', 'error', { timer : 1500});
      }
    }

    resetForm();
  };

  const handleEdit = (script) => {
    setCurrentScript(script);
    setEditing(true);
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
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/scripts/${id}`);
          setScripts(scripts.filter((script) => script._id !== id));
          Swal.fire('Deleted!', 'The script has been deleted.', 'success', { timer : 1500});
        } catch (error) {
          console.error('Error deleting script:', error);
          Swal.fire('Error', 'Failed to delete script.', 'error', { timer : 1500});
        }
      }
    });
  };

  return (
    <div className="script-manager">
      <h1 className='script-title'>{editing ? 'Update Script' : 'Add Script'}</h1>
      <form onSubmit={handleSubmit} className="script-form">
        <input type="text" name="title" value={currentScript.title} onChange={handleChange} placeholder="Title" required />
        <textarea name="description" value={currentScript.description} onChange={handleChange} placeholder="Description" required />
        <strong>Main Image:</strong>
        <input id="imageInput" type="file" name="image" onChange={handleFileChange} accept="image/*" />
        <strong>Pdf file:</strong>
        <input id="pdfInput" type="file" name="pdf" onChange={handleFileChange} accept="application/pdf" />
        <button type="submit">{editing ? 'Update Script' : 'Add Script'}</button>
      </form>
      <h1 className='script-title'> Scripts </h1>
      <ul className="script-list">
        {scripts.map((script) => (
          <li key={script._id} className="script-item">
            <img src={`${process.env.REACT_APP_API_URL}/${script.imageUrl}`} alt={script.title} className='admin-script-image'/>
            <div>
              <h3>{script.title}</h3>
              <p>{script.description}</p>
              <a href={`${process.env.REACT_APP_API_URL}/${script.pdfUrl}`} download>Download PDF</a>
            </div>
            <div className='button-container'>
              <button onClick={() => handleEdit(script)}>Edit</button>
              <button onClick={() => handleDelete(script._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Scripts;
