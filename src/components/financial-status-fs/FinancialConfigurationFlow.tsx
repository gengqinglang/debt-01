import React from 'react';
import FSDebtConfiguration from './FSDebtConfiguration';
import AssetConfiguration from '../financial-status/AssetConfiguration';


interface FinancialConfigurationFlowProps {
  currentStep: number;
  currentIndex: number;
  currentCategory: any;
  allCategories: any[];
  configConfirmed: {[key: string]: boolean};
  onConfigConfirm: (categoryId: string, data: any) => void;
  onDataChange?: (categoryId: string, liveData: any) => void; // 新增实时数据回调
  onSkip: () => void;
  existingData?: any;
}

const FinancialConfigurationFlow: React.FC<FinancialConfigurationFlowProps> = ({
  currentStep,
  currentIndex,
  currentCategory,
  allCategories,
  configConfirmed,
  onConfigConfirm,
  onDataChange,
  onSkip,
  existingData
}) => {
  const isCurrentCategoryConfirmed = configConfirmed[currentCategory?.id];

  return (
    <div className="flex-1 flex flex-col">

      {/* 配置内容 */}
      <div className="flex-1 py-1 overflow-y-auto pb-28" style={{ scrollbarGutter: 'stable both-edges' }}>
        <div className="max-w-2xl mx-auto mt-4">
          {/* 标题部分 */}
          <div className="text-center mb-3">
            <h2 className="text-xl font-bold text-gray-900">{currentCategory?.name}信息</h2>
          </div>

          {/* 配置表单 */}
          {currentStep === 1 ? (
            <FSDebtConfiguration
              category={currentCategory}
              onConfirm={onConfigConfirm}
              onDataChange={onDataChange}
              isConfirmed={isCurrentCategoryConfirmed}
              existingData={existingData}
            />
          ) : (
            <AssetConfiguration
              category={currentCategory}
              onConfirm={onConfigConfirm}
              isConfirmed={isCurrentCategoryConfirmed}
              existingData={existingData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialConfigurationFlow;