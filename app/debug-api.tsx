"use client";

import { useEffect } from 'react';
import { getApiUrl } from '@/lib/config';

export default function DebugAPI() {
  useEffect(() => {
    console.log('=== DEBUG INFO ===');
    console.log('Window hostname:', window.location.hostname);
    console.log('Window href:', window.location.href);
    console.log('API URL:', getApiUrl());
    console.log('Auth token:', localStorage.getItem('aventus-auth-token')?.substring(0, 50));
  }, []);

  return null;
}
