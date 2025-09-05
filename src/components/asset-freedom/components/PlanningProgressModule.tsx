import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, Heart, Baby, Home, GraduationCap, Users, AlertTriangle, CheckCircle2, Coffee, Clock3, Briefcase, Sparkles, Car } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface PlanningProgressModuleProps {
  pageMode?: string;
}

// 生动化的存钱进度数据
interface SavingsProgressItem {
  id: string;
  name: string;
  age: number;
  icon: any;
  status: 'completed' | 'partial' | 'partialDownPayment' | 'partialPrimary' | 'partialMortgage' | 'partialTravel' | 'partialMedical' | 'partialSupport' | 'notStarted';
  description: string;
  details: string;
  bgColor: string;
  iconColor: string;
  emoji: string;
  savedAmount?: number; // 已攒金额
  totalAmount?: number; // 总需要金额
}

const PlanningProgressModule: React.FC<PlanningProgressModuleProps> = ({ pageMode }) => {
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  
  // 当年大事数据
  interface CurrentYearEvent {
    id: string;
    name: string;
    icon: any;
    emoji: string;
    description: string;
    bgGradient: string;
    iconColor: string;
    textColor: string;
  }
  
  const currentYearEvents: CurrentYearEvent[] = [
    {
      id: 'marriage',
      name: '步入婚姻殿堂',
      icon: Heart,
      emoji: '💕',
      description: '甜蜜婚礼即将来临',
      bgGradient: 'bg-[#CAF4F7]/15',
      iconColor: 'text-[#4A90A4]',
      textColor: 'text-[#2D6B7D]'
    },
    {
      id: 'birth',
      name: '迎接小天使',
      icon: Baby,
      emoji: '👶',
      description: '迎接新生命的到来',
      bgGradient: 'bg-[#CAF4F7]/20',
      iconColor: 'text-[#2D6B7D]',
      textColor: 'text-[#1A5A6A]'
    },
    {
      id: 'housing',
      name: '刚需购房',
      icon: Home,
      emoji: '🏠',
      description: '温馨小家即将落成',
      bgGradient: 'bg-[#CAF4F7]/15',
      iconColor: 'text-[#4A90A4]',
      textColor: 'text-[#2D6B7D]'
    },
    {
      id: 'career',
      name: '本人踏入职场',
      icon: Briefcase,
      emoji: '💼',
      description: '职业生涯正式启航',
      bgGradient: 'bg-[#CAF4F7]/20',
      iconColor: 'text-[#2D6B7D]',
      textColor: 'text-[#1A5A6A]'
    },
    {
      id: 'car',
      name: '喜提爱车',
      icon: Car,
      emoji: '🚗',
      description: '人生第一台座驾即将到手',
      bgGradient: 'bg-[#CAF4F7]/25',
      iconColor: 'text-[#1A5A6A]',
      textColor: 'text-[#0E4A56]'
    }
  ];

  // 当年大事卡片组件
  const CurrentYearEventCard: React.FC<{ event: CurrentYearEvent; index: number }> = ({ event, index }) => {
    const Icon = event.icon;
    
    return (
      <div className={`${event.bgGradient} rounded-2xl p-4 border border-white/50 shadow-sm hover:shadow-md transition-all duration-500 transform hover:scale-105 animate-fade-in`}
           style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="flex flex-col items-center text-center space-y-3">
          {/* 动态图标区域 */}
          <div className="relative">
            {/* 主图标 */}
            <div className="relative w-14 h-14 bg-[#CAF4F7]/40 rounded-full flex items-center justify-center shadow-lg">
              <Icon className={`w-5 h-5 ${event.iconColor}`} />
            </div>
          </div>
          
          {/* 事件标题 */}
          <div>
            <h4 className={`font-bold text-sm ${event.textColor} whitespace-nowrap`}>
              {event.name}
            </h4>
          </div>
        </div>
      </div>
    );
  };
  
  // 根据用户描述的业务场景重新设计的数据
  const savingsProgressData: SavingsProgressItem[] = [
    {
      id: 'marriage',
      name: '结婚',
      age: 30,
      icon: Heart,
      status: 'completed',
      description: '已攒齐结婚费用',
      details: '恭喜！您已经为幸福的婚礼准备好了所有资金',
      bgColor: 'bg-[#CAF4F7]/15',
      iconColor: 'text-[#4A90A4]',
      emoji: '💕',
      savedAmount: 15,
      totalAmount: 15
    },
    {
      id: 'birth',
      name: '生育',
      age: 35,
      icon: Baby,
      status: 'completed',
      description: '已攒齐生育费用',
      details: '太好了！迎接小生命的费用已经准备充足',
      bgColor: 'bg-[#CAF4F7]/15',
      iconColor: 'text-[#4A90A4]',
      emoji: '👶',
      savedAmount: 8,
      totalAmount: 8
    },
    {
      id: 'education1',
      name: '教育老大',
      age: 0, // 持续性支出
      icon: GraduationCap,
      status: 'completed',
      description: '已攒齐老大所有教育费用',
      details: '太棒了！老大上到研究生毕业的费用都准备好了',
      bgColor: 'bg-[#CAF4F7]/15',
      iconColor: 'text-[#4A90A4]',
      emoji: '🎓',
      savedAmount: 120,
      totalAmount: 120
    },
    {
      id: 'mortgage',
      name: '还房贷',
      age: 30, // 显示年龄段标签
      icon: Home,
      status: 'partialMortgage',
      description: '还房贷-市值256万房产',
      details: '已攒足5年月供费用',
      bgColor: 'bg-[#CAF4F7]/20',
      iconColor: 'text-[#2D6B7D]',
      emoji: '🏠',
      savedAmount: 82,
      totalAmount: 356
    },
    {
      id: 'travel',
      name: '旅行',
      age: 0,
      icon: Sparkles,
      status: 'partialTravel',
      description: '已攒足5年旅行支出',
      details: '已攒足5年旅行支出',
      bgColor: 'bg-[#CAF4F7]/20',
      iconColor: 'text-[#2D6B7D]',
      emoji: '✈️',
      savedAmount: 14,
      totalAmount: 124
    },
    {
      id: 'medical',
      name: '医疗支出',
      age: 0,
      icon: Heart,
      status: 'partialMedical',
      description: '已攒足5年医疗支出',
      details: '已攒足5年医疗支出',
      bgColor: 'bg-[#CAF4F7]/20',
      iconColor: 'text-[#2D6B7D]',
      emoji: '🏥',
      savedAmount: 14,
      totalAmount: 289
    },
    {
      id: 'housing',
      name: '刚需购房',
      age: 33,
      icon: Home,
      status: 'partialDownPayment',
      description: '刚需购房，380万，2居室',
      details: '✓ 首付款已攒齐：140万元\n✓ 房贷储备：够支撑1年还款',
      bgColor: 'bg-[#CAF4F7]/20',
      iconColor: 'text-[#2D6B7D]',
      emoji: '🏠',
      savedAmount: 150,
      totalAmount: 380
    },
    {
      id: 'education2',
      name: '教育老二',
      age: 0, // 持续性支出
      icon: Users,
      status: 'partialPrimary',
      description: '已攒齐老二部分教育费用',
      details: '能支撑到老二小学二年级，需要继续努力攒钱',
      bgColor: 'bg-[#CAF4F7]/20',
      iconColor: 'text-[#2D6B7D]',
      emoji: '👦',
      savedAmount: 25,
      totalAmount: 80
    },
    {
      id: 'support',
      name: '资助子女',
      age: 0,
      icon: Users,
      status: 'partialSupport',
      description: '已攒足2年资助支出',
      details: '已攒足2年资助支出',
      bgColor: 'bg-[#CAF4F7]/20',
      iconColor: 'text-[#2D6B7D]',
      emoji: '👨‍👩‍👧‍👦',
      savedAmount: 17,
      totalAmount: 556
    },
    {
      id: 'retirement',
      name: '养老',
      age: 65,
      icon: Coffee,
      status: 'notStarted',
      description: '未开始攒养老费用',
      details: '现在开始规划，为美好的退休生活做准备',
      bgColor: 'bg-gray-100',
      iconColor: 'text-[#6B9AA8]',
      emoji: '☕',
      savedAmount: 0,
      totalAmount: 300
    }
  ];

  // 生动化的存钱卡片组件
  const VividSavingsCard: React.FC<{ item: SavingsProgressItem }> = ({ item }) => {
    const Icon = item.icon;
    
    const getStatusDisplay = () => {
      switch (item.status) {
        case 'completed':
          return {
            badge: '已攒足',
            badgeColor: 'bg-[#CAF4F7]/50 text-[#2D6B7D]',
            iconBg: 'bg-[#CAF4F7]/40',
            icon: CheckCircle2,
            iconColor: 'text-[#2D6B7D]'
          };
        case 'partialDownPayment':
          return {
            badge: '已攒足首付+3年月供',
            badgeColor: 'bg-[#CAF4F7]/60 text-[#1A5A6A]',
            iconBg: 'bg-[#CAF4F7]/50',
            icon: Clock3,
            iconColor: 'text-[#1A5A6A]'
          };
        case 'partialPrimary':
          return {
            badge: '已攒到小学二年级',
            badgeColor: 'bg-[#CAF4F7]/60 text-[#1A5A6A]',
            iconBg: 'bg-[#CAF4F7]/50',
            icon: Clock3,
            iconColor: 'text-[#1A5A6A]'
          };
        case 'partialMortgage':
          return {
            badge: '已攒足5年月供',
            badgeColor: 'bg-[#CAF4F7]/60 text-[#1A5A6A]',
            iconBg: 'bg-[#CAF4F7]/50',
            icon: Clock3,
            iconColor: 'text-[#1A5A6A]'
          };
        case 'partialTravel':
          return {
            badge: '已攒足5年旅行支出',
            badgeColor: 'bg-[#CAF4F7]/60 text-[#1A5A6A]',
            iconBg: 'bg-[#CAF4F7]/50',
            icon: Clock3,
            iconColor: 'text-[#1A5A6A]'
          };
        case 'partialMedical':
          return {
            badge: '已攒足5年医疗支出',
            badgeColor: 'bg-[#CAF4F7]/60 text-[#1A5A6A]',
            iconBg: 'bg-[#CAF4F7]/50',
            icon: Clock3,
            iconColor: 'text-[#1A5A6A]'
          };
        case 'partialSupport':
          return {
            badge: '已攒足2年资助支出',
            badgeColor: 'bg-[#CAF4F7]/60 text-[#1A5A6A]',
            iconBg: 'bg-[#CAF4F7]/50',
            icon: Clock3,
            iconColor: 'text-[#1A5A6A]'
          };
        case 'partial':
          return {
            badge: '进行中',
            badgeColor: 'bg-[#CAF4F7]/60 text-[#1A5A6A]',
            iconBg: 'bg-[#CAF4F7]/50',
            icon: Clock3,
            iconColor: 'text-[#1A5A6A]'
          };
        case 'notStarted':
          return {
            badge: '未开始',
            badgeColor: 'bg-gray-100 text-gray-600',
            iconBg: 'bg-gray-100',
            icon: AlertTriangle,
            iconColor: 'text-gray-500'
          };
      }
    };

    const statusDisplay = getStatusDisplay();
    const StatusIcon = statusDisplay.icon;

    // 判断是否需要显示金额信息
    const shouldShowAmounts = item.savedAmount !== undefined && item.totalAmount !== undefined;

    return (
      <div className={`${item.bgColor} rounded-xl p-3 border border-gray-100 hover:shadow-md transition-all duration-300`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className={`w-8 h-8 ${statusDisplay.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${item.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0 flex items-center">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-semibold text-gray-800 truncate">{item.name}</h4>
                {item.age > 0 && !(item.id === 'marriage' || item.id === 'birth' || item.id === 'education1') && item.id !== 'mortgage' && (
                  <>
                    <span className="text-xs text-gray-500 bg-white/70 px-1.5 py-0.5 rounded-md whitespace-nowrap flex items-center">
                      {item.age}岁
                    </span>
                  </>
                )}
                {item.id === 'mortgage' && (
                  <>
                    <span className="text-xs text-gray-500 bg-white/70 px-1.5 py-0.5 rounded-md whitespace-nowrap flex items-center">
                      还23年
                    </span>
                    <span className="text-xs text-gray-500 bg-white/70 px-1.5 py-0.5 rounded-md whitespace-nowrap flex items-center">
                      256万房产
                    </span>
                  </>
                )}
                {(item.id === 'marriage' || item.id === 'birth') && (
                  <span className="text-xs font-medium text-[#01BCD6] bg-[#01BCD6]/10 border border-[#01BCD6]/20 px-1.5 py-0.5 rounded-md whitespace-nowrap flex items-center">
                    当年
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <StatusIcon className={`w-3.5 h-3.5 ${statusDisplay.iconColor}`} />
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${statusDisplay.badgeColor} flex items-center`}>
              {statusDisplay.badge}
            </span>
          </div>
        </div>
        
        {/* 进度条展示区域 - 显示所有有金额数据的项目 */}
        {shouldShowAmounts && (
          <div className="mt-3 bg-white/80 rounded-lg p-3 border border-white/70">
            <div className="space-y-2">
              {/* 已完成项目的简化布局 */}
              {item.status === 'completed' ? (
                <>
                  <div className="flex items-center justify-between text-xs">
                    {!(item.id === 'marriage' || item.id === 'birth' || item.id === 'education1') && (
                      <div className="flex items-center gap-1">
                        <span className="text-green-600">✓</span>
                        <span className="text-[#01BCD6] font-medium">共计 {item.savedAmount}万</span>
                      </div>
                    )}
                    {(item.id === 'marriage' || item.id === 'birth' || item.id === 'education1') && (
                      <div></div>
                    )}
                    <span className="text-gray-500">目标 {item.totalAmount}万</span>
                  </div>
                  
                  {/* 圆点刻度尺进度条 */}
                  <div className="w-full flex items-center py-2 gap-1">
                    {Array.from({ length: 40 }, (_, index) => {
                      return (
                        <div
                          key={index}
                          className="w-2.5 h-4 animate-[progress-fill-with-sync-reset_4s_linear_infinite]"
                          style={{
                            backgroundColor: '#e5e7eb',
                            animationDelay: `${index * 0.05}s`
                          }}
                        />
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>攒钱进度</span>
                    <span>{Math.round((item.savedAmount! / item.totalAmount!) * 100)}%</span>
                  </div>
                  
                  {/* 圆点刻度尺进度条 */}
                  <div className="w-full flex items-center py-2 gap-1">
                    {Array.from({ length: 40 }, (_, index) => {
                      const currentProgress = Math.min((item.savedAmount! / item.totalAmount!) * 100, 100);
                      const dotProgress = (index + 1) * 2.5; // 每个点代表2.5%
                      const shouldAnimate = dotProgress <= currentProgress;
                      
                      return (
                        <div
                          key={index}
                          className={`w-2.5 h-4 ${
                            shouldAnimate ? 'animate-[progress-fill-with-sync-reset_4s_linear_infinite]' : ''
                          }`}
                          style={{
                            backgroundColor: '#e5e7eb',
                            animationDelay: shouldAnimate ? `${index * 0.05}s` : '0s'
                          }}
                        />
                      );
                    })}
                  </div>
                  
                  {/* 进度描述 */}
                   <div className="flex items-center justify-between text-xs pt-1">
                     <span className={`font-medium ${item.id === 'retirement' ? 'text-gray-500' : 'text-[#01BCD6]'}`}>已攒 {item.savedAmount}万</span>
                     <span className="text-gray-500">目标 {item.totalAmount}万</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 第一个模块：合并的财务状况模块 - 移到最上面 */}
      <Card className="bg-white shadow-md rounded-lg">
        <CardContent className="p-4 space-y-4">
          {/* 家庭距离财富自由还有多久 */}
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm text-gray-800">家庭距离财富自由还有多少年</h4>
              <span className="text-lg font-bold ml-4" style={{ color: '#01BCD6' }}>15年</span>
            </div>
          </div>
          
          {/* 分隔线 */}
          <div className="border-t border-gray-100"></div>
          
          {/* 不工作能撑多久 */}
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm text-gray-800">如果不工作能支撑多少年</h4>
              <span className="text-lg font-bold ml-4" style={{ color: '#01BCD6' }}>8年</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 第二个模块：当年大事展示 */}
      <Card className="bg-white shadow-md rounded-lg">
        <CardContent className="p-4">
          <div className="mb-3">
            <h4 className="text-base font-semibold text-gray-800">当年大事</h4>
          </div>
          
          {/* 当年大事横向滑动布局 */}
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {currentYearEvents.map((event, index) => (
                  <CarouselItem key={event.id} className="pl-2 md:pl-4 basis-1/4 min-w-0">
                    <CurrentYearEventCard
                      event={event}
                      index={index}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            {/* 右侧渐变提示，表示可以滑动查看更多 */}
            {currentYearEvents.length > 4 && (
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none rounded-r-lg" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* 第三个模块：未来重要支出攒钱进度 */}
      <Card className="bg-white shadow-md rounded-lg">
        <CardContent className="p-4">
          <div className="mb-3">
            <div className="flex items-center space-x-1">
              <h4 className="text-base font-semibold text-gray-800">攒钱进展</h4>
              <HelpCircle 
                className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                onClick={() => setIsHelpDialogOpen(true)}
              />
            </div>
          </div>
          <div className="space-y-2">
            {savingsProgressData.map((item) => (
              <VividSavingsCard
                key={item.id}
                item={item}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 帮助弹窗 */}
      <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>攒钱进度说明</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm leading-relaxed text-gray-700">
            这里需要解释一下这个百分比的计算逻辑
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanningProgressModule;