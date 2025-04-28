"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CnRedirect() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', 'zh');
      router.replace('/');
    }
  }, [router]);
  return null;
} 