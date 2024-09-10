import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDropzone } from 'react-dropzone';
import './Character.css';

const Character = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);
  const [content, setContent] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/content`);
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
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
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/content/${editId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setContent(content.map(item => item._id === editId ? response.data : item));
        Swal.fire({
          icon: 'success',
          title: 'Character updated successfully',
          showConfirmButton: true,
          timer: 1500,
        });
      } else {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/content/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setContent([...content, response.data]);
        Swal.fire({
          icon: 'success',
          title: 'Character added successfully',
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
      console.error('Error uploading content:', error);
    }
  };

  const handleEdit = (id) => {
    const character = content.find((char) => char._id === id);
    setTitle(character.title);
    setDescription(character.description);
    setMainImage(character.mainImage);
    setImages(character.images);
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
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/content/${id}`);
          setContent(content.filter((char) => char._id !== id));
          Swal.fire('Deleted!', 'The character has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting character:', error);
          Swal.fire('Error', 'Failed to delete character.', 'error');
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
    <div className="character-container">
      <h1 className="character-title">{editing ? 'Update Character' : 'Add Character'}</h1>
      <form className="character-form" onSubmit={handleSubmit}>
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
        <button type="submit">{editing ? 'Update Character' : 'Add Character'}</button>
      </form>
      <div>
        <h2 className='character-title'>Characters</h2>
        {content.length === 0 ? (
          <p>No content available</p>
        ) : (
          content.map((item) => (
            <div key={item._id} className="character-item">
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
              <div className="character-button-container">
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

export default Character;
