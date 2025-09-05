import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, ChevronDown, ChevronRight, ChevronUp, TrendingDown, TrendingUp, Home, CreditCard } from 'lucide-react';
import { PlanningOverview } from './PlanningOverview';
import { useNavigationState } from '@/hooks/useNavigationState';

interface FourModuleAdjustmentSuggestionsProps {
  onAcceptSuggestions: () => void;
  onRejectSuggestions: () => void;
  pageMode?: string;
}

interface ModuleItem {
  id: string;
  title: string;
  count: number;
  icon: React.ElementType;
  expanded: boolean;
}

export const FourModuleAdjustmentSuggestions: React.FC<FourModuleAdjustmentSuggestionsProps> = ({
  onAcceptSuggestions,
  onRejectSuggestions,
  pageMode = 'member-severe-shortage'
}) => {
  const navigate = useNavigate();
  const { navigateWithState } = useNavigationState();
  const [modules, setModules] = useState<ModuleItem[]>([
    {
      id: 'expenses',
      title: '调整',
      count: 15,
      icon: TrendingDown,
      expanded: false
    },
    {
      id: 'income',
      title: '增加1项收入',
      count: 2,
      icon: TrendingUp,
      expanded: false
    },
    {
      id: 'property',
      title: '出售',
      count: 2,
      icon: Home,
      expanded: false
    },
    {
      id: 'financing',
      title: '申请一笔贷款',
      count: 1,
      icon: CreditCard,
      expanded: false
    }
  ]);

  const toggleModule = (id: string) => {
    setModules(prev => prev.map(module => 
      module.id === id 
        ? { ...module, expanded: !module.expanded }
        : module
    ));
  };

  const getModuleContent = (id: string) => {
    const CollapseButton = () => (
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => toggleModule(id)}
          variant="ghost"
          className="text-gray-500 hover:text-gray-700 text-sm py-1 px-3 h-auto flex items-center space-x-1"
        >
          <span>收起</span>
          <ChevronUp className="w-4 h-4 text-black" />
        </Button>
      </div>
    );

    switch (id) {
      case 'expenses':
        return (
          <div>
            <PlanningOverview />
            <CollapseButton />
          </div>
        );
      case 'income':
        return (
          <div className="space-y-4">
            <div className="rounded-xl p-4 shadow-sm border bg-orange-50/50 border-orange-200/50">
              <div className="flex items-center justify-between min-h-[44px]">
                <h4 className="text-base font-medium text-gray-800">
                  增加房租收入
                </h4>
              </div>
              <div className="pt-1 border-t border-[#CAF4F7]/30">
                <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                  <div className="mt-2">
                    <div className="font-medium text-[#01BCD6]">建议：出租市值300万的房屋&nbsp;&nbsp;&nbsp;&nbsp;租期40岁-45岁</div>
                    <div className="font-medium text-[#01BCD6] mt-1">预估租金5000元/月&nbsp;&nbsp;&nbsp;&nbsp;总租金收入36万</div>
                  </div>
                </div>
              </div>
            </div>
            <CollapseButton />
          </div>
        );
      case 'property':
        return (
          <div className="space-y-4">
            <div className="rounded-xl p-4 shadow-sm border bg-orange-50/50 border-orange-200/50">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">出售：</span>
                  <span className="text-gray-800 font-medium">当前价值200万的房产</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">出售时间：</span>
                  <span className="text-gray-800 font-medium">45岁</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">提前还贷：</span>
                  <span className="text-gray-800 font-medium">100万</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">无法出租减少租金收入：</span>
                  <span className="text-gray-800 font-medium">45岁-50岁，共30万元</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl p-4 shadow-sm border bg-orange-50/50 border-orange-200/50">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">出售：</span>
                  <span className="text-gray-800 font-medium">当前价值500万的房产</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">出售时间：</span>
                  <span className="text-gray-800 font-medium">70岁</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">因售房导致无房需租房时间：</span>
                  <span className="text-gray-800 font-medium">71岁-85岁</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">增加租金支出：</span>
                  <span className="text-gray-800 font-medium">5000元/月</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">增加总租金支出：</span>
                  <span className="text-gray-800 font-medium">90万元</span>
                </div>
              </div>
            </div>
            <CollapseButton />
          </div>
        );
      case 'financing':
        return (
          <div className="space-y-4">
            <div className="rounded-xl p-4 shadow-sm border bg-orange-50/50 border-orange-200/50">
              <div className="flex items-center justify-between min-h-[44px] mb-3">
                <h4 className="text-base font-medium text-gray-800">
                  购房融资
                </h4>
                <span className="text-gray-800 font-medium">38岁</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {/* 第一列：基本信息 */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">房价总额：</span>
                    <span className="text-gray-800 font-medium">380万</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">首付金额：</span>
                    <span className="text-gray-800 font-medium">114万</span>
                  </div>
                </div>
                
                {/* 第二列：贷款信息 */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">贷款金额：</span>
                    <span className="text-gray-800 font-medium">266万</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">贷款期间：</span>
                    <span className="text-gray-800 font-medium">30年</span>
                  </div>
                </div>
              </div>
              
              {/* 月供信息突出显示 */}
              <div className="mt-4 pt-3 border-t border-gray-200/50">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">月供金额：</span>
                  <span className="text-[#01BCD6] font-bold">1.3万元/月</span>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl p-4 shadow-sm border bg-orange-50/50 border-orange-200/50">
              <div className="flex items-center justify-between min-h-[44px] mb-3">
                <h4 className="text-base font-medium text-gray-800">
                  购车融资
                </h4>
                <span className="text-gray-800 font-medium">40岁</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {/* 第一列：基本信息 */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">车价总额：</span>
                    <span className="text-gray-800 font-medium">50万</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">首付金额：</span>
                    <span className="text-gray-800 font-medium">40万</span>
                  </div>
                </div>
                
                {/* 第二列：贷款信息 */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">贷款金额：</span>
                    <span className="text-gray-800 font-medium">10万</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">贷款期间：</span>
                    <span className="text-gray-800 font-medium">5年</span>
                  </div>
                </div>
              </div>
              
              {/* 月供信息突出显示 */}
              <div className="mt-4 pt-3 border-t border-gray-200/50">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">月供金额：</span>
                  <span className="text-[#01BCD6] font-bold">5000元/月</span>
                </div>
              </div>
            </div>
            <CollapseButton />
          </div>
        );
      default:
        return null;
    }
  };

  const getModuleDescription = (id: string, count: number) => {
    switch (id) {
      case 'expenses':
        return `${count}项支出`;
      case 'income':
        return '';
      case 'property':
        return `${count}处房产`;
      case 'financing':
        return '';
      default:
        return '';
    }
  };

  const handleImageClick = () => {
    navigateWithState('/adjustment-advice-detail', {
      activeTab: 'discovery',
      sourceModule: 'adjustment-suggestions',
      pageMode: pageMode
    });
  };

  return (
    <>
        
          <div className="space-y-4">
          
          {/* 四个模块 */}
          <div className="space-y-2">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <div key={module.id} className="border border-gray-200 rounded-lg">
                  {/* 模块头部 */}
                  <div 
                    className="p-3 cursor-pointer transition-colors flex items-center justify-between"
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4 text-[#01BCD6]" />
                      <span className="font-medium text-[#01BCD6]">
                        {module.title}{getModuleDescription(module.id, module.count)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* 呼吸感圆点 - 仅在收起状态显示 */}
                      {!module.expanded && (
                        <div className="relative">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                          <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full" />
                        </div>
                      )}
                      {module.expanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* 展开内容 */}
                  {module.expanded && (
                    <div className="border-t border-gray-100 p-3">
                      {getModuleContent(module.id)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

    </>
  );
};