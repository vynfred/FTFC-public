import React, { useState, useEffect } from 'react';

/**
 * Component to prompt users to install the PWA
 */
const PWAInstallPrompt = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Store the install prompt event
    const handleBeforeInstallPrompt = (event) => {
      // Prevent the default browser prompt
      event.preventDefault();
      // Store the event for later use
      setInstallPromptEvent(event);
      // Show our custom prompt
      setShowPrompt(true);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isAppInstalled) {
      setShowPrompt(false);
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle the install button click
  const handleInstallClick = () => {
    if (!installPromptEvent) return;

    // Show the browser's install prompt
    installPromptEvent.prompt();

    // Wait for the user to respond to the prompt
    installPromptEvent.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      // Reset the install prompt event
      setInstallPromptEvent(null);
      // Hide our custom prompt
      setShowPrompt(false);
    });
  };

  // Handle the dismiss button click
  const handleDismissClick = () => {
    setShowPrompt(false);
    // Store in localStorage that the user dismissed the prompt
    localStorage.setItem('pwaPromptDismissed', 'true');
  };

  // If the prompt should not be shown, don't render anything
  if (!showPrompt || localStorage.getItem('pwaPromptDismissed') === 'true') {
    return null;
  }

  // Render the install prompt
  return (
    <div className="pwa-install-prompt">
      <div className="pwa-install-prompt-content">
        <div className="pwa-install-prompt-icon">
          <img src="/logo192.png" alt="FTFC" />
        </div>
        <div className="pwa-install-prompt-text">
          <h3>Install FTFC Dashboard</h3>
          <p>Install this app on your device for quick and easy access when you're on the go.</p>
        </div>
        <div className="pwa-install-prompt-buttons">
          <button className="pwa-install-prompt-dismiss" onClick={handleDismissClick}>
            Not Now
          </button>
          <button className="pwa-install-prompt-install" onClick={handleInstallClick}>
            Install
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
