import React from 'react';
import { generateMetadata } from '@/utils/metadata';
import EditPrompt from '@/components/EditPrompt';

export const metadata = generateMetadata('profile.editPrompt', 'profile.editPromptDesc');

export default async function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
  // 等待params解析完成
  const { id } = await params;
  
  return (
    <main className="min-h-screen bg-gray-50">
      <EditPrompt promptId={id} />
    </main>
  );
} 