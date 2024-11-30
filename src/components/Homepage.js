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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLatestVideo();
    fetchBigText();
    fetchLinks();
  }, []);

  // Function to fetch the latest video URL from the server
  const fetchLatestVideo = async () => {
    setLoading(true);  // <-- Start loading when fetching
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/video/latest`);
      if (response.data.videos.length > 0) {
        setVideoUrl(response.data.videos[0]); // Set the latest video URL
      }
    } catch (error) {
      console.error('Error fetching the latest video:', error);
    } finally {
      setLoading(false);  // <-- Stop loading when fetch is complete
    }
  };

  // Function to handle file selection for video upload
  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  // Fetching big text from the server
  const fetchBigText = async () => {
    setLoading(true);  // <-- Start loading when fetching
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/textLink/bigText`);
      if (response.data.length > 0) {
        setBigText(response.data[0].text);
      }
    } catch (error) {
      console.error('Error fetching bigText:', error);
    } finally {
      setLoading(false);  // <-- Stop loading when fetch is complete
    }
  };

  // Fetching links from the server
  const fetchLinks = async () => {
    setLoading(true);  // <-- Start loading when fetching
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/textLink/link`);
      if (response.data.length > 0) {
        setLinks(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);  // <-- Stop loading when fetch is complete
    }
  };

   // Function to handle video upload
   const handleSubmit = async (e) => {
    e.preventDefault();
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

    const formData = new FormData();
    formData.append('video', video);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/video/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Set the video URL to the uploaded video URL
      setVideoUrl(response.data.videoUrl);
      Swal.fire('Success', 'Video uploaded successfully!', 'success');
      fetchLatestVideo();
    } catch (error) {
      console.error('Error uploading video:', error);
      Swal.fire('Error', 'Failed to upload video.', 'error');
    } finally {
      setLoading(false);  // <-- Stop loading when fetch is complete
    }
  };

  // Function to handle video deletion
  const handleDelete = async () => {
    setLoading(true);  // <-- Start loading when fetching
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/video/delete`);
      setVideoUrl('');  // Clear the video URL after deletion
      Swal.fire('Deleted', 'Video deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting video:', error);
      Swal.fire('Error', 'Failed to delete video.', 'error');
    } finally {
      setLoading(false);  // <-- Stop loading when fetch is complete
    }
  }; 

  // Function to submit big text and links
  const handleSubmitText = async (e) => {
    e.preventDefault();
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

    try {
      const bigTextResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/textLink/bigText`, { text: bigText });
      const linksResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/textLink/link`, { ...links });
      
      Swal.fire('Success', 'Content updated successfully!', 'success');
      
      // Optionally, you can handle the response if needed
      console.log('Big Text Response:', bigTextResponse.data);
      console.log('Links Response:', linksResponse.data);
    } catch (error) {
      console.error('Error updating content:', error);
      Swal.fire('Error', 'Failed to update content.', 'error');
    } finally {
      setLoading(false);  // <-- Stop loading when fetch is complete
    }
  };

  return (
    <>
      {loading && <div className="loading-spinner"></div>}
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
            <video autoPlay loop muted>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button onClick={handleDelete}>Delete Video</button>
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
