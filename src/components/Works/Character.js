import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDropzone } from 'react-dropzone';
import './Character.css';

const Character = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mainImages, setMainImages] = useState(null);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [content, setContent] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/content`);
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Failed to fetch content.');
    } finally {
      setLoading(false);
    }
  };

  const handleMainFileChange = (acceptedFiles) => {
    setMainImages(acceptedFiles[0]);
  };

  const handleFilesChange = (acceptedFiles) => {
    setImages(acceptedFiles);
  };

  const handleVideoChange = (acceptedFiles) => {
    setVideos(acceptedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

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
      if (!title || !description) {
        setError('Title and description are required.');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);

      if (mainImages) {
        formData.append('mainImages', mainImages);
      }

      images.forEach(image => {
        formData.append('images', image);
      });

      videos.forEach(video => {
        formData.append('videos', video);
      });

      const requestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (editing) {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/content/${editId}`, formData, requestConfig);
        setContent(content.map(item => item._id === editId ? response.data : item));
        Swal.fire('Success', 'Character updated successfully', 'success', 1500);
      } else {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/content`, formData, requestConfig);
        setContent([...content, response.data]);
        Swal.fire('Success', 'Character added successfully', 'success' , 1500);
      }

      resetForm();
    } catch (error) {
      console.error('Error uploading content:', error);
      Swal.fire('Error', 'Failed to upload content.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setMainImages(null);
    setImages([]);
    setVideos([]);
    setEditing(false);
    setEditId(null);
    setError('');
  };

  const handleEdit = (id) => {
    const character = content.find((char) => char._id === id);
    setTitle(character.title);
    setDescription(character.description);
    setMainImages(character.mainImages);
    setImages(character.images || []);
    setVideos(character.videos || []);
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
        setLoading(true);
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/content/${id}`);
          setContent(content.filter((char) => char._id !== id));
          Swal.fire('Deleted!', 'The character has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting character:', error);
          Swal.fire('Error', 'Failed to delete character.', 'error');
        } finally {
          setUploading(false);
        }
      }
    });
  };

  const { getRootProps: getRootPropsMain, getInputProps: getInputPropsMain } = useDropzone({
    onDrop: handleMainFileChange,
    accept: 'image/*',
    multiple: false,
  });

  const { getRootProps: getRootPropsOther, getInputProps: getInputPropsOther } = useDropzone({
    onDrop: handleFilesChange,
    accept: 'image/*',
    multiple: true,
  });

  const { getRootProps: getRootPropsVideos, getInputProps: getInputPropsVideos } = useDropzone({
    onDrop: handleVideoChange,
    accept: 'video/*',
    multiple: true,
  });

  return (
    <div className="character-container">
      <h1 className="character-title">{editing ? 'Update Character' : 'Add Character'}</h1>
      {loading ? (
        <p></p>
      ) : (
        <form className="character-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Title' required />
          </div>
          <div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Description' required />
          </div>
          <strong>Main File:</strong>
          <div {...getRootPropsMain()} className="dropzone">
            <input {...getInputPropsMain()} />
            {mainImages ? (
              <p>Selected Main File: {mainImages.name}</p>
            ) : (
              <p>Drag 'n' drop main image here, or click to select one</p>
            )}
          </div>
          <strong>Other Image Files (Max:30) :</strong>
          <div {...getRootPropsOther()} className="dropzone">
            <input {...getInputPropsOther()} />
            {images && images.length > 0 ? (
              <p>{images.length} files selected...</p>
            ) : (
              <p>Drag 'n' drop additional images here, or click to select files</p>
            )}
          </div>
          <strong>Video Files (Max:5):</strong>
          <div {...getRootPropsVideos()} className="dropzone">
            <input {...getInputPropsVideos()} />
            {videos && videos.length > 0 ? (
              <p>{videos.length} video files selected...</p>
            ) : (
              <p>Drag 'n' drop videos here, or click to select video files</p>
            )}
          </div>
          <button type="submit" disabled={uploading} className="submit-button">
            {editing ? 'Update' : 'Add'} Character
          </button>
        </form>
      )}
      <div className="content-list">
        <h2 className='character-title'>Character List</h2>
        {content.map((item) => (
          <div key={item._id} className="character-item">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div class='image-video-combine'>
              {item.mainImages && (
                <img src={item.mainImages} alt={item.title} className="admin-script-image" />
              )}
              {item.videos && item.videos.length > 0 && (
                <div className="video-container">
                  <video controls loop>
                    <source src={item.videos[0]} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
            {item.images && item.images.length > 0 && (
              <div className="admin-character-image">
                {item.images.map((image, index) => (
                  <img key={index} src={image} alt={`Script ${index + 1}`} />
                ))}
              </div>
            )}
            <div className="character-actions">
              <button onClick={() => handleEdit(item._id)}>Edit</button>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Character;
