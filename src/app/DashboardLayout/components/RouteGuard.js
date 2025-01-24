import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const RouteGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated && router.pathname !== '/login') {
    return null; // Render nothing while redirecting
  }

  return children;
};

export default RouteGuard;
