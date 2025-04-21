import { generateMetadata } from '@/utils/metadata';
import TermsContent from '@/components/TermsContent';

export const metadata = generateMetadata('footer.terms', 'terms.title');

export default function TermsPage() {
  return <TermsContent />;
} 