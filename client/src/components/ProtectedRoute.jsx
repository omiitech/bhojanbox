import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getProfile } from '../features/auth/authSlice';

const ProtectedRoute = ({ children, redirectPath = '/login' }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token && !isAuthenticated) {
        try {
          await dispatch(getProfile()).unwrap();
        } catch (error) {
          console.error('Authentication check failed:', error);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [dispatch, isAuthenticated]);

  if (isLoading || (loading && localStorage.getItem('token'))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
