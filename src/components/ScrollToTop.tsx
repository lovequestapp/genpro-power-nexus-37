
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediately scroll to top synchronously
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Also force scroll with smooth behavior disabled
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    
    // Additional safety net with multiple attempts
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    // Execute immediately
    scrollToTop();
    
    // Also try after a small delay to ensure DOM is ready
    setTimeout(scrollToTop, 0);
    setTimeout(scrollToTop, 10);
    setTimeout(scrollToTop, 50);
    
    // Final attempt after layout is complete
    requestAnimationFrame(() => {
      scrollToTop();
      setTimeout(scrollToTop, 100);
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
