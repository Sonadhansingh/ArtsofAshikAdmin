import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Aboutpage.css';

function Aboutpage() {
  const [subheading, setSubheading] = useState('');
  const [description, setDescription] = useState('');
  const [purpleText, setPurpleText] = useState('');
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [existingAbout, setExistingAbout] = useState(null);
  const [loading, setLoading] = useState(false);  // <-- Added loading state

  // Fetch existing about data from backend
  useEffect(() => {
    const fetchAbout = async () => {
      setLoading(true);  // <-- Start loading when fetching
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/about`);
        setExistingAbout(response.data);
        setSubheading(response.data.subheading || '');
        setDescription(response.data.description || '');
        setPurpleText(response.data.purpleText || '');
      } catch (error) {
        console.error('Error fetching about:', error);
      } finally {
        setLoading(false);  // <-- Stop loading when fetch is complete
      }
    };

    fetchAbout();
  }, []);

  // Handle form submission to update the About page
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
    formData.append('subheading', subheading);
    formData.append('description', description);
    formData.append('purpleText', purpleText);
    if (image) formData.append('image', image);
    if (pdf) formData.append('pdf', pdf);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/about`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setExistingAbout(response.data);  // Update the existing about with new data
      Swal.fire({
        icon: 'success',
        title: 'About page updated successfully!',
        showConfirmButton: true,
        timer: 1500
      });
    } catch (error) {
      console.error('Error updating about page:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to update about page',
        text: error.response?.data?.message || 'An error occurred while updating the about page',
      });
    } finally {
      setLoading(false);  // <-- Stop loading after submission
    }
  };

  // Handle delete request
  const handleDelete = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);  // <-- Start loading when deleting
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/about`);
          setExistingAbout(null);
          setSubheading('');
          setDescription('');
          setPurpleText('');
          setImage(null);
          setPdf(null);
          Swal.fire('Deleted!', 'Your about page has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting about page:', error);
          Swal.fire('Failed!', 'An error occurred while deleting the about page.', 'error');
        } finally {
          setLoading(false);  // <-- Stop loading after submission
        }
      }
    });
  };

  return (
    <>
      {loading && <div className="loading-spinner"></div>}
      <form onSubmit={handleSubmit} className="update-about-container">
        <h1 className='about-title'>About</h1>
        <div className="form-group">
          <label htmlFor='subheading'>Subheading:</label>
          <textarea
            id="subheading"
            value={subheading}
            onChange={(e) => setSubheading(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor='description'>About me:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor='purpleText'>About work:</label>
          <textarea
            id="purpleText"
            value={purpleText}
            onChange={(e) => setPurpleText(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor='image'>Admin Image:</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
        </div>
        <div className="form-group">
          <label htmlFor='pdf'>Upload PDF:</label>
          <input
            type="file"
            id="pdf"
            onChange={(e) => setPdf(e.target.files[0])}
            accept="application/pdf"
          />
        </div>
        <button type="submit">Update</button>
        {existingAbout && (
          <button type="button" className="delete-btn" onClick={handleDelete}>Delete</button>
        )}
      </form>

      {/* Displaying the existing About content */}
      <div className="responsive-container-block bigContainer">
        <div className="responsive-container-block Container bottomContainer">
          <div className="ultimateImg">
            {existingAbout?.image && (
              <img className="mainImg" src={existingAbout.image} alt="About" />
            )}
            <div className="purpleBox">
              <h2>ABOUT WORK</h2>
              <p className="purpleText">
                {existingAbout?.purpleText || 'Loading...'}
              </p>
            </div>
          </div>
          <div className="allText bottomText">
            <p className="text-blk headingText">About Me</p>
            <p className="text-blk subHeadingText">
              {subheading || 'Loading subheading...'}
            </p>
            <p className="text-blk description">
              {description || 'Loading description...'}
            </p>
            {existingAbout?.pdf && (
              <a className="explore" href={existingAbout.pdf} target="_blank" rel="noopener noreferrer">
                View PDF
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Aboutpage;
