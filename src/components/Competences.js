import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDropzone } from 'react-dropzone';
import './Competences.css';

const Competence = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [competences, setCompetences] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);  // <-- Added loading state

  useEffect(() => {
    fetchCompetences();
  }, []);

  const fetchCompetences = async () => {
    setLoading(true);  // <-- Start loading when fetching
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/competence`);
      setCompetences(response.data);
    } catch (error) {
      console.error('Error fetching competences:', error);
    } finally {
      setLoading(false);  // <-- Stop loading when fetch is complete
    }
  };

  const handleImageChange = (files) => {
    setImage(files[0]);
  };

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
    formData.append('title', title);
    if (image) formData.append('image', image);

    try {
      if (editing) {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/competence/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setCompetences(competences.map(item => item._id === editId ? response.data : item));
        Swal.fire('Success', 'Competence updated successfully!', 'success');
      } else {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/competence`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setCompetences([...competences, response.data]);
        Swal.fire('Success', 'Competence added successfully!', 'success');
      }
      setTitle('');
      setImage(null);
      setEditing(false);
      setEditId(null);
    } catch (error) {
      console.error('Error uploading competence:', error);
      Swal.fire('Error', 'Failed to upload competence.', 'error');
    } finally {
      setLoading(false);  // <-- Stop loading after submission
    }
  };

    // Edit a competence
    const handleEdit = (id) => {
      const item = competences.find((c) => c._id === id);
      setTitle(item.title);
      setEditing(true);
      setEditId(id);
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
        setLoading(true);  // <-- Start loading when deleting
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/competence/${id}`);
          setCompetences(competences.filter((c) => c._id !== id));
          Swal.fire('Deleted!', 'The competence has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting competence:', error);
          Swal.fire('Error', 'Failed to delete competence.', 'error');
        } finally {
          setLoading(false);  // <-- Stop loading after delete action
        }
      }
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleImageChange(acceptedFiles),
    accept: 'image/*',
    multiple: false,
  });

  return (
    <div className="competence-container">
      <h1 className="competence-title">{editing ? 'Update Competence' : 'Add Competence'}</h1>
      
      <form className="competence-form" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
        </div>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {image ? (
            <p>Selected Image: {image.name}</p>
          ) : (
            <p>Drag 'n' drop an image here, or click to select one</p>
          )}
        </div>
        <button type="submit">{editing ? 'Update' : 'Add'}</button>
      </form>

      <div className="competence-grid">
        {competences.length === 0 ? (
           <p></p>
        ) : (
          competences.map((item) => (
            <div key={item._id} className="competence-item">
              <div>
                {item.image && (
                  <img
                    src={item.image}
                    alt="Competence"
                    style={{ width: '100px', height: '100px' }}
                  />
                )}
              </div>
              <p><strong>Title:</strong> {item.title}</p>
              <button onClick={() => handleEdit(item._id)}>Edit</button>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Competence;

