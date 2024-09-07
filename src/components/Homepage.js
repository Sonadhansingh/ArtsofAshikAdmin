import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Homepage.css';
import ImageRoll from './ImageRoll';

const Homepage = () => {
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [bigText, setBigText] = useState('');
  const [links, setLinks] = useState({ generalTitle: '', generalUrl: '', instaTitle: '', instaUrl: '' });

  useEffect(() => {
    fetchLatestVideo();
    fetchBigText();
    fetchLinks();
  }, []);

  const fetchLatestVideo = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/video/latest`);
      setVideoUrl(response.data.videoUrl);
    } catch (error) {
      console.error('Error fetching the latest video:', error);
    }
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const fetchBigText = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/textLink/bigText`);
      if (response.data.length > 0) {
        setBigText(response.data[0].text);
      }
    } catch (error) {
      console.error('Error fetching bigText:', error);
    }
  };

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/textLink/link`);
      if (response.data.length > 0) {
        setLinks(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('video', video);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/video/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Swal.fire('Success', 'Video uploaded successfully!', 'success');
      fetchLatestVideo();
    } catch (error) {
      console.error('Error uploading video:', error);
      Swal.fire('Error', 'There was an issue uploading the video', 'error');
    }
  };

  const handleSubmitText = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/textLink/bigText`, { text: bigText });
      await axios.post(`${process.env.REACT_APP_API_URL}/api/textLink/link`, { ...links });
      Swal.fire('Success', 'Content updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating content:', error);
      Swal.fire('Error', 'Failed to update content.', 'error');
    }
  };

  return (
    <>
      <div className="homepage-container">
        <h1 className="homepage-title">Admin Home Page</h1>
        <form className="homepage-form" onSubmit={handleSubmit}>
          <strong>Home page video</strong>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            required
          />
          <button type="submit">Upload Video</button>
        </form>
        {videoUrl && (
          <div className="video-container">
            <video controls autoPlay loop muted>
              <source src={`${process.env.REACT_APP_API_URL}${videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

<form onSubmit={handleSubmitText} className="homepage-form">
        <div className="form-group">
          <label>Big Text</label>
          <input
            type="text"
            value={bigText}
            onChange={(e) => setBigText(e.target.value)}
            required
            placeholder="Enter big text"
          />
        </div>

        <div className="form-group">
          <label>Press / General inquiries</label>
          <input
            type="text"
            placeholder="Title"
            value={links.generalTitle}
            onChange={(e) => setLinks({ ...links, generalTitle: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="URL"
            value={links.generalUrl}
            onChange={(e) => setLinks({ ...links, generalUrl: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Instagram</label>
          <input
            type="text"
            placeholder="Title"
            value={links.instaTitle}
            onChange={(e) => setLinks({ ...links, instaTitle: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="URL"
            value={links.instaUrl}
            onChange={(e) => setLinks({ ...links, instaUrl: e.target.value })}
            required
          />
        </div>

        <button type="submit">Update</button>
      </form>
      </div>

      <ImageRoll/>

    </>
  );
};

export default Homepage;
