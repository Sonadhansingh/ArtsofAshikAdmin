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

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/about`);
        setExistingAbout(response.data);
        setSubheading(response.data.subheading || '');
        setDescription(response.data.description || '');
        setPurpleText(response.data.purpleText || '');
      } catch (error) {
        console.error('Error fetching about:', error);
      }
    };

    fetchAbout();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('subheading', subheading);
    formData.append('description', description);
    formData.append('purpleText', purpleText);
    if (image) {
      formData.append('image', image);
    }
    if (pdf) {
      formData.append('pdf', pdf);
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/about`, formData);
      setExistingAbout(response.data);  
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
    }
  };

  return (
    <>
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
      </form>

      <div className="responsive-container-block bigContainer">
        <div className="responsive-container-block Container bottomContainer">
          <div className="ultimateImg">
            {existingAbout?.image && (
              <img className="mainImg" src={`${process.env.REACT_APP_API_URL}/${existingAbout.image}`} alt="About" />
            )}
            <div className="purpleBox">
              <h2>ABOUT WORK</h2>
              <p className="purpleText">
                {existingAbout?.purpleText || 'Loading...'}
              </p>
              {/* <img className="stars" src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/mp5.svg" alt="Stars"/> */}
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
              <a className="explore" href={`${process.env.REACT_APP_API_URL}/${existingAbout.pdf}`} target="_blank" rel="noopener noreferrer">
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
