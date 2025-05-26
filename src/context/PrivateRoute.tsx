import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return user ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
