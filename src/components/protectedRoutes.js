import React from 'react';
import { Navigate } from 'react-router-dom';


const isAuthenticated = () => {

  return localStorage.getItem('authToken') !== null;
};


function protectedRoutes({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}
