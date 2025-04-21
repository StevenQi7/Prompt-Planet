import React from 'react';
import Register from '@/components/Auth/Register';
import { generateMetadata } from '@/utils/metadata';

export const metadata = generateMetadata('auth.registerTitle', 'auth.registerSubtitle');

export default function RegisterPage() {
  return (
    <div className="bg-gray-50 flex-grow flex pt-6">
      <Register />
    </div>
  );
} 