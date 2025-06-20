import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ isLoggedIn, onRequireLogin, children }) {
  const hasRequested = useRef(false);
  const location = useLocation(); 

  useEffect(() => {
    if (!isLoggedIn && !hasRequested.current) {
      onRequireLogin(location.pathname);
      hasRequested.current = true;
    }
  }, [isLoggedIn, onRequireLogin, location]);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;