import React from 'react';
import { useNavigate } from 'react-router-dom';

export const OptimizationSuggestionsModule: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-foreground">优化建议与实战案例分析</h3>
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      
      {/* 优化建议 */}
      <div className="mb-6">
        <div className="p-3 rounded-lg border" style={{ backgroundColor: '#CAF4F7', borderColor: '#CAF4F7' }}>
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-medium">优化建议：</span>
            根据现金流分析，您可以考虑在现金充裕时期进行提前还款，有效减少利息支出，优化整体财务结构。
          </p>
        </div>
      </div>
      
      {/* 提前还款案例分析 */}
      <div className="space-y-6">
        <h4 className="text-base font-semibold text-foreground flex items-center">
          <span className="mr-2">📖</span>
          提前还款实战案例分析
        </h4>
        
        <div className="space-y-4">
          {/* 案例一 */}
          <div className="border-l-4 pl-4 py-2" style={{ borderColor: '#CAF4F7' }}>
            <h5 className="font-medium text-foreground mb-2">案例一：年终奖提前还房贷</h5>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>背景：</strong>张先生30岁，房贷余额280万，利率4.9%，剩余25年。年终奖到手50万。</p>
              <p><strong>操作：</strong>用45万提前还款（保留5万应急资金）</p>
              <p><strong>效果：</strong>节省利息约65万，还款期缩短至18年，月供从1.6万降至1.2万</p>
              <p className="font-medium" style={{ color: '#01BCD6' }}>总收益：每月减负4000元 + 节省65万利息</p>
            </div>
          </div>

          {/* 案例二 */}
          <div className="border-l-4 pl-4 py-2" style={{ borderColor: '#CAF4F7' }}>
            <h5 className="font-medium text-foreground mb-2">案例二：分期提前还款策略</h5>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>背景：</strong>李女士35岁，房贷余额180万，利率5.1%，剩余20年。每年结余30万。</p>
              <p><strong>策略：</strong>连续3年每年提前还款25万</p>
              <p><strong>效果：</strong>总还款期从20年缩短至12年，累计节省利息约45万</p>
              <p className="font-medium" style={{ color: '#01BCD6' }}>优势：既保持流动性，又最大化节息效果</p>
            </div>
          </div>

          {/* 案例三 */}
          <div className="border-l-4 pl-4 py-2" style={{ borderColor: '#CAF4F7' }}>
            <h5 className="font-medium text-foreground mb-2">案例三：投资收益vs提前还款</h5>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>背景：</strong>王先生手持100万现金，房贷利率4.8%，考虑投资还是还贷。</p>
              <p><strong>分析：</strong>理财收益3.5% &lt; 房贷利率4.8%，选择提前还款</p>
              <p><strong>结果：</strong>相当于获得4.8%的无风险收益，比理财多赚1.3%</p>
              <p className="font-medium" style={{ color: '#01BCD6' }}>关键：当贷款利率高于投资收益时，提前还款是最优选择</p>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* 提前还款测算入口 */}
      <div className="mt-4">
        <button 
          className="w-full py-3 px-4 rounded-lg font-medium text-black transition-colors" 
          style={{ backgroundColor: '#B3EBEF' }}
          onClick={() => {
            navigate('/tiqianhuankuan2');
            window.scrollTo(0, 0);
          }}
        >
          进入提前还款测算
        </button>
      </div>
    </div>
  );
};