import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, Mail } from 'lucide-react';
import { newsletterAPI } from '../utils/api';

const NewsletterUnsubscribe = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); 
  const [message, setMessage] = useState('');

  useEffect(() => {
    handleUnsubscribe();
  }, [token]);

  const handleUnsubscribe = async () => {
    try {
      const response = await newsletterAPI.unsubscribe(token);
      setStatus('success');
      setMessage(response.data.message);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to unsubscribe');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader className="mx-auto text-primary-500 animate-spin mb-4" size={64} />
              <h2 className="text-2xl font-heading font-bold mb-2">Processing...</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we process your request
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-blue-500" size={48} />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-2">Unsubscribed Successfully</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  We're sorry to see you go! You'll no longer receive our newsletters.
                </p>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                Changed your mind? You can always resubscribe from our homepage.
              </p>

              <div className="flex gap-3 justify-center">
                <Link to="/" className="btn-primary">
                  Go to Homepage
                </Link>
                <Link to="/" className="btn-secondary">
                  Resubscribe
                </Link>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="text-red-500" size={48} />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-2">Unsubscribe Failed</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              <Link to="/" className="btn-primary inline-block">
                Go to Homepage
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterUnsubscribe;