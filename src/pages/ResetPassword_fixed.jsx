import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  
  const getApiUrl = () => {
    const baseUrl = import.meta.env.VITE_API_URL;
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
  };

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(
        `${getApiUrl()}/auth/verify-reset-token/${token}`
      );
      const data = await response.json();

      if (data.success) {
        setTokenValid(true);
        setUserEmail(data.data.email);
      } else {
        setTokenValid(false);
        setError(data.message || 'Invalid or expired reset token');
      }
    } catch (err) {
      setTokenValid(false);
      setError('Failed to verify reset token');
      console.error('Token verification error:', err);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${getApiUrl()}/auth/reset-password/${token}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password, confirmPassword }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying reset token...</p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">I</span>
              </div>
              <h1 className="text-3xl font-heading font-bold">
                INKSTONE <span className="text-primary-500">MEDIA</span>
              </h1>
            </div>
          </div>

          <div className="card p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <AlertCircle className="text-red-600 dark:text-red-400" size={32} />
            </div>
            
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Invalid or Expired Link
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || 'This password reset link is invalid or has expired.'}
            </p>

            <div className="space-y-3">
              <Link
                to="/admin/forgot-password"
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <span>Request New Reset Link</span>
              </Link>
              
              <Link
                to="/admin/login"
                className="btn-secondary w-full flex items-center justify-center space-x-2"
              >
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">I</span>
              </div>
              <h1 className="text-3xl font-heading font-bold">
                INKSTONE <span className="text-primary-500">MEDIA</span>
              </h1>
            </div>
          </div>

          <div className="card p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
            </div>
            
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              Password Reset Successful!
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your password has been reset successfully. You can now login with your new password.
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting to login page in 3 seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-dark-900 dark:to-dark-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">I</span>
            </div>
            <h1 className="text-3xl font-heading font-bold">
              INKSTONE <span className="text-primary-500">MEDIA</span>
            </h1>
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            Reset Your Password
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Enter your new password for <strong>{userEmail}</strong>
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Resetting password...</span>
                </>
              ) : (
                <>
                  <Lock size={20} />
                  <span>Reset Password</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/admin/login"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500"
            >
              Back to Login
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          <Link to="/" className="hover:text-primary-500">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;