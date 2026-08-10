import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackDuration } from '../utils/analytics';

const AnalyticsTracker = () => {
  const location = useLocation();
  const enterTimeRef = useRef(Date.now());
  const prevPathRef = useRef(null);

  useEffect(() => {
    // Report time spent on the page we're navigating away from
    if (prevPathRef.current) {
      const seconds = Math.round((Date.now() - enterTimeRef.current) / 1000);
      trackDuration(prevPathRef.current, seconds);
    }

    // Article pages track themselves (with the real postId) — skip here
    // to avoid double-counting.
    if (!location.pathname.startsWith('/news/')) {
      trackPageView(location.pathname);
    }

    prevPathRef.current = location.pathname;
    enterTimeRef.current = Date.now();
  }, [location.pathname]);

  useEffect(() => {
    const reportOnExit = () => {
      if (prevPathRef.current) {
        const seconds = Math.round((Date.now() - enterTimeRef.current) / 1000);
        trackDuration(prevPathRef.current, seconds);
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') reportOnExit();
    };
    window.addEventListener('beforeunload', reportOnExit);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('beforeunload', reportOnExit);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return null;
};

export default AnalyticsTracker;