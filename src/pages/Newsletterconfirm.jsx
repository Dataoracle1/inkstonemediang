import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { newsletterAPI } from '../utils/api';

const NewsletterConfirm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); 
  const [message, setMessage] = useState('');

  useEffect(() => {
    confirmSubscription();
  }, [token]);

  const confirmSubscription = async () => {
    try {
      const response = await newsletterAPI.confirmSubscription(token);
      setStatus('success');
      setMessage(response.data.message);
      
      // Redirect to home after 5 seconds
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to confirm subscription');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader className="mx-auto text-primary-500 animate-spin mb-4" size={64} />
              <h2 className="text-2xl font-heading font-bold mb-2">Confirming...</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we confirm your subscription
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-500" size={48} />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-2">Subscription Confirmed!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {message}
              </p>
              <p className="text-sm text-gray-500">
                You'll be redirected to the homepage in 5 seconds...
              </p>
              <Link to="/" className="btn-primary mt-4 inline-block">
                Go to Homepage
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="text-red-500" size={48} />
              </div>
              <h2 className="text-2xl font-heading font-bold mb-2">Confirmation Failed</h2>
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

export default NewsletterConfirm;