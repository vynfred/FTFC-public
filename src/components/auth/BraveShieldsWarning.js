import React from 'react';

const BraveShieldsWarning = () => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium">Brave Browser Detected</h3>
          <div className="mt-2 text-sm">
            <p>
              It looks like you're using Brave Browser with Shields enabled. This can block Google Sign-In from working properly.
            </p>
            <p className="mt-2 font-bold">
              To sign in with Google, please:
            </p>
            <ol className="list-decimal list-inside mt-2 ml-2">
              <li>Click the Brave Shield icon in the address bar (🛡️)</li>
              <li>Select "Shields are up for this site"</li>
              <li>Change it to "Shields are down for this site"</li>
              <li>Refresh this page</li>
              <li>Try signing in with Google again</li>
            </ol>
            <p className="mt-2 italic">
              You can re-enable Shields after you've successfully signed in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BraveShieldsWarning;
