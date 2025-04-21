'use client';

import React from 'react';

interface DefaultAvatarProps {
  username: string;
  size?: number;
  className?: string;
}

/**
 * 生成基于用户名的默认头像组件
 * 根据用户名生成固定的背景色和首字母
 */
export default function DefaultAvatar({ username, size = 40, className = '' }: DefaultAvatarProps) {
  // 生成基于用户名的固定颜色
  const getColorFromUsername = (name: string) => {
    // 颜色列表
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
    ];
    
    // 基于用户名计算一个固定的索引
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // 取模获取颜色索引
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };
  
  // 获取用户名的首字母或第一个字符
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };
  
  const colorClass = getColorFromUsername(username);
  const initials = getInitials(username);
  
  return (
    <div 
      className={`rounded-full flex items-center justify-center text-white font-medium ${colorClass} ${className}`}
      style={{ width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.5}px` }}
    >
      {initials}
    </div>
  );
} 