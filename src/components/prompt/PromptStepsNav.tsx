import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

interface PromptStepsNavProps {
  currentStep: number;
  totalSteps: number;
  navigateToStep: (step: number) => void;
  showReturnLink?: boolean;
  returnPath?: string;
  returnText?: string;
}

const PromptStepsNav: React.FC<PromptStepsNavProps> = ({
  currentStep,
  totalSteps,
  navigateToStep,
  showReturnLink = true,
  returnPath = '/',
  returnText
}) => {
  const { t } = useLanguage();
  
  // 获取当前步骤的标题
  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return t('createPromptPage.step1');
      case 2:
        return t('createPromptPage.step2');
      case 3:
        return t('createPromptPage.step3');
      case 4:
        return t('createPromptPage.step4');
      case 5:
        return t('createPromptPage.step5');
      default:
        return '';
    }
  };
  
  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm p-4 sticky top-20 z-40">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {showReturnLink && (
            <Link href={returnPath} className="text-indigo-600 hover:text-indigo-800 mr-3 transition-colors duration-300">
              <i className="fas fa-arrow-left"></i>
              <span className="ml-1">{returnText || t('createPromptPage.returnToHome')}</span>
            </Link>
          )}
          <h2 className="ml-4 text-xl font-bold text-gray-800 hidden md:block">{t('createPromptPage.createPrompt')}</h2>
        </div>
        <div className="flex space-x-4">
          <div className="text-sm text-gray-500">
            {t('createPromptPage.step')} {currentStep} / {totalSteps}
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        {/* 进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          {/* 步骤标题显示 */}
          <h3 className="text-sm font-medium text-gray-700">
            {getStepTitle(currentStep)}
          </h3>
        </div>
        
        {/* 步骤按钮组 */}
        <div className="flex space-x-2">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isActiveStep = currentStep === stepNumber;
            const isDisabled = stepNumber > currentStep;
            
            return (
              <button 
                key={stepNumber}
                type="button" 
                className={`step-btn flex-1 py-2 px-4 ${
                  isActiveStep 
                    ? 'bg-indigo-100 text-indigo-700 font-medium' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } rounded-lg text-sm transition-colors duration-300 flex items-center justify-center ${
                  isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => !isDisabled && navigateToStep(stepNumber)}
                disabled={isDisabled}
              >
                {/* 步骤图标 */}
                <i className={`fas fa-${getStepIcon(stepNumber)} mr-1 ${
                  isActiveStep ? 'text-indigo-600' : 'text-gray-500'
                }`}></i> 
                {/* 步骤名称 - 在小屏幕上隐藏文字，只显示数字 */}
                <span className="hidden sm:inline">{getStepTitle(stepNumber)}</span>
                <span className="sm:hidden">{stepNumber}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 获取步骤对应图标
const getStepIcon = (step: number): string => {
  switch (step) {
    case 1:
      return 'info-circle'; // 基本信息
    case 2:
      return 'edit'; // 提示词内容
    case 3:
      return 'book'; // 使用说明
    case 4:
      return 'image'; // 效果展示
    case 5:
      return 'cog'; // 发布设置
    default:
      return 'circle';
  }
};

export default PromptStepsNav; 