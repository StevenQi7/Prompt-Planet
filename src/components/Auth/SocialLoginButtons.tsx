import React from 'react';
import { Button } from '@/components/UI/button';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { createClient } from '@/lib/supabase';

const SocialLoginButtons: React.FC = () => {
  const { t } = useLanguage();

  const signInWithGithub = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || t('auth.githubLoginError'));
    }
  };

  const signInWithGoogle = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || t('auth.googleLoginError'));
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <Button
        variant="outline"
        className="w-full bg-[#24292e] hover:bg-[#1c2127] text-white border-transparent"
        onClick={signInWithGithub}
      >
        <FaGithub className="mr-2 h-5 w-5" />
        {t('auth.loginWithGithub')}
      </Button>
      <Button
        variant="outline"
        className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
        onClick={signInWithGoogle}
      >
        <FcGoogle className="mr-2 h-5 w-5" />
        {t('auth.loginWithGoogle')}
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-500">{t('auth.orUseEmail')}</span>
        </div>
      </div>
    </div>
  );
};

export default SocialLoginButtons; 