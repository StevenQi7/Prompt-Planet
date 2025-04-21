import { Metadata } from 'next';
import { Suspense } from 'react';
import BrowseContent from '@/components/browse/BrowseContent';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

export default function BrowsePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]"><LoadingSpinner size="lg" /></div>}>
        <BrowseContent />
      </Suspense>
    </main>
  );
} 