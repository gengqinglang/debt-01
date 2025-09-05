import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, TrendingUp, Calculator, Target, AlertTriangle, CheckCircle, Stethoscope, Search } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartDiagnosis = () => {
    navigate('/wealth-journey-launch');
  };

  const features = [
    {
      icon: Shield,
      title: '债务体质诊断',
      description: '评估偿债期内外的还款能力，识别财务风险等级'
    },
    {
      icon: Calculator,
      title: '精准定位问题债务',
      description: '识别哪些债务无力偿还，具体在哪些年份出现风险'
    },
    {
      icon: AlertTriangle,
      title: '家庭大事影响分析',
      description: '分析债务风险对买房、教育、养老等重要规划的影响'
    },
    {
      icon: Target,
      title: '专属债务诊断报告',
      description: '深度诊断偿债风险，精准定位问题债务'
    }
  ];

  const benefits = [
    '科学评估债务承受能力',
    '提前识别财务风险信号',
    '精准定位问题债务时间点',
    '分析债务对重要人生规划的影响'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#2E4E5F] mb-4">
            偿债风险诊断
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-[#01BCD6]" />
            <span className="font-medium text-[#01BCD6]">仅需3分钟，获取专业的债务风险评估报告</span>
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
                  专属债务诊断报告
                </h2>
              </div>
              <p className="text-base text-[#5A7D9A]">深度诊断偿债风险，精准定位问题债务</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white backdrop-blur-sm rounded-2xl p-4 border border-white/80 hover:bg-white/95 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#CAF4F7]/40 rounded-xl">
                    <Stethoscope className="w-5 h-5 text-[#2E4E5F]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2E4E5F] mb-1">债务体质诊断</h3>
                    <p className="text-sm text-[#5A7D9A] leading-relaxed">
                      评估偿债期内外的还款能力，识别财务风险等级
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white backdrop-blur-sm rounded-2xl p-4 border border-white/80 hover:bg-white/95 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#CAF4F7]/40 rounded-xl">
                    <Search className="w-5 h-5 text-[#2E4E5F]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2E4E5F] mb-1">精准定位问题债务</h3>
                    <p className="text-sm text-[#5A7D9A] leading-relaxed">
                      识别哪些债务无力偿还，具体在哪些年份出现风险
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white backdrop-blur-sm rounded-2xl p-4 border border-white/80 hover:bg-white/95 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#CAF4F7]/40 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-[#2E4E5F]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2E4E5F] mb-1">家庭大事影响分析</h3>
                    <p className="text-sm text-[#5A7D9A] leading-relaxed">
                      分析债务风险对买房、教育、养老等重要规划的影响
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
              <h3 className="font-semibold text-[#2E4E5F] mb-2">风险提示</h3>
              <p className="text-[#5A7D9A] text-sm">
                债务风险往往具有隐蔽性和累积性，早期识别和预防是避免财务危机的关键。
                我们的系统能够帮助您及时发现潜在风险，制定有效的应对策略。
              </p>
            </div>
          </div>
        </Card>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            onClick={handleStartDiagnosis}
            size="lg"
            className="w-full mt-2 bg-[#CAF4F7] hover:bg-[#A8E6E9] text-[#2E4E5F] px-12 py-7 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            开启偿债风险诊断
          </Button>
        </div>
    </div>
  );
};

export default LandingPage;