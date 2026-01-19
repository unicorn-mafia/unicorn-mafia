'use client';

import { useState, useEffect, ReactNode } from 'react';
import Preloader from './preloader';
import styles from './preloader.module.css';

const STORAGE_KEY = 'unicorn-mafia-preloader-seen';

interface PreloaderWrapperProps {
  children: ReactNode;
}

export default function PreloaderWrapper({ children }: PreloaderWrapperProps) {
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [shouldShowPreloader, setShouldShowPreloader] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check sessionStorage for previous visit
    const hasSeenPreloader = sessionStorage.getItem(STORAGE_KEY);
    if (hasSeenPreloader) {
      setShouldShowPreloader(false);
      setIsPreloaderComplete(true);
    }
  }, []);

  const handlePreloaderComplete = () => {
    // Mark preloader as seen in session storage
    sessionStorage.setItem(STORAGE_KEY, 'true');
    // Start fade out animation
    setIsFading(true);
    // After fade completes, remove preloader
    setTimeout(() => {
      setIsPreloaderComplete(true);
    }, 500);
  };

  // During SSR or before mount, render children hidden for SEO
  if (!isMounted) {
    return (
      <>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </>
    );
  }

  // Skip preloader if already seen this session, or if complete
  if (!shouldShowPreloader || isPreloaderComplete) {
    return <>{children}</>;
  }

  // Show preloader with hidden content behind it
  return (
    <>
      <div className={`${styles.preloaderOverlay} ${isFading ? styles.fadeOut : ''}`}>
        <Preloader onComplete={handlePreloaderComplete} />
      </div>
      <div style={{ visibility: isFading ? 'visible' : 'hidden' }}>{children}</div>
    </>
  );
}
