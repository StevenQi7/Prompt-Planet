'use client'

import { useState } from 'react'
import SocialLoginButtons from './Auth/SocialLoginButtons'
import EmailLoginForm from './Auth/EmailLoginForm'
import { Button } from '@/components/UI/button'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LoginButtons() {
  const { t } = useLanguage()
  const [showEmailForm, setShowEmailForm] = useState(false)

  return (
    <div className="flex flex-col gap-4 w-full">
      {!showEmailForm ? (
        <>
          <SocialLoginButtons />
          <Button 
            variant="outline" 
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
            onClick={() => setShowEmailForm(true)}
          >
            <i className="fas fa-envelope mr-2"></i>
            {t('auth.loginWithEmail')}
          </Button>
        </>
      ) : (
        <EmailLoginForm onBackClick={() => setShowEmailForm(false)} />
      )}
    </div>
  )
} 