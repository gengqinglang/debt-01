import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Shield, AlertTriangle, Briefcase, TrendingDown, Users, TrendingUp, GraduationCap, BookOpen, Heart, Zap, Umbrella, PiggyBank, ArrowUpDown, Activity, Clock, Settings, Camera, Calculator, Crown, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContentMask from '@/components/membership/ContentMask';
import CaseSection from '@/components/asset-freedom/components/CaseSection';

// 页面模式枚举类型
type PageMode = 'member-severe-shortage' | 'member-liquidity-tight' | 'member-balanced' | 'public-severe-shortage' | 'public-liquidity-tight' | 'public-balanced';

interface AssessmentToolsSectionProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  pageMode?: PageMode;
}

const AssessmentToolsSection: React.FC<AssessmentToolsSectionProps> = ({ 
  activeCategory, 
  onCategoryChange,
  pageMode = 'public-balanced'
}) => {
  const navigate = useNavigate();
  
  // 判断是否为会员状态
  const isCurrentMember = pageMode.startsWith('member-');

  const categories = [
    { value: 'ai-planning', label: '规划工具' },
    { value: 'risk-assessment', label: '测评工具' },
    { value: 'future-prediction', label: '费用计算器' }
  ];

  const assessmentTools = {
    'ai-planning': [
      {
        id: 'career-gap-analysis',
        name: '生涯调缺',
        description: '智能分析职业发展缺口，制定个性化提升方案',
        icon: Settings,
        route: '/career-gap-analysis'
      },
      {
        id: 'career-planning',
        name: '职业规划',
        description: '全面规划职业发展路径，实现人生目标',
        icon: GraduationCap,
        route: '/career-development'
      }
    ],
    'risk-assessment': [
      {
        id: 'critical-illness',
        name: '重疾风险测评',
        description: '健康是最大的财富，别让疾病偷走你的小金库',
        icon: Shield,
        route: '/risk-assessment'
      },
      {
        id: 'accident',
        name: '意外风险测评',
        description: '天有不测风云，提前为意外做好"雨伞"',
        icon: AlertTriangle,
        route: '/accident-assessment'
      },
      {
        id: 'employment',
        name: '失业降薪风险测评',
        description: '工作可能会变，但财务安全感不能丢',
        icon: Briefcase,
        route: '/employment-risk'
      },
      {
        id: 'wealth-snapshot',
        name: '财富快照测评',
        description: '全面了解您的财务状况，为财富管理提供精准依据',
        icon: Camera,
        route: '/wealth-snapshot'
      },
      {
        id: 'longevity',
        name: '长寿风险测评',
        description: '长寿是福，但也需要提前规划养老财务安全',
        icon: Clock,
        route: '/longevity-risk'
      },
      {
        id: 'housing-price-risk',
        name: '房价波动风险测评',
        description: '房价起伏影响财富价值，提前评估房产投资风险',
        icon: Home,
        route: '/housing-price-risk',
        disabled: true
      }
    ],
    'future-prediction': [
      {
        id: 'education-calculator',
        name: '教育费用计算器',
        description: '精准计算孩子教育成本，提前规划教育资金',
        icon: GraduationCap,
        route: '/education-calculator',
        disabled: true
      },
      {
        id: 'retirement-calculator',
        name: '养老费用计算器',
        description: '计算退休所需资金，规划舒适养老生活',
        icon: Clock,
        route: '/retirement-calculator',
        disabled: true
      }
    ]
  };

  const handleStartAssessment = (route: string, disabled?: boolean) => {
    // 在普通客户状态下，规划工具和测评工具模块的工具卡片无法点击
    if (!isCurrentMember && (validActiveCategory === 'ai-planning' || validActiveCategory === 'risk-assessment')) {
      return; // 阻止点击
    }
    
    if (!disabled) {
      navigate(route);
    }
  };

  // 会员升级处理函数
  const handleNonMemberInteraction = () => {
    console.log('=== AssessmentToolsSection 非会员交互触发 ===');
    // 这里可以触发会员升级弹窗
  };

  // 添加容错处理：如果activeCategory不存在，使用第一个分类
  const validActiveCategory = assessmentTools[activeCategory] ? activeCategory : 'ai-planning';
  const currentTools = assessmentTools[validActiveCategory] || [];

  return (
    <div className="space-y-6">
      {/* 分类导航 - 修改为合理间距布局 */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="px-4 md:px-6 py-2">
          <div className="flex justify-start items-baseline space-x-8">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => onCategoryChange(category.value)}
                className={`py-2 px-1 text-center transition-all duration-200 whitespace-nowrap min-w-0 ${
                  validActiveCategory === category.value
                    ? 'text-black text-base md:text-lg font-bold'
                    : 'text-gray-400 text-xs md:text-sm font-normal'
                }`}
              >
                <span className="break-words">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="px-6 space-y-6">
        {/* 工具布局 - 每行一个卡片，添加会员制遮罩 */}
        <div className="space-y-3">
          {currentTools.map((tool) => {
          const IconComponent = tool.icon;
          const isDisabled = tool.disabled;
          
          return (
            <div key={tool.id} className="relative">
              <ContentMask
                memberOnly={true}
                maskType="disable"
                upgradePrompt={{
                  title: "会员专享工具",
                  description: "升级会员解锁专业的财富管理工具",
                  feature: "风险评估、投资建议、财务规划等专业工具"
                }}
              >
                <div 
                  className={`group ${
                    isDisabled ? 'cursor-not-allowed' : 
                    (!isCurrentMember && (validActiveCategory === 'ai-planning' || validActiveCategory === 'risk-assessment')) ? 'cursor-not-allowed' : 
                    'cursor-pointer'
                  }`}
                  onClick={() => handleStartAssessment(tool.route, isDisabled)}
                >
                  <div 
                    className={`bg-white rounded-xl p-4 transition-all duration-300 w-full ${
                      isDisabled ? 'opacity-50' : 
                      (!isCurrentMember && (validActiveCategory === 'ai-planning' || validActiveCategory === 'risk-assessment')) ? 'opacity-50' :
                      'group-hover:scale-[1.02]'
                    }`}
                    style={{
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      border: '1px solid rgba(0, 0, 0, 0.06)'
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      {/* 图标区域 */}
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ 
                          backgroundColor: isDisabled ? 'rgba(156, 163, 175, 0.3)' : 'rgba(202, 244, 247, 0.3)',
                          border: isDisabled ? '1px solid rgba(156, 163, 175, 0.5)' : '1px solid rgba(202, 244, 247, 0.5)'
                        }}
                      >
                        <IconComponent 
                          className="w-6 h-6" 
                          style={{ color: isDisabled ? '#9ca3af' : '#0891b2' }} 
                          strokeWidth={1.5} 
                        />
                      </div>
                      
                      <div className="flex-1">
                        {/* 名称区域 */}
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-base font-semibold leading-tight ${
                            isDisabled ? 'text-gray-400' : 'text-gray-800'
                          }`}>
                            {tool.name}
                          </h3>
                        </div>
                        
                        {/* 描述区域 */}
                        <p className={`text-sm leading-relaxed ${
                          isDisabled ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ContentMask>
              
              {/* 标签 - 显示在遮罩上层 */}
              <div className="absolute top-2 right-2 z-10">
                <Badge 
                  variant="outline" 
                  className={`text-xs px-2 py-1 ${
                    isDisabled 
                      ? 'bg-gray-100 text-gray-500 border-gray-300' 
                      : 'bg-[#CAF4F7]/20 text-[#0891b2] border-[#CAF4F7]/50'
                  }`}
                >
                  {isDisabled ? '待上线，敬请期待' : '会员专享功能'}
                </Badge>
              </div>
            </div>
          );
          })}
        </div>
        
        {/* 普通客户状态下，在所有模块下方都显示会员卡片 */}
        {!isCurrentMember && (
          <Card className="bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 border-[#FFD700]/30">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* 图标和标题 - 保持居中 */}
                <div className="text-center">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center shadow-md">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <h3 className="text-xl font-bold text-gray-800">会员专享服务</h3>
                    <p className="text-center text-sm text-gray-600">
                      专业工具箱·智能测评·精准规划
                    </p>
                  </div>
                </div>
                
                {/* 规划工具模块 */}
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-6 h-6 mr-3">
                      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-blue-500">
                        <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800">规划工具</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pl-9">
                    职业规划、生涯调缺等专业规划工具，助力人生目标实现
                  </p>
                </div>
                
                {/* 测评工具模块 */}
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-6 h-6 mr-3">
                      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-green-500">
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="m8 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800">测评工具</h4>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pl-9">
                    专业风险测评、财富快照等评估工具，全面了解您的财务状况
                  </p>
                </div>
                
                {/* 查看完整会员权益链接 */}
                <div className="text-center mb-4">
                  <button
                    onClick={() => navigate('/member-benefits')}
                    className="text-[#01BCD6] hover:text-[#01BCD6]/80 text-sm font-medium transition-colors flex items-center justify-center space-x-1 mx-auto"
                  >
                    <span>查看完整会员权益</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                
                {/* 立即升级会员按钮 */}
                <Button
                  onClick={handleNonMemberInteraction}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl text-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                >
                  立即升级会员
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AssessmentToolsSection;
