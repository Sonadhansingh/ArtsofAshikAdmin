import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ImageRoll.css';

const API_URL = `${process.env.REACT_APP_API_URL}/api/images`;

const ImageRoll = () => {
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(API_URL);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleFileChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleUpload = async () => {
    if (newImages.length > 0) {
      try {
        const formData = new FormData();
        newImages.forEach(image => {
          formData.append('images', image);
        });
        await axios.post(`${API_URL}/upload`, formData);
        fetchImages();
        setNewImages([]);
        Swal.fire('Success', 'Images uploaded successfully', 'success');
      } catch (error) {
        console.error('Error uploading images:', error);
        Swal.fire('Error', 'Failed to upload images', 'error');
      }
    }
  };

  const handleDelete = async (id) => {
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
          await axios.delete(`${API_URL}/${id}`);
          fetchImages();
          Swal.fire('Deleted!', 'Your image has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting image:', error);
          Swal.fire('Error', 'Failed to delete image', 'error');
        }
      }
    });
  };

  return (
    <>
    <div className='image-roll-container'>
      <div className='image-roll-body'>
        <strong>Image roll</strong>
        <input type="file" multiple onChange={handleFileChange} />
        <button  className='upload-image-button' onClick={handleUpload}>Upload Images</button>
      </div>
    </div>
      <div className="image-grid">
        {images.map(image => (
          <div key={image._id} className="image-container">
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/${image.path}`}
              alt={image.filename}
              className="image"
            />
            <button className="delete-button" onClick={() => handleDelete(image._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ImageRoll;
