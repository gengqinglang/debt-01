import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { InlineCashFlowChart } from './InlineCashFlowChart';
import FinancialOverviewTabs from './FinancialOverviewTabs';
import RiskAssessmentNotice from './RiskAssessmentNotice';

interface DebtItem {
  id: string;
  type: '栖海云颂' | '幸福里' | '保利罗兰' | '尚正一品' | '富华里' | '车贷' | '消费贷' | '信用卡';
  remainingPrincipal: number;
  paidInterest: number;
  remainingInterest: number;
}

// 模拟债务数据（仅保留需要用到的字段）
const mockDebtData: DebtItem[] = [
  {
    id: '2',
    type: '幸福里',
    remainingPrincipal: 200000,
    paidInterest: 45000,
    remainingInterest: 35000,
  },
  {
    id: '1',
    type: '栖海云颂',
    remainingPrincipal: 2500000,
    paidInterest: 120000,
    remainingInterest: 1180000,
  }
];

const DebtAnalysisModule: React.FC = () => {
  const navigate = useNavigate();
  const totalDebt = mockDebtData.reduce((sum, debt) => sum + debt.remainingPrincipal, 0);
  const totalInterest = mockDebtData.reduce((sum, debt) => sum + debt.remainingInterest, 0);
  const totalPaidInterest = mockDebtData.reduce((sum, debt) => sum + debt.paidInterest, 0);

  // Calculate actual debt period based on loan data
  const debtPeriods = [
    { start: 28, end: 58 }, // 栖海云颂
    { start: 28, end: 33 }, // 幸福里
    { start: 28, end: 31 }  // 车贷
  ];
  
  const debtStartAge = Math.min(...debtPeriods.map(p => p.start));
  const debtEndAge = Math.max(...debtPeriods.map(p => p.end));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div className="w-8 h-8"></div> {/* 占位符保持居中 */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">偿债能力分析</h2>
          <div className="text-xs text-gray-500 mt-1">
            更新时间: {new Date().toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit', 
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })}
          </div>
        </div>
        <Avatar 
          className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={() => navigate('/personal-center')}
        >
          <AvatarFallback className="bg-[#B3EBEF] text-gray-600">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      </div>

      {/* 财务总览 */}
      <FinancialOverviewTabs />

      {/* 偿债风险 */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">偿债风险评估</h3>
        <div className="p-4 border border-destructive/30 rounded-lg bg-white">
          {/* 客户债务体质 */}
          <div className="text-center mb-4 px-0">
            <div className="inline-flex items-center px-8 py-1 rounded-full bg-red-100 border border-red-200">
              <span className="text-sm font-medium text-red-700">债务体质：撑不住型</span>
            </div>
          </div>
          
          {/* 债务描述 */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 text-center leading-relaxed">
              无论当初借贷的初衷如何，现实是它正在侵蚀您的财务健康，拖累家庭生活品质。
            </p>
          </div>

          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 rounded" style={{ backgroundColor: 'rgba(255, 127, 80, 0.3)' }}>
              <div className="text-lg font-bold text-destructive mb-1">3年</div>
              <p className="text-xs text-muted-foreground">断供年数</p>
            </div>
            <div className="text-center p-2 rounded" style={{ backgroundColor: 'rgba(255, 127, 80, 0.3)' }}>
              <div className="text-lg font-bold text-destructive mb-1">39岁</div>
              <p className="text-xs text-muted-foreground">最早断供年龄</p>
            </div>
            <div className="text-center p-2 rounded" style={{ backgroundColor: 'rgba(255, 127, 80, 0.3)' }}>
              <div className="text-lg font-bold text-destructive mb-1">8年</div>
              <p className="text-xs text-muted-foreground">债务期外有缺口</p>
            </div>
          </div>
        </div>
        {/* 现金流对比图表 */}
        <InlineCashFlowChart 
          isExpanded={true} 
          debtStartAge={debtStartAge}
          debtEndAge={debtEndAge}
        />
      </div>
      
      {/* 风险评估提醒 */}
      <div className="mt-4">
        <RiskAssessmentNotice />
      </div>

      {/* 重新测评按钮 */}
      <div className="mt-4">
        
        <button 
          onClick={() => navigate('/onboarding')}
          className="w-full py-3 px-4 rounded-lg font-medium transition-colors" 
          style={{ 
            backgroundColor: 'white', 
            borderColor: '#B3EBEF',
            color: '#01BCD6',
            border: '1px solid #B3EBEF'
          }}
        >
          重新做偿债风险测评
        </button>
      </div>
    </div>
  );
};

export default DebtAnalysisModule;
