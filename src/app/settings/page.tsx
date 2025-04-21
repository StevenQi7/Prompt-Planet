import React from 'react';
import SettingsPage from '@/components/Settings/SettingsPage';
import { generateMetadata } from '@/utils/metadata';

export const metadata = generateMetadata('settings.title', 'settings.subtitle');

export default function Settings() {
  return (
    <div className="bg-gray-50 flex-grow flex pt-6">
      <SettingsPage />
    </div>
  );
} 