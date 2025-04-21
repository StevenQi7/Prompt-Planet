import React from 'react';
import Favorites from '@/components/Favorites';
import { generateMetadata } from '@/utils/metadata';

export const metadata = generateMetadata('favorites.title', 'favorites.subtitle');

export default function FavoritesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Favorites />
    </main>
  );
} 