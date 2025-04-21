import { generateMetadata } from '@/utils/metadata';
import ContactContent from '@/components/ContactContent';

export const metadata = generateMetadata('footer.contact', 'contact.subtitle');

export default function ContactPage() {
  return <ContactContent />;
} 