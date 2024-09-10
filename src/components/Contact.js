import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Contact.css';

const Contact = () => {
  const [heading, setHeading] = useState('');
  const [contactUrl, setContactUrl] = useState('');
  const [contacts, setContacts] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mainId, setMainId] = useState('');
  const [existingContactDetails, setExistingContactDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchContacts();
    fetchContactDetails();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/contact`);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchContactDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/contact/details`);
      if (response.data) {
        setExistingContactDetails(response.data);
        setPhoneNumber(response.data.phoneNumber);
        setMainId(response.data.mainId);
      }
    } catch (error) {
      console.error('Error fetching contact details:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('heading', heading);
    formData.append('contactUrl', contactUrl);

    try {
      if (editing) {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/contact/${editId}`, formData);
        setContacts(contacts.map(item => item._id === editId ? response.data : item));
        Swal.fire('Success', 'Contact updated successfully!', 'success');
      } else {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/contact`, formData);
        setContacts([...contacts, response.data]);
        Swal.fire('Success', 'Contact added successfully!', 'success');
      }
      setHeading('');
      setContactUrl('');
      setEditing(false);
      setEditId(null);
    } catch (error) {
      console.error('Error uploading contact:', error);
      Swal.fire('Error', 'Failed to upload contact.', 'error');
    }
  };

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    const contactDetailsData = {
      phoneNumber,
      mainId
    };

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/contact/details`, contactDetailsData);
      setExistingContactDetails(response.data);
      Swal.fire('Success', 'Contact details updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating contact details:', error);
      Swal.fire('Error', 'Failed to update contact details', 'error');
    }
  };

  const handleEdit = (id) => {
    const item = contacts.find((c) => c._id === id);
    setHeading(item.heading);
    setContactUrl(item.contactUrl);
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
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/contact/${id}`);
          setContacts(contacts.filter((c) => c._id !== id));
          Swal.fire('Deleted!', 'The contact has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting contact:', error);
          Swal.fire('Error', 'Failed to delete contact.', 'error');
        }
      }
    });
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">{editing ? 'Update Contact' : 'Add Contact'}</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <strong>SOCIAL MEDIA</strong>
        <div>
          <input type="text" value={heading} onChange={(e) => setHeading(e.target.value)} placeholder="Title" required />
        </div>
        <div>
          <input type="text" value={contactUrl} onChange={(e) => setContactUrl(e.target.value)} placeholder="Contact URL" required />
        </div>
        <button type="submit">{editing ? 'Update' : 'Add'}</button>
      </form>

      <div>
        <h2 className="contact-title">Contacts</h2>
        {contacts.length === 0 ? (
          <p>No contacts available</p>
        ) : (
          contacts.map((item) => (
            <div key={item._id} className="contact-item">
              <p><strong>Title:</strong> {item.heading}</p>
              <p><strong>Contact URL:</strong> <a href={item.contactUrl} target="_blank" rel="noopener noreferrer">{item.contactUrl}</a></p>
              <button onClick={() => handleEdit(item._id)}>Edit</button>
              <button onClick={() => handleDelete(item._id)}>Delete</button>
            </div>
          ))
        )}
      </div>

      <form className="contact-form" onSubmit={handleSubmitDetails}>
        <h2>Contact Details</h2>
        <div>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" required />
        </div>
        <div>
          <input type="text" value={mainId} onChange={(e) => setMainId(e.target.value)} placeholder="Main ID" required />
        </div>
        <button type="submit">Update Contact Details</button>
      </form>

      <div>
        <p className="contact-title">Contact Details</p>
        <p>{`Phone Number: ${existingContactDetails?.phoneNumber || 'Loading...'}`}</p>
        <p>{`Main ID: ${existingContactDetails?.mainId || 'Loading...'}`}</p>
      </div>
    </div>
  );
};

export default Contact;
