import React from 'react';
import CreatePrompt from '@/components/CreatePrompt';
import { generateMetadata } from '@/utils/metadata';

export const metadata = generateMetadata('createPromptPage.createPrompt', 'createPromptPage.subtitle');

export default function CreatePromptPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <CreatePrompt />
    </main>
  );
} 