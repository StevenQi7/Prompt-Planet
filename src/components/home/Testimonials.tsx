'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

/**
 * 用户见证内容结构
 */
interface Testimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  rating: number;
}

/**
 * 用户见证组件
 */
export default function Testimonials() {
  const { t, language } = useLanguage();
  
  // 创建初始化数据函数，根据当前语言返回适当的数据
  const getTestimonialsData = (): Testimonial[] => {
    return language === 'zh' ? [
      {
        id: 1,
        name: '陈瑞阳',
        title: 'UI设计师',
        content: 'Prompt星球上的提示词让我的设计工作效率提高了至少40%，尤其是AI绘画方面的提示词模板非常实用。',
        rating: 5
      },
      {
        id: 2,
        name: '王芳',
        title: '自媒体作者',
        content: '作为一名内容创作者，这里的写作提示词帮我解决了创作瓶颈，特别是在需要快速产出高质量内容的时候。',
        rating: 5
      },
      {
        id: 3,
        name: '张伟',
        title: '软件工程师',
        content: '平台上的代码优化提示词让我的编程工作事半功倍，特别是调试复杂问题时能够给出精准的解决思路。',
        rating: 5
      },
      {
        id: 4,
        name: '刘婧萱',
        title: '产品经理',
        content: '平台上的提示词分类清晰，质量有保证，帮助我更有效地使用AI工具进行产品规划和设计。',
        rating: 5
      }
    ] : [
      {
        id: 1,
        name: 'Mike Lee',
        title: 'UI Designer',
        content: t('testimonials.items.0.quote'),
        rating: 5
      },
      {
        id: 2,
        name: 'Fiona Wang',
        title: 'Content Creator',
        content: t('testimonials.items.1.quote'),
        rating: 5
      },
      {
        id: 3,
        name: 'William Zhang',
        title: 'Software Engineer',
        content: t('testimonials.items.2.quote'),
        rating: 5
      },
      {
        id: 4,
        name: 'Sarah Johnson',
        title: 'Product Manager',
        content: t('testimonials.items.3.quote'),
        rating: 5
      }
    ];
  };
  
  // 使用初始化函数设置初始状态
  const [testimonials, setTestimonials] = useState<Testimonial[]>(getTestimonialsData());
  
  // 当语言变更时更新数据
  useEffect(() => {
    setTestimonials(getTestimonialsData());
  }, [language, t]);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-3">{t('testimonials.title')}</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">{t('testimonials.subtitle')}</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md flex flex-col h-full"
            >
              <div className="text-indigo-500 mb-3">
                <FaQuoteLeft size={20} />
              </div>
              
              <p className="text-gray-700 mb-6 flex-grow italic">{testimonial.content}</p>
              
              <div className="border-t pt-4 mt-auto">
                <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                <p className="text-sm text-gray-600">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 