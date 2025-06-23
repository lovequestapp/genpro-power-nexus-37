
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force scroll to top immediately
    window.scrollTo(0, 0);
    
    // Also try with a small delay to ensure DOM is ready
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
