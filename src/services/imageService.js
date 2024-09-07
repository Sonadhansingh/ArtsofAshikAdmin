
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/images`;

export const uploadImage = (image) => {
  const formData = new FormData();
  formData.append('image', image);
  return axios.post(`${API_URL}/upload`, formData);
};

export const getImages = () => {
  return axios.get(API_URL);
};

export const deleteImage = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
