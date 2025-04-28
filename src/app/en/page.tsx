"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EnRedirect() {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', 'en');
      router.replace('/');
    }
  }, [router]);
  return null;
} 