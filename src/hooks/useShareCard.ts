import { useState } from 'react';

/**
 * 分享卡片功能的公共Hook
 * 提供统一的分享状态管理
 */
export const useShareCard = () => {
  const [showShareCard, setShowShareCard] = useState(false);

  const openShareCard = () => setShowShareCard(true);
  const closeShareCard = () => setShowShareCard(false);

  return {
    showShareCard,
    openShareCard,
    closeShareCard
  };
};