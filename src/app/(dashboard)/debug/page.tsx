"use client";

import { useUser } from "@/context/user-context";
import { BASEURL } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function DebugPage() {
  const { user, isLoggedIn, isLoaded } = useUser();
  const { login } = useAuth();
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [authEndpointStatus, setAuthEndpointStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [testLoginResult, setTestLoginResult] = useState<string>('');
  const [isTestingLogin, setIsTestingLogin] = useState(false);

  useEffect(() => {
    // Test backend connectivity
    const testBackend = async () => {
      try {
        const response = await fetch(BASEURL);
        setBackendStatus(response.ok ? 'online' : 'offline');
      } catch (error) {
        console.error('Backend connectivity test failed:', error);
        setBackendStatus('offline');
      }
    };

    // Test auth endpoint
    const testAuthEndpoint = async () => {
      try {
        const response = await fetch(`${BASEURL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test', password: 'test' })
        });
        setAuthEndpointStatus('online'); // Even if it returns error, endpoint is reachable
      } catch (error) {
        console.error('Auth endpoint test failed:', error);
        setAuthEndpointStatus('offline');
      }
    };

    testBackend();
    testAuthEndpoint();
  }, []);

  const testLogin = async () => {
    setIsTestingLogin(true);
    setTestLoginResult('Testing...');
    try {
      const result = await login('few306144@gmail.com', 'Hybrid241$');
      setTestLoginResult(`SUCCESS: ${JSON.stringify(result)}`);
    } catch (error) {
      setTestLoginResult(`ERROR: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsTestingLogin(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Application State</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Backend Configuration</h2>
        <div className="space-y-2 bg-gray-100 p-4 rounded">
          <p><strong>BASEURL:</strong> {BASEURL}</p>
          <p><strong>Backend Status:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              backendStatus === 'online' ? 'bg-green-200 text-green-800' :
              backendStatus === 'offline' ? 'bg-red-200 text-red-800' :
              'bg-yellow-200 text-yellow-800'
            }`}>
              {backendStatus}
            </span>
          </p>
          <p><strong>Auth Endpoint:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              authEndpointStatus === 'online' ? 'bg-green-200 text-green-800' :
              authEndpointStatus === 'offline' ? 'bg-red-200 text-red-800' :
              'bg-yellow-200 text-yellow-800'
            }`}>
              {authEndpointStatus}
            </span>
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Authentication Test</h2>
        <div className="space-y-2 bg-gray-100 p-4 rounded">
          <button 
            onClick={testLogin}
            disabled={isTestingLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isTestingLogin ? 'Testing Login...' : 'Test Login with Valid Credentials'}
          </button>
          {testLoginResult && (
            <div className="mt-2 p-2 bg-white rounded">
              <strong>Test Result:</strong>
              <pre className="text-sm mt-1">{testLoginResult}</pre>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">User Authentication State</h2>
        <div className="space-y-2 bg-gray-100 p-4 rounded">
          <p><strong>isLoaded:</strong> {isLoaded ? 'true' : 'false'}</p>
          <p><strong>isLoggedIn:</strong> {isLoggedIn ? 'true' : 'false'}</p>
          <p><strong>user:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}</p>
          <p><strong>token in localStorage:</strong> {typeof window !== 'undefined' && localStorage.getItem('token') ? 'exists' : 'not found'}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Environment Information</h2>
        <div className="space-y-2 bg-gray-100 p-4 rounded">
          <p><strong>Node Environment:</strong> {process.env.NODE_ENV}</p>
          <p><strong>Window defined:</strong> {typeof window !== 'undefined' ? 'true' : 'false'}</p>
          <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}
