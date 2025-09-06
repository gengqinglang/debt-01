import React, { lazy, Suspense, useEffect, useState } from 'react';
// 按需加载，避免首屏加载超大组件
const FSDebtConfiguration = lazy(() => import('./FSDebtConfiguration'));
const AssetConfiguration = lazy(() => import('../financial-status/AssetConfiguration'));


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

  // 延迟挂载重组件，避免首屏构建超时
  const [deferReady, setDeferReady] = useState(false);
  useEffect(() => {
    const handle: any = (window as any).requestIdleCallback
      ? (window as any).requestIdleCallback(() => setDeferReady(true), { timeout: 800 })
      : window.setTimeout(() => setDeferReady(true), 300);
    return () => {
      if ((window as any).cancelIdleCallback && typeof handle === 'number') {
        (window as any).cancelIdleCallback(handle);
      } else {
        clearTimeout(handle as number);
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col">

      {/* 配置内容 */}
      <div className="flex-1 py-1 overflow-y-auto pb-28" style={{ contentVisibility: 'auto', containIntrinsicSize: '1000px' }}>
        <div className="max-w-2xl mx-auto mt-4">
          {/* 标题部分 */}
          <div className="text-center mb-3">
            <h2 className="text-xl font-bold text-gray-900">{currentCategory?.name}信息</h2>
          </div>

          {/* 配置表单 */}
          {deferReady ? (
            <Suspense fallback={<div className="p-4 text-center text-gray-500">模块加载中…</div>}>
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
            </Suspense>
          ) : (
            <div className="p-4 text-center text-gray-500">模块准备中…</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialConfigurationFlow;