import React from 'react';
import { ArrowRight, Calculator, TrendingDown, Shield, Sparkles, Zap, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const GongjuPage: React.FC = () => {
  const tools = [
    {
      id: 'early-payment',
      title: '提前还款',
      description: '智能计算提前还款收益，最大化节省利息支出',
      icon: TrendingDown,
      route: '/tiqianhuankuan1'
    },
    {
      id: 'rate-conversion', 
      title: '固定利率转浮动利率',
      description: '精准对比固浮利率差异，选择最优利率模式',
      icon: Zap,
      route: '/gudingzhuanfudong'
    },
    {
      id: 'loan-conversion',
      title: '商业贷款转公积金贷款',
      description: '专业测算商转公节省效果，优化贷款结构',
      icon: Target,
      route: '/shangzhuangong'
    },
    {
      id: 'payment-method',
      title: '变更还款方式',
      description: '深度比较等额本息与等额本金还款模式',
      icon: Calculator,
      route: '/biangengfangshi'
    },
    {
      id: 'deferred-payment',
      title: '延期还款',
      description: '分析延期还款可行性，制定缓解资金压力方案',
      icon: Shield,
      route: '/yanqihuankuan'
    },
    {
      id: 'loan-replacement',
      title: '贷款置换',
      description: '通过专业置换策略，显著降低综合融资成本',
      icon: Sparkles,
      route: '/zhihuan'
    }
  ];

  const navigate = useNavigate();

  const handleToolClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen">{/* Removed gray background */}
      {/* Subtle decoration with CAF4F7 accent */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-8 w-32 h-32 rounded-full blur-xl" style={{ backgroundColor: '#CAF4F7', opacity: 0.3 }}></div>
        <div className="absolute bottom-32 right-6 w-24 h-24 rounded-full blur-lg" style={{ backgroundColor: '#CAF4F7', opacity: 0.2 }}></div>
      </div>

      {/* Compact Header Section */}
      <div className="relative overflow-hidden">
        <div className="px-6 pt-8 pb-4">
          <div className="text-center space-y-3">
            {/* Compact title */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                房贷优化工具箱
              </h1>
              <p className="text-foreground/70 leading-relaxed max-w-sm mx-auto text-sm">
                选择工具，一键测算，优化您的房贷方案
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid Section */}
      {tools.map((tool, index) => {
          const IconComponent = tool.icon;
          return (
            <div className="px-2 mb-2 max-w-md mx-auto" key={tool.id}>
              <Card 
                className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border border-gray-100"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              onClick={() => handleToolClick(tool.route)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Compact icon with CAF4F7 accent */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300" style={{ backgroundColor: '#CAF4F7', opacity: 0.8 }}>
                      <IconComponent className="w-5 h-5 text-foreground" />
                    </div>
                    
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold text-foreground">
                        {tool.title}
                      </CardTitle>
                    </div>
                  </div>
                  
                  {/* Compact arrow with subtle CAF4F7 background */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300" style={{ backgroundColor: '#CAF4F7', opacity: 0.4 }}>
                    <ArrowRight className="w-4 h-4 text-foreground group-hover:translate-x-0.5 transition-all duration-300" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <CardDescription className="text-sm text-foreground/70 leading-relaxed">
                  {tool.description}
                </CardDescription>
                </CardContent>
              </Card>
            </div>
          );
        })}
    </div>
  );
};

export default GongjuPage;