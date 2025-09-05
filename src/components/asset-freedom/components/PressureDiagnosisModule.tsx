import React from 'react';
import FinancialHealthOverview from '@/components/asset-freedom/components/FinancialHealthOverview';

interface PressureDiagnosisModuleProps {
  showTitle?: boolean;
  showWarningTip?: boolean;
  isMember?: boolean;
  onInteractionAttempt?: () => void;
}

const PressureDiagnosisModule: React.FC<PressureDiagnosisModuleProps> = ({
  showTitle = true,
  showWarningTip = true,
  isMember = true,
  onInteractionAttempt
}) => {
  const demoData = {
    conclusion: "有债务压力",
    cashFlowGap: {
      years: "15年",
      amount: "578万"
    }
  };

  return (
    <div className="space-y-4">
      {/* 标题（可选） */}
      {showTitle && (
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white font-medium text-xs"
               style={{ backgroundColor: '#01BCD6' }}>
            1
          </div>
          <h2 className="text-lg font-semibold text-slate-800">
            压力诊断分析
          </h2>
        </div>
      )}
      
      {/* 示意数据提醒卡片（可选） */}
      {showWarningTip && (
        <div className="p-4 rounded-lg border border-orange-200 mb-6" style={{ backgroundColor: '#FEF3E2' }}>
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 mt-0.5">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V14M12 18H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.55 21H20.45A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" 
                      stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-medium text-orange-700 mb-1">
                温馨提示：下方所有数据均为示意展示
              </div>
              <div className="text-xs text-orange-600">
                点击页面下方按钮，获取您的专属债务优化方案
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 债务压力警告提示 */}
      <div className="p-4 rounded-xl bg-red-50 border border-red-200">
        {/* 警告标题 */}
        <div className="flex items-center mb-4">
          <div className="w-4 h-4 mr-2">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V14M12 18H12.01M10.29 3.86L1.82 18A2 2 0 0 0 3.55 21H20.45A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" 
                    stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="text-sm font-medium text-red-600">
            提醒您存在债务压力，可能影响未来生活
          </div>
        </div>
        
        {/* 关键数据展示 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">未来有现金流缺口年份</div>
            <div className="text-xl font-bold text-red-600">
              {demoData.cashFlowGap.years}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">未来现金流缺口总额</div>
            <div className="text-xl font-bold text-red-600">
              {demoData.cashFlowGap.amount}
            </div>
          </div>
        </div>
      </div>
      
      {/* 现金流预测图展示区域 - 使用新的FinancialHealthOverview组件 */}
      <div>
        <FinancialHealthOverview 
          pageMode={isMember ? 'member-severe-shortage' : 'public-severe-shortage'}
          onInteractionAttempt={onInteractionAttempt || (() => {
            alert('这是演示功能，开通会员后可体验完整功能');
          })}
        />
        <div className="text-xs text-gray-500 mt-2 text-center">点击图中年份，查看详情</div>
      </div>
    </div>
  );
};

export default PressureDiagnosisModule;