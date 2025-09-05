import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, ArrowRight, PiggyBank, Building, TrendingUp, Calendar, Clock } from 'lucide-react';

interface MortgageTool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
  disabled?: boolean;
}

const mortgageTools: MortgageTool[] = [
  {
    id: 'prepayment',
    title: '提前还款测算',
    description: '计算提前还款能节省多少利息，帮您做出最优决策',
    icon: <PiggyBank className="w-5 h-5" />,
    route: '/tiqianhuankuan2',
    color: 'bg-[#CAF4F7]/30 border-[#CAF4F7] text-gray-700'
  },
  {
    id: 'commercial-to-provident',
    title: '商贷转公积金测算',
    description: '评估商业贷款转公积金贷款的省息效果',
    icon: <Building className="w-5 h-5" />,
    route: '/shangzhuan-gongjijin',
    color: 'bg-gray-50/50 border-gray-200/50 text-gray-400',
    disabled: true
  },
  {
    id: 'fixed-to-floating',
    title: '固定转浮动利率测算',
    description: '对比固定利率与浮动利率的长期成本差异',
    icon: <TrendingUp className="w-5 h-5" />,
    route: '/guding-zhuan-fudong',
    color: 'bg-gray-50/50 border-gray-200/50 text-gray-400',
    disabled: true
  },
  {
    id: 'payment-method',
    title: '更改还款方式测算',
    description: '比较等额本息与等额本金的还款差异',
    icon: <Calculator className="w-5 h-5" />,
    route: '/biangeng-fangshi',
    color: 'bg-gray-50/50 border-gray-200/50 text-gray-400',
    disabled: true
  },
  {
    id: 'extend-period',
    title: '延长还款期限测算',
    description: '测算延长贷款期限对月供和总利息的影响',
    icon: <Clock className="w-5 h-5" />,
    route: '/yanqi-huankuan',
    color: 'bg-gray-50/50 border-gray-200/50 text-gray-400',
    disabled: true
  }
];

const MortgageToolsSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">更多贷款测算工具</h2>
        <p className="text-sm text-gray-600">专业房贷测算工具，帮您优化贷款方案</p>
      </div>
      
      <div className="grid gap-3">
        {mortgageTools.map((tool) => (
          <Card 
            key={tool.id}
            className={`${tool.color} ${tool.disabled ? 'cursor-not-allowed' : 'cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]'}`}
            onClick={() => !tool.disabled && navigate(tool.route)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${tool.disabled ? 'bg-gray-50' : 'bg-white/70'}`}>
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-sm">{tool.title}</h3>
                      {tool.disabled && (
                        <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
                          功能待上线
                        </span>
                      )}
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed">{tool.description}</p>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 flex-shrink-0 ml-2 ${tool.disabled ? 'opacity-30' : 'opacity-60'}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MortgageToolsSection;