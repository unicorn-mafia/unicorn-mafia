'use client';

import { ReactNode } from 'react';

interface PreloaderWrapperProps {
  children: ReactNode;
}

export default function PreloaderWrapper({ children }: PreloaderWrapperProps) {
  return <>{children}</>;
}
