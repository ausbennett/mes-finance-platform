'use client';

import React, { useState, useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const API_BASE_URL = 'http://localhost:3001/api/plaid'; // Your backend

const PlaidTestPage = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the link token from the backend
  useEffect(() => {
    const fetchLinkToken = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/link-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'test-user' }),
        });
        const data = await response.json();
        console.log('Link Token:', data.linkToken); // Debug log
        setLinkToken(data.linkToken);
        setLoading(false)
      } catch (error) {
        console.error('Error fetching link token:', error);
        setLoading(false)
      }
    };

    fetchLinkToken();
  }, []);

  const onSuccess = async (publicToken: string) => {
    console.log('✅ Public Token:', publicToken);

    try {
      // Send publicToken to backend to exchange for an access_token
      const response = await fetch(`${API_BASE_URL}/exchange-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicToken }),
      });

      const data = await response.json();
      console.log('✅ Access Token Response:', data);

      setAccessToken(data.access_token); // Store access token in state
    } catch (error) {
      console.error('❌ Error exchanging public token:', error);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken || '',
    onSuccess,
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Plaid Test Page</h2>
      {accessToken ? (
        <p>Access Token Retrieved: {accessToken}</p>
      ) : (
        <button onClick={() => open()} disabled={!ready}>
          Connect Your Bank
        </button>
      )}
    </div>
  );
};


export default PlaidTestPage;
