import React, { useEffect, useState } from 'react';
import { FaShieldAlt } from 'react-icons/fa';

const BrowserWarning = () => {
  const [isBrave, setIsBrave] = useState(false);

  useEffect(() => {
    // Detect Brave browser
    const detectBrave = async () => {
      try {
        // Brave has a specific navigator property
        if (navigator.brave && await navigator.brave.isBrave()) {
          setIsBrave(true);
          return;
        }

        // Alternative detection method
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('brave')) {
          setIsBrave(true);
          return;
        }

        // Check for Brave's content blocking behavior
        const testElement = document.createElement('div');
        testElement.className = 'brave-test';
        testElement.innerHTML = '&nbsp;';
        document.body.appendChild(testElement);

        // Create a test image that would typically be blocked by Brave
        const img = document.createElement('img');
        img.src = 'https://www.google-analytics.com/collect?v=1&tid=UA-TEST';
        img.style.display = 'none';
        testElement.appendChild(img);

        // Wait a bit for Brave to potentially block the element
        await new Promise(resolve => setTimeout(resolve, 100));

        // Check if the image was blocked
        const computedStyle = window.getComputedStyle(img);
        if (img.complete && img.naturalWidth === 0) {
          setIsBrave(true);
        }

        // Check for ERR_BLOCKED_BY_CLIENT errors in console
        // Create a test fetch to a commonly blocked domain
        try {
          const testFetch = await fetch('https://www.googletagmanager.com/gtag/js?id=test', {
            method: 'HEAD',
            mode: 'no-cors',
            cache: 'no-cache'
          });
          // If fetch succeeds, probably not Brave with shields up
        } catch (fetchError) {
          // If fetch fails with a network error, likely Brave with shields up
          setIsBrave(true);
        }

        // Clean up
        if (document.body.contains(testElement)) {
          document.body.removeChild(testElement);
        }
      } catch (error) {
        console.error('Error detecting Brave browser:', error);
      }
    };

    detectBrave();
  }, []);

  if (!isBrave) return null;

  return (
    <div className="browser-warning">
      <div className="warning-icon">
        <FaShieldAlt />
      </div>
      <div className="warning-content">
        <h3>Brave Browser Detected</h3>
        <p>
          You're using Brave Browser which blocks certain requests by default.
          We're seeing <code>ERR_BLOCKED_BY_CLIENT</code> errors that prevent Google Sign-In from working.
        </p>
        <p><strong>To use Google Sign-In, please:</strong></p>
        <ol>
          <li>Click the Brave shield icon <FaShieldAlt style={{ verticalAlign: 'middle' }} /> in the address bar</li>
          <li>Set "Shields" to "Down for this site"</li>
          <li>Refresh the page and try again</li>
        </ol>
        <p className="note">
          <strong>Note:</strong> This is only required for authentication. You can turn Shields back on after signing in.
        </p>
      </div>

      <style jsx>{`
        .browser-warning {
          display: flex;
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
          border-radius: 4px;
          padding: 16px;
          margin-bottom: 20px;
          color: #856404;
        }

        .warning-icon {
          font-size: 24px;
          margin-right: 16px;
          display: flex;
          align-items: center;
        }

        .warning-content {
          flex: 1;
        }

        .warning-content h3 {
          margin-top: 0;
          margin-bottom: 8px;
          font-size: 18px;
        }

        .warning-content p {
          margin-bottom: 12px;
        }

        .warning-content ol {
          margin: 0;
          padding-left: 20px;
        }

        .warning-content li {
          margin-bottom: 4px;
        }

        .note {
          font-size: 13px;
          margin-top: 12px;
          padding: 8px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 4px;
        }

        code {
          background-color: rgba(0, 0, 0, 0.1);
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
};

export default BrowserWarning;
