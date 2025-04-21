import AdminReview from '@/components/AdminReview';
import { generateMetadata } from '@/utils/metadata';

export const metadata = generateMetadata('admin.reviewTitle', 'admin.reviewSubtitle');

export default function AdminReviewPage() {
  return (
    <main className="bg-gray-50 min-h-screen pb-10">
      <AdminReview />
    </main>
  );
} 