
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigationState } from '@/hooks/useNavigationState';

const AdjustmentSolutionPage = () => {
  const { navigateBack } = useNavigationState();

  const handleBack = () => {
    console.log('[AdjustmentSolutionPage] Navigating back');
    navigateBack();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 返回按钮 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回</span>
        </Button>
      </div>

      {/* 图片展示区域 */}
      <div className="px-4 py-2">
        <img 
          src="/lovable-uploads/ae6d72ce-cff5-4aa8-9229-5cea59828c59.png" 
          alt="调缺方案"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default AdjustmentSolutionPage;
