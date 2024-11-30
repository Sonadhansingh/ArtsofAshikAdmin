import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Scripts.css';

function Scripts() {
  const [scripts, setScripts] = useState([]);
  const [currentScript, setCurrentScript] = useState({ title: '', description: '', _id: '' });
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);  // <-- Added loading state

  // Fetch all scripts on component mount
  useEffect(() => {
    const fetchScripts = async () => {
      setLoading(true);  // <-- Start loading when fetching
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/scripts`);
        setScripts(response.data);
      } catch (error) {
        console.error('Error fetching scripts:', error);
        Swal.fire('Error', 'Failed to fetch scripts.', 'error');
      } finally {
        setLoading(false);  // <-- Stop loading when fetch is complete
      }
    };

    fetchScripts();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentScript((prevScript) => ({ ...prevScript, [name]: value }));
  };

  // Handle file inputs
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'image') setImageFile(files[0]);
    if (name === 'pdf') setPdfFile(files[0]);
  };

  // Reset form fields
  const resetForm = () => {
    setCurrentScript({ title: '', description: '', _id: '' });
    setImageFile(null);
    setPdfFile(null);
    document.getElementById('imageInput').value = '';
    document.getElementById('pdfInput').value = '';
  };

  // Submit form for adding or updating a script
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // <-- Start loading on form submission

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

    const formData = new FormData();
    formData.append('title', currentScript.title);
    formData.append('description', currentScript.description);
    if (imageFile) formData.append('image', imageFile);
    if (pdfFile) formData.append('pdf', pdfFile);

    try {
      if (editing) {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/scripts/${currentScript._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setScripts(scripts.map((script) => (script._id === currentScript._id ? response.data : script)));
        setEditing(false);
        Swal.fire('Success', 'Script updated successfully!', 'success', { timer: 1500 });
      } else {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/scripts`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setScripts([...scripts, response.data]);
        Swal.fire('Success', 'Script added successfully!', 'success', { timer: 1500 });
      }
    } catch (error) {
      console.error('Error submitting script:', error);
      Swal.fire('Error', 'Failed to submit script.', 'error');
    } finally {
      setLoading(false);  // <-- Stop loading after submission
    }

    resetForm();
  };

  // Handle editing a script
  const handleEdit = (script) => {
    setCurrentScript(script);
    setEditing(true);
  };

  // Handle deleting a script
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
        setLoading(true);  // <-- Start loading when deleting
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/scripts/${id}`);
          setScripts(scripts.filter((script) => script._id !== id));
          Swal.fire('Deleted!', 'The script has been deleted.', 'success', { timer: 1500 });
        } catch (error) {
          console.error('Error deleting script:', error);
          Swal.fire('Error', 'Failed to delete script.', 'error');
        } finally {
          setLoading(false);  // <-- Stop loading after delete action
        }
      }
    });
  };

  return (
    <>
    {loading && <div className="loading-spinner"></div>}
    <div className="script-manager">
      <h1 className="script-title">{editing ? 'Update Script' : 'Add Script'}</h1>
      <form onSubmit={handleSubmit} className="script-form">
        <input
          type="text"
          name="title"
          value={currentScript.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={currentScript.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <strong>Main Image:</strong>
        <input id="imageInput" type="file" name="image" onChange={handleFileChange} accept="image/*" />
        <strong>PDF File:</strong>
        <input id="pdfInput" type="file" name="pdf" onChange={handleFileChange} accept="application/pdf" />
        <button type="submit">{editing ? 'Update Script' : 'Add Script'}</button>
      </form>

      <h1 className="script-title">Scripts</h1>
      <ul className="script-list">
        {scripts.map((script) => (
          <li key={script._id} className="script-item">
            {script.imageUrl && <img src={script.imageUrl} alt={script.title} className="admin-script-image" />}
            <div>
              <h3>{script.title}</h3>
              <p>{script.description}</p>
              {script.pdfUrl && <a href={script.pdfUrl} download>Download PDF</a>}
            </div>
            <div className="button-container">
              <button onClick={() => handleEdit(script)}>Edit</button>
              <button onClick={() => handleDelete(script._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

export default Scripts;
