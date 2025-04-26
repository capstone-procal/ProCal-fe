import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PrivateRoute({ isLoggedIn, onRequireLogin, children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      onRequireLogin(); 
    }
  }, [isLoggedIn, onRequireLogin]);

  if (!isLoggedIn) {
    return null;
  }

  return children;
}

export default PrivateRoute;