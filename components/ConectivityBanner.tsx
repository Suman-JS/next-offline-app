"use client";

import React, { useEffect, useState } from "react";

const ConnectivityBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowWelcomeBack(true);
      setTimeout(() => setShowWelcomeBack(false), 3000); // Hide "Welcome back" after 3 seconds
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "ONLINE") {
        handleOnline();
      } else if (event.data && event.data.type === "OFFLINE") {
        handleOffline();
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    navigator.serviceWorker.addEventListener("message", handleMessage);

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, []);

  if (isOnline && !showWelcomeBack) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: isOnline ? "#4CAF50" : "#F44336",
        color: "white",
        textAlign: "center",
        padding: "10px",
        zIndex: 1000,
      }}
    >
      {isOnline ? "Welcome back!" : "You're offline"}
    </div>
  );
};

export default ConnectivityBanner;
