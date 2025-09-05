import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingDown, Calculator, DollarSign, Target, Shield, Star } from 'lucide-react';

const WealthNavigationPage = () => {
  const navigate = useNavigate();

  const handleStartOptimization = () => {
    navigate('/wealth-journey-launch');
  };

  const benefits = [
    {
      icon: TrendingDown,
      title: "节省利息支出",
      descriptions: ["科学规划还款方案，减少利息负担", "智能分析您的债务结构", "精准计算节省金额"]
    },
    {
      icon: Calculator,
      title: "债务重组优化", 
      descriptions: ["合理调整债务结构，降低还款压力", "提供多种优化方案对比"]
    },
    {
      icon: Target,
      title: "个性化方案",
      descriptions: ["根据您的实际情况，制定专属优化策略", "制定可执行的还款计划"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12">
        <div className="text-center mb-12">
          {/* 主标题 */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-3 leading-tight">
              债务优化助手
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              帮您摆脱债务困境，节省利息支出
            </p>
          </div>

          {/* 核心价值点 */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div
                  key={index}
                  className="backdrop-blur-sm rounded-xl p-4 text-left hover:shadow-md transition-all duration-300"
                  style={{
                    backgroundColor: index === 0 ? 'rgba(179, 235, 239, 0.6)' : index === 1 ? 'rgba(204, 233, 181, 0.6)' : 'rgba(255, 234, 150, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: 'rgba(1, 188, 214, 0.1)'
                      }}
                    >
                      <IconComponent className="h-5 w-5" style={{ color: '#01BCD6' }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2 text-black">
                        {benefit.title}
                      </h3>
                      <div className="space-y-1">
                        {benefit.descriptions.map((desc, descIndex) => (
                          <p key={descIndex} className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                            {desc}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>


          {/* 使用场景提示 */}
          <p className="text-base text-muted-foreground mb-6 leading-relaxed">
            适用于房贷、车贷、信用卡债务等各类贷款的优化方案分析，帮您找到最省钱的还款策略
          </p>
        </div>

        {/* 开始按钮 */}
        <div>
          <Button 
            onClick={handleStartOptimization}
            size="lg"
            className="w-full h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group"
            style={{
              backgroundColor: '#01BCD6',
              color: 'white'
            }}
          >
            开始债务优化分析
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <p className="text-xs text-muted-foreground text-center mt-3">
            免费分析 • 专业建议 • 保护隐私
          </p>
        </div>
      </div>

    </div>
  );
};

export default WealthNavigationPage;