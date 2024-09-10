import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDropzone } from 'react-dropzone';
import './Environment.css';

const Environment = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [environment, setEnvironment] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEnvironment();
  }, []);

  const fetchEnvironment = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/environment`);
      setEnvironment(response.data);
    } catch (error) {
      console.error('Error fetching environment:', error);
    }
  };

  const handleMainImageChange = (files) => {
    setMainImage(files[0]);
  };

  const handleImagesChange = (files) => {
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (mainImage) formData.append('mainImages', mainImage);
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      if (editing) {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/environment/${editId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setEnvironment(environment.map(item => item._id === editId ? response.data : item));
        Swal.fire({
          icon: 'success',
          title: 'Environment updated successfully',
          showConfirmButton: true,
          timer: 1500,
        });
      } else {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/environment/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setEnvironment([...environment, response.data]);
        Swal.fire({
          icon: 'success',
          title: 'Environment added successfully',
          showConfirmButton: true,
          timer: 1500,
        });
      }
      setTitle('');
      setDescription('');
      setMainImage(null);
      setImages([]);
      setEditing(false);
      setEditId(null);
    } catch (error) {
      console.error('Error uploading environment:', error);

    }
  };

  const handleEdit = (id) => {
    const environments = environment.find((char) => char._id === id);
    setTitle(environments.title);
    setDescription(environments.description);
    setMainImage(environments.mainImage);
    setImages(environments.images);
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
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/environment/${id}`);
          setEnvironment(environment.filter((char) => char._id !== id));
          Swal.fire('Deleted!', 'The Environment has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting Environment:', error);
          Swal.fire('Error', 'Failed to delete Environment.', 'error');
        }
      }
    });
  };

  const { getRootProps: getRootPropsMain, getInputProps: getInputPropsMain } = useDropzone({
    onDrop: (acceptedFiles) => handleMainImageChange(acceptedFiles),
    accept: 'image/*',
    multiple: false
  });

  const { getRootProps: getRootPropsOther, getInputProps: getInputPropsOther } = useDropzone({
    onDrop: (acceptedFiles) => handleImagesChange(acceptedFiles),
    accept: 'image/*',
    multiple: true
  });

  return (
    <div className="environment-container">
      <h1 className="environment-title">{editing ? 'Update Environment' : 'Add Environment'}</h1>
      <form className="environment-form" onSubmit={handleSubmit}>
        <div>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Title' required />
        </div>
        <div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Description' required />
        </div>
        <strong>Main Image:</strong>
        <div {...getRootPropsMain()} className="dropzone">
          <input {...getInputPropsMain()} />
          {mainImage ? (
            <p>Selected Main Image: {mainImage.name}</p>
          ) : (
            <p>Drag 'n' drop main image here, or click to select one</p>
          )}
        </div>
        <strong>Other Files:</strong>
        <div {...getRootPropsOther()} className="dropzone">
          <input {...getInputPropsOther()} />
          {images.length > 0 ? (
            <p>{images.length} images selected</p>
          ) : (
            <p>Drag 'n' drop other images here, or click to select multiple</p>
          )}
        </div>
        <button type="submit">{editing ? 'Update environment' : 'Add environment'}</button>
      </form>
      <div>
        <h2 className='environment-title'>Environments</h2>
        {environment.length === 0 ? (
          <p>No environment available</p>
        ) : (
          environment.map((item) => (
            <div key={item._id} className="environment-item">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div>
                <strong>Main Image:</strong>
                {item.mainImages.map((image, index) => (
                  <img
                    key={index}
                    src={`${process.env.REACT_APP_API_URL}/${image}`}
                    alt={`Main ${index}`}
                  />
                ))}
              </div>
              <div>
                <strong>Other Files:</strong>
                {item.images.map((image, index) => (
                  <img
                    key={index}
                    src={`${process.env.REACT_APP_API_URL}/${image}`}
                    alt={`Other ${index}`}
                  />
                ))}
              </div>
              <div className="environment-button-container">
                <button onClick={() => handleEdit(item._id)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Environment;
