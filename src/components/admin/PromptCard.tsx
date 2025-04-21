import React from 'react';
import Image from 'next/image';
import { FaCheck, FaTimes, FaAlignLeft, FaTags, FaImage, FaCommentAlt } from 'react-icons/fa';
import { Prompt } from '@/utils/adminUtils';

interface PromptCardProps {
  prompt: Prompt;
  reviewNotes: string;
  onNotesChange: (notes: string) => void;
  onApprove: () => void;
  onReject: () => void;
  getT: (key: string) => string;
}

const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  reviewNotes,
  onNotesChange,
  onApprove,
  onReject,
  getT
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-3 flex-wrap">
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                prompt.status === 'reviewing' 
                  ? 'bg-indigo-100 text-indigo-800' 
                  : prompt.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
              }`}>
                {prompt.status === 'reviewing' 
                  ? getT('admin.pending') 
                  : prompt.status === 'published'
                    ? getT('admin.approved')
                    : getT('admin.rejected')}
              </span>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {prompt.category.displayName || prompt.category.name}
              </span>
              <span className="text-gray-400 text-xs">ID: #{prompt.id}</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 break-words max-w-[80%]">
              {prompt.title}
            </h3>
            <div className="flex items-center space-x-4 flex-wrap">
              <div className="flex items-center text-gray-500 text-sm">
                <span>{prompt.author.nickname || prompt.author.username}</span>
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <span>
                  {getT('admin.submittedAt')} {new Date(prompt.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          {prompt.status === 'reviewing' && (
            <div className="flex space-x-2">
              <button 
                onClick={onApprove}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center whitespace-nowrap"
              >
                <FaCheck className="mr-1" />
                {getT('admin.approve')}
              </button>
              <button 
                onClick={onReject}
                className="bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center whitespace-nowrap"
              >
                <FaTimes className="mr-1" />
                {getT('admin.reject')}
              </button>
            </div>
          )}
          
          {prompt.status !== 'reviewing' && prompt.reviews && prompt.reviews.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-500">
                <span className="font-medium">{getT('admin.reviewedBy')}: </span>
                {prompt.reviews[0].reviewer ? 
                  (prompt.reviews[0].reviewer.nickname || prompt.reviews[0].reviewer.username || getT('admin.unknownReviewer')) 
                  : getT('admin.unknownReviewer')}
              </div>
              {prompt.reviews[0].notes && (
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">{getT('admin.reviewNotes')}: </span>
                  {prompt.reviews[0].notes}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 bg-gray-50">
        {/* 提示词内容 */}
        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
          <FaAlignLeft className="text-indigo-500 mr-2" />
          {getT('admin.promptContent')}
        </h4>
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 hover:border-indigo-300 transition-all duration-300">
          <p className="text-gray-700 whitespace-pre-line">{prompt.content}</p>
        </div>

        {/* 标签展示 */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-3 flex items-center">
            <FaTags className="text-indigo-500 mr-2" />
            {getT('admin.tags')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag, index) => (
              <span key={index} className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full">
                {tag.tag.displayName || tag.tag.name}
              </span>
            ))}
            {prompt.tags.length === 0 && (
              <span className="text-gray-500 text-sm">无标签</span>
            )}
          </div>
        </div>

        {/* 效果图展示 */}
        {prompt.images && prompt.images.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <FaImage className="text-indigo-500 mr-2" />
              {getT('admin.previewImages')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prompt.images.map((image, index) => (
                <div key={index} className="relative w-full h-auto">
                  <Image
                    src={image}
                    alt={`${prompt.title} - 预览图 ${index + 1}`}
                    width={500}
                    height={500}
                    style={{ objectFit: 'contain' }}
                    className="rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 审核备注 */}
        {prompt.status === 'reviewing' && (
          <div>
            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
              <FaCommentAlt className="text-indigo-500 mr-2" />
              {getT('admin.reviewNotes')}
            </h4>
            <textarea 
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300" 
              rows={3} 
              placeholder={getT('admin.reviewNotesPlaceholder')}
              value={reviewNotes}
              onChange={(e) => onNotesChange(e.target.value)}
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptCard; 