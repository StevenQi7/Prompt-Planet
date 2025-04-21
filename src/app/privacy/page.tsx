import { generateMetadata } from '@/utils/metadata';
import PrivacyContent from '@/components/PrivacyContent';

export const metadata = generateMetadata('footer.privacy', 'privacy.title');

export default function PrivacyPage() {
  return <PrivacyContent />;
} 