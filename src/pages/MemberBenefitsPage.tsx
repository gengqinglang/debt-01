
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Crown, 
  ArrowLeft, 
  ChevronDown, 
  TrendingUp, 
  Shield, 
  Wrench, 
  Target,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useMembership } from '@/components/membership/MembershipProvider';

const MemberBenefitsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setMembershipStatus } = useMembership();

  const goBack = () => {
    const state = location.state;
    if (state && state.returnPath) {
      navigate(state.returnPath, { 
        state: {
          activeTab: state.activeTab,
          activePlanningTab: state.activePlanningTab,
          activeRiskTab: state.activeRiskTab,
          activeToolsTab: state.activeToolsTab
        }
      });
    } else {
      navigate('/new');
    }
  };

  const handleUpgrade = () => {
    toast({
      title: "支付成功！",
      description: "欢迎成为会员，正在跳转...",
    });
    
    setMembershipStatus(true, 'premium');
    
    setTimeout(() => {
      goBack();
    }, 1000);
  };

  const benefits = [
    {
      id: 'wealth-prediction',
      title: '财富预测与分析',
      icon: TrendingUp,
      items: [
        '56年完整财富热力图预测',
        '3年重点关注期详细分析', 
        '现金流预测图表展示',
        '资产负债预测分析',
        '可支配财富趋势预测'
      ]
    },
    {
      id: 'risk-assessment',
      title: '专业风险评估',
      icon: Shield,
      items: [
        '主要风险识别（规划失误风险、购房风险等）',
        '稳健收益下行风险评估',
        '资产流动性风险分析',
        '裁员降薪风险测评',
        '规划变动风险预警',
        '重疾风险专业评估',
        '意外风险全面分析',
        '不当消费风险防控'
      ]
    },
    {
      id: 'professional-tools',
      title: '专业工具套装',
      icon: Wrench,
      items: [
        'AI职业规划工具',
        '生涯调缺智能建议',
        '重疾风险测评工具',
        '意外风险评估工具',
        '失业降薪风险分析',
        '财富快照深度解读',
        '长寿风险评估',
        '教育费用计算器',
        '养老费用规划器'
      ]
    },
    {
      id: 'personalized-advice',
      title: '个性化财富管理',
      icon: Target,
      items: [
        '财富分型深度解读',
        '个性化资产配置建议',
        '智能调缺解决方案',
        '专属风险防护方案',
        '定制化理财建议'
      ]
    }
  ];

  const BenefitSection = ({ benefit }: { benefit: typeof benefits[0] }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const Icon = benefit.icon;

    return (
      <Card className="mb-3 border-0 shadow-sm hover:shadow-md transition-all duration-200">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <CardContent className="p-5 cursor-pointer hover:bg-gray-50/50 transition-colors rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-xl bg-[#B3EBEF]/30 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#01BCD6]" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">{benefit.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{benefit.items.length} 项专业功能</p>
                  </div>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`} 
                />
              </div>
            </CardContent>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-5 pb-5 pt-0">
              <div className="space-y-3 pl-15">
                {benefit.items.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-[#01BCD6] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white px-4 py-6 relative border-b border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="absolute left-3 top-5 p-2 h-auto text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-center pt-2">
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 bg-gradient-to-r from-[#B3EBEF] to-[#CAF4F7] rounded-2xl flex items-center justify-center">
                <Crown className="w-7 h-7 text-[#01BCD6]" />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">会员权益详情</h1>
            <p className="text-sm text-gray-500">全方位财富管理专业服务</p>
          </div>
        </div>

        {/* Price Section */}
        <div className="px-4 py-6 bg-white">
          <div className="text-center">
            <div className="flex items-baseline justify-center space-x-1 mb-3">
              <span className="text-3xl font-bold text-gray-900">¥29.9</span>
              <span className="text-base text-gray-500">/月</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-gray-400 line-through">原价 ¥299</span>
              <Badge className="bg-[#01BCD6]/10 text-[#01BCD6] text-xs px-2 py-1 font-medium border-0">
                限时优惠 90% OFF
              </Badge>
            </div>
          </div>
        </div>

        {/* Benefits Sections */}
        <div className="px-4 pb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">会员权益</h2>
          <div className="space-y-0">
            {benefits.map((benefit) => (
              <BenefitSection key={benefit.id} benefit={benefit} />
            ))}
          </div>
        </div>

        {/* Value Proposition */}
        <div className="px-4 pb-6">
          <Card className="bg-gradient-to-r from-[#B3EBEF]/20 to-[#CAF4F7]/20 border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-[#01BCD6]/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-[#01BCD6]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">超值权益包</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    单独购买所有功能需要 <span className="font-semibold text-gray-800">299+ 元</span>
                  </p>
                  <p className="text-sm text-[#01BCD6] font-medium">
                    会员价格仅 29.9 元/月，节省 90% 费用
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Action */}
        <div className="px-4 pb-8 bg-white border-t border-gray-100 pt-6">
          <Button 
            onClick={handleUpgrade}
            className="w-full py-4 bg-[#01BCD6] hover:bg-[#01BCD6]/90 text-white text-base font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            立即开通会员 ¥29.9/月
          </Button>
          
          <p className="text-xs text-gray-400 text-center mt-3">
            开通即享所有会员权益，随时可取消
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemberBenefitsPage;
