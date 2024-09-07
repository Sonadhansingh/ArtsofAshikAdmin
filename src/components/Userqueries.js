import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import './Userqueries.css';

const Userqueries = () => {
  const [queries, setQueries] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showChatbox, setShowChatbox] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/queries`);
      setQueries(response.data);
      setUnreadCount(response.data.length);
    } catch (error) {
      console.error('Error fetching queries:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/queries/${id}`);
      fetchQueries();
    } catch (error) {
      console.error('Error deleting query:', error);
    }
  };

  const handleToggleChatbox = () => {
    setShowChatbox(!showChatbox);
    if (showChatbox) {
      setUnreadCount(0);
    }
  };

  return (
    <div className="admin-queries-container">
      <div className="notification-icon">
        <span
          className={`ring-symbol ${unreadCount > 0 ? 'has-unread' : ''}`}
          onClick={handleToggleChatbox}
        >
          <FontAwesomeIcon icon={faBell} />
          {unreadCount > 0 && <span className="unread-count">{unreadCount}</span>}
        </span>
      </div>

      {showChatbox && (
        <div className="chatbox">
          <div className="queries-list">
            {queries.map(query => (
              <div key={query._id} className="query-item">
                <p className="query-date-time">{new Date(query.createdAt).toLocaleString()}</p>
                <p className="query-details"><strong>Name:</strong> {query.name}</p>
                <p className="query-details"><strong>Email:</strong> {query.email}</p>
                <p className="query-details"><strong>Inquiry Type:</strong> {query.inquiryType}</p>
                <p className="query-details"><strong>Budget:</strong> {query.budget}</p>
                <p className="query-details"><strong>Message:</strong> {query.message}</p>
                <button className="delete-button" onClick={() => handleDelete(query._id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Userqueries;
