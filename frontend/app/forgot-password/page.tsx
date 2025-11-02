'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      // Always show success message (security best practice)
      setSuccess(true);
      
      // In development, show the reset link if returned
      if (response.data.resetLink) {
        console.log('Reset link (dev only):', response.data.resetLink);
      }
    } catch (err: any) {
      // Even on error, show success message (security best practice)
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Elegant flowing wave shapes */}
        <svg className="absolute bottom-0 left-0 w-full h-full opacity-20" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <path
            d="M0,400 Q300,200 600,350 T1200,350 L1200,800 L0,800 Z"
            fill="url(#gradient1)"
            className="animate-pulse-slow"
            style={{ animationDuration: '8s' }}
          />
          <path
            d="M0,450 Q400,250 800,400 T1200,400 L1200,800 L0,800 Z"
            fill="url(#gradient2)"
            className="animate-pulse-slow"
            style={{ animationDuration: '10s', animationDelay: '2s' }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(251, 191, 36, 0.3)" />
              <stop offset="100%" stopColor="rgba(249, 115, 22, 0.2)" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(251, 146, 60, 0.25)" />
              <stop offset="100%" stopColor="rgba(244, 63, 94, 0.15)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Top wave */}
        <svg className="absolute top-0 left-0 w-full h-1/3 opacity-15" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <path
            d="M0,400 Q300,200 600,250 T1200,250 L1200,0 L0,0 Z"
            fill="url(#gradient3)"
            className="animate-pulse-slow"
            style={{ animationDuration: '12s' }}
          />
          <defs>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(251, 191, 36, 0.2)" />
              <stop offset="100%" stopColor="rgba(249, 115, 22, 0.15)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Abstract geometric shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 transform rotate-45 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-amber-300 to-orange-400 rounded-full blur-2xl"></div>
        </div>
        <div className="absolute bottom-32 left-16 w-80 h-80 transform -rotate-12 opacity-8">
          <div className="w-full h-full bg-gradient-to-tr from-orange-300 to-red-400 rounded-full blur-3xl"></div>
        </div>

        {/* Subtle mesh gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(at 20% 30%, rgba(251, 191, 36, 0.15) 0px, transparent 50%),
              radial-gradient(at 80% 70%, rgba(249, 115, 22, 0.15) 0px, transparent 50%),
              radial-gradient(at 50% 50%, rgba(244, 63, 94, 0.1) 0px, transparent 50%)
            `
          }}
        ></div>

        {/* Elegant border accents */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-300/30 to-transparent"></div>
      </div>
      
      {/* Main card container */}
      <div className="max-w-md w-full space-y-6 glass bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/40 relative z-10 animate-slide-up">
        {/* Header section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="text-6xl mb-2 transform transition-transform hover:scale-110 duration-300">🪔</div>
          </div>
          <div>
            <h2 className="text-5xl font-extrabold font-display gradient-text bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 mb-3 tracking-tight">
              Chashni
            </h2>
            <p className="text-gray-600 font-medium text-base">Reset your password</p>
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div 
            className="bg-green-50 border-l-4 border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-sm animate-slide-up flex items-start gap-3"
            role="alert"
          >
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-sm">If an account with that email exists, we've sent a password reset link.</p>
              <p className="text-xs mt-1 text-green-600">Please check your email and click the link to reset your password.</p>
            </div>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {/* Error message */}
            {error && (
              <div 
                className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-sm animate-slide-up flex items-start gap-3"
                role="alert"
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="font-medium text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Info message */}
            <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 px-4 py-3 rounded-lg">
              <p className="text-sm">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    className={`h-5 w-5 transition-colors ${focusedField ? 'text-amber-500' : 'text-gray-400'}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  onFocus={() => setFocusedField(true)}
                  onBlur={() => setFocusedField(false)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm transition-all duration-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm ${
                    error ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading || !email}
                className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-amber-600 via-orange-600 to-orange-600 hover:from-amber-700 hover:via-orange-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending reset link...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Send reset link
                    <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Back to login link */}
        <div className="text-center">
          <Link 
            href="/login" 
            className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-all duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded px-1 inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

