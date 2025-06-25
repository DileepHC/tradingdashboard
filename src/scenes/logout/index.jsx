// scenes/logout/index.jsx
import React, { useEffect } from 'react';
import { LogOut } from 'lucide-react';

/**
 * Logout component handles the logout process.
 * In a real application, this would clear authentication tokens and redirect.
 */
function Logout() {
  useEffect(() => {
    // Simulate logout process
    const timer = setTimeout(() => {
      console.log('User logged out. Clearing session data...');
      // In a real app:
      // - Clear auth tokens (e.g., localStorage.removeItem('authToken'))
      // - Redirect to login page (e.g., history.push('/login'))
      // For this demo, we'll just log it.
    }, 1500); // Simulate a delay for logout processing

    return () => clearTimeout(timer); // Cleanup timer if component unmounts
  }, []);

  return (
    <div className="p-8 flex flex-col items-center justify-center h-full bg-background-color text-text-base">
      <LogOut className="w-16 h-16 text-primary mb-6 animate-pulse" />
      <h2 className="text-3xl font-bold text-secondary mb-4">Logging Out...</h2>
      <p className="text-text-base text-lg text-center">
        Thank you for using the dashboard. You will be redirected shortly.
      </p>
    </div>
  );
}

export default Logout;
