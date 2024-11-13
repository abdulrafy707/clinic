'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const VerifyEmailPage = () => {
  const [statusMessage, setStatusMessage] = useState('Verifying your email...');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatusMessage('Invalid verification link.');
        return;
      }

      try {
        // Send a GET request to the API with the token
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          method: 'GET',
        });

        if (response.ok) {
          setStatusMessage('Email verified successfully! Redirecting to login...');
          // Redirect to login page after a short delay
          setTimeout(() => {
            router.push('/login');
          }, 3000);
        } else {
          const errorData = await response.json();
          setStatusMessage(errorData.error || 'Verification failed.');
        }
      } catch (error) {
        setStatusMessage('An error occurred during verification. Please try again later.');
        console.error('Verification error:', error);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4">Email Verification</h2>
        <p>{statusMessage}</p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
