import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calculator, TrendingDown, PiggyBank, Target, AlertTriangle, CheckCircle, Coins, BarChart3 } from 'lucide-react';

const TqShouyePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartCalculation = () => {
    navigate('/tiqianhuankuan1');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#2E4E5F] mb-4">
            提前还款测算工具
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-[#01BCD6]" />
            <span className="font-medium text-[#01BCD6]">仅需3分钟，获取专业的提前还款方案建议</span>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-6">
          <div className="bg-[#CAF4F7]/40 backdrop-blur-xl rounded-3xl p-6 border border-[#CAF4F7]/30 shadow-2xl shadow-[#CAF4F7]/20">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="p-2 bg-[#CAF4F7]/30 rounded-full">
                  <Target className="w-6 h-6 text-[#2E4E5F]" />
                </div>
                <h2 className="text-xl font-bold text-[#2E4E5F]">
                  智能提前还款分析
                </h2>
              </div>
              <p className="text-base text-[#5A7D9A]">科学测算提前还款收益，制定最优还款策略</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white backdrop-blur-sm rounded-2xl p-4 border border-white/80 hover:bg-white/95 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#CAF4F7]/40 rounded-xl">
                    <Calculator className="w-5 h-5 text-[#2E4E5F]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2E4E5F] mb-1">精准测算节省成本</h3>
                    <p className="text-sm text-[#5A7D9A] leading-relaxed">
                      计算提前还款可节省的利息成本，量化投资回报率
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white backdrop-blur-sm rounded-2xl p-4 border border-white/80 hover:bg-white/95 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#CAF4F7]/40 rounded-xl">
                    <TrendingDown className="w-5 h-5 text-[#2E4E5F]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2E4E5F] mb-1">月供优化方案</h3>
                    <p className="text-sm text-[#5A7D9A] leading-relaxed">
                      对比"减少月供"和"缩短期限"两种方案的优劣势
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white backdrop-blur-sm rounded-2xl p-4 border border-white/80 hover:bg-white/95 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#CAF4F7]/40 rounded-xl">
                    <BarChart3 className="w-5 h-5 text-[#2E4E5F]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2E4E5F] mb-1">现金流影响分析</h3>
                    <p className="text-sm text-[#5A7D9A] leading-relaxed">
                      分析提前还款对未来现金流和家庭财务的长期影响
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Warning */}
        <Card className="p-6 mb-8 bg-[#FEF3C7]/40 border-[#FEF3C7]/80">
          <div className="flex items-start gap-3">
            <div>
              <h3 className="font-semibold text-[#2E4E5F] mb-2">决策提示</h3>
              <p className="text-[#5A7D9A] text-sm">
                提前还款并非总是最优选择，需要综合考虑机会成本、流动性需求和风险偏好。
                我们的工具将帮助您科学评估，做出最适合您财务状况的决策。
              </p>
            </div>
          </div>
        </Card>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            onClick={handleStartCalculation}
            size="lg"
            className="w-full mt-2 bg-[#CAF4F7] hover:bg-[#A8E6E9] text-[#2E4E5F] px-12 py-7 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            开始提前还款测算
          </Button>
        </div>
    </div>
  );
};

export default TqShouyePage;