"use client";

import { useUser } from "@/context/user-context";

export default function DebugPage() {
  const { user, isLoggedIn, isLoaded } = useUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug User State</h1>
      <div className="space-y-2">
        <p><strong>isLoaded:</strong> {isLoaded ? 'true' : 'false'}</p>
        <p><strong>isLoggedIn:</strong> {isLoggedIn ? 'true' : 'false'}</p>
        <p><strong>user:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}</p>
        <p><strong>token in localStorage:</strong> {typeof window !== 'undefined' && localStorage.getItem('token') ? 'exists' : 'not found'}</p>
      </div>
    </div>
  );
}
