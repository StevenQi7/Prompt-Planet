import { generateMetadata } from '@/utils/metadata';
import AboutContent from '@/components/AboutContent';

export const metadata = generateMetadata('footer.aboutUs', 'footer.slogan');

export default function AboutPage() {
  return <AboutContent />;
} 