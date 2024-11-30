import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ImageRoll.css';

const API_URL = `${process.env.REACT_APP_API_URL}/api/images`;

const ImageRoll = () => {
  const [images, setImages] = useState([]); // To hold image URLs from MongoDB
  const [newImages, setNewImages] = useState([]); // To hold files for upload
  const [loading, setLoading] = useState(false);  // <-- Added loading state

  // Fetch image URLs from MongoDB (these point to S3)
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);  // <-- Start loading when fetching
    try {
      const response = await axios.get(API_URL); // Fetches image data (S3 URLs) from MongoDB
      setImages(response.data); // Assuming the response is an array of image objects
    } catch (error) {
      console.error('Error fetching images:', error);
      Swal.fire('Error', 'Failed to fetch images', 'error');
    } finally {
      setLoading(false);  // <-- Stop loading after submission
    }
  };

  // Handle selected images for upload
  const handleFileChange = (e) => {
    setNewImages([...e.target.files]); // Updates state with selected files
  };

  // Handle image upload
  const handleUpload = async () => {
    setLoading(true);  // <-- Start loading when fetching

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

    if (newImages.length > 0) {
      try {
        const formData = new FormData();
        newImages.forEach((image) => {
          formData.append('images', image); // Append each image to the FormData object
        });

        // Send the FormData to the backend to upload images to S3
        const response = await axios.post(`${API_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 201) {
          fetchImages(); // Refresh image list after upload
          setNewImages([]); // Clear selected images
          Swal.fire('Success', 'Images uploaded successfully', 'success');
        }
      } catch (error) {
        console.error('Error uploading images:', error);
        Swal.fire('Error', 'Failed to upload images', 'error');
      } finally {
        setLoading(false);  // <-- Stop loading after submission
      }
    } 
  };

  // Handle image deletion
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);  // <-- Start loading when fetching
        try {
          // Send delete request to backend to delete the image from S3 and MongoDB
          await axios.delete(`${API_URL}/${id}`);
          fetchImages(); // Refresh image list after deletion
          Swal.fire('Deleted!', 'Your image has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting image:', error);
          Swal.fire('Error', 'Failed to delete image', 'error');
        } finally {
          setLoading(false);  // <-- Stop loading after submission
        }
      }
    });
  };

  return (
    <>
     {loading && <div className="loading-spinner"></div>}
      <div className='image-roll-container'>
        <div className='image-roll-body'>
          <strong>Image Roll</strong>
          <input type="file" multiple onChange={handleFileChange} />
          <button className='upload-image-button' onClick={handleUpload}>
            Upload Images
          </button>
        </div>
      </div>

      <div className="image-grid">
        {images.map((image) => (
          <div key={image._id} className="image-container">
            <img
              src={image.url} // Assuming the image URL is stored in MongoDB
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
