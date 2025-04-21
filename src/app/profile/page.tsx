'use client';

import ProfileContent from '@/components/profile/ProfileContent';
import { Toaster } from 'react-hot-toast';

export default function ProfilePage() {
  return (
    <>
      <Toaster position="top-center" />
      <ProfileContent />
    </>
  );
} 