import { generateMetadata } from '@/utils/metadata';
import LoginPageClient from './page.client';

export const metadata = generateMetadata('auth.title', 'auth.subtitle');

export default function LoginPage() {
  return <LoginPageClient />;
} 