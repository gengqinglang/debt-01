
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import TimelineEvent from './TimelineEvent';
import { useCareerData } from '@/components/career/CareerDataProvider';

interface LifeEvent {
  id: string;
  name: string;
  age: number;
  color: string;
  image: React.ComponentType<{ className?: string }>;
}

interface TimelineContentProps {
  ageRange: number[];
  groupedEventsByDisplayAge: Record<number, LifeEvent[]>;
  draggedEvent: string | null;
  dragOverAge: number | null;
  getActualAge: (displayAge: number) => number;
  onDragOver: (e: React.DragEvent, age: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, targetAge: number) => void;
  onDragStart: (eventId: string) => void;
  onDragEnd: () => void;
  isPartnerPerspective: boolean;
  onPartnerPerspectiveChange: (value: boolean) => void;
  isTouchDragging: boolean;
  touchDraggedEvent: string | null;
  touchCurrentPosition: { x: number; y: number } | null;
  isDragActive: boolean;
  onTouchStart: (eventId: string, e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  animatingEvents?: string[];
  currentAge: number;
  partnerAge: number;
}

const TimelineContent: React.FC<TimelineContentProps> = ({
  ageRange,
  groupedEventsByDisplayAge,
  draggedEvent,
  dragOverAge,
  getActualAge,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onDragEnd,
  isPartnerPerspective,
  onPartnerPerspectiveChange,
  isTouchDragging,
  touchDraggedEvent,
  touchCurrentPosition,
  isDragActive,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  animatingEvents = [],
  currentAge,
  partnerAge
}) => {
  // 改名为 expandedRanges，记录展开的年份范围
  const [expandedRanges, setExpandedRanges] = useState<Set<string>>(new Set());

  // Get career data
  const { careerPlan, partnerCareerPlan, personalWorkStatus, partnerWorkStatus } = useCareerData();

  // Get the appropriate career plan based on perspective
  const activePlan = isPartnerPerspective ? partnerCareerPlan : careerPlan;
  const activeWorkStatus = isPartnerPerspective ? partnerWorkStatus : personalWorkStatus;

  // 获取职业阶段开始年龄的映射
  const getCareerStageStartAges = () => {
    if (activeWorkStatus === 'not-working-future' || activeWorkStatus === 'retired' || !activePlan || activePlan.length === 0) {
      return {};
    }

    const careerStageStartAges: Record<number, any> = {};
    
    activePlan.forEach((stage, index) => {
      const ageRangeMatch = stage.ageRange.match(/(\d+)-(\d+)/);
      if (ageRangeMatch) {
        const startAge = parseInt(ageRangeMatch[1]);
        let displayAge;
        if (isPartnerPerspective) {
          const ageDiff = currentAge - partnerAge;
          displayAge = startAge - ageDiff;
        } else {
          displayAge = startAge;
        }
        
        careerStageStartAges[displayAge] = { ...stage, colorIndex: index };
      }
    });

    return careerStageStartAges;
  };

  const careerStageStartAges = getCareerStageStartAges();

  // 获取所有重要年龄：确保时间轴起始年龄固定
  const getImportantAges = () => {
    // 固定时间轴起始年龄：本人视角从30岁开始，伴侣视角从28岁开始
    const timelineStartAge = isPartnerPerspective ? partnerAge : currentAge;
    
    // 获取事件年龄，但只包含大于等于起始年龄的事件
    const lifeEventAges = Object.keys(groupedEventsByDisplayAge)
      .map(age => parseInt(age))
      .filter(age => age >= timelineStartAge);
    
    // 获取职业阶段开始年龄，但只包含大于等于起始年龄的
    const careerStartAges = Object.keys(careerStageStartAges)
      .map(age => parseInt(age))
      .filter(age => age >= timelineStartAge);
    
    // 合并所有年龄，确保包含固定的起始年龄，然后去重并排序
    const allImportantAges = [...new Set([timelineStartAge, ...lifeEventAges, ...careerStartAges])].sort((a, b) => a - b);
    return allImportantAges;
  };

  const importantAges = getImportantAges();

  // 构建显示的年龄段，包括折叠区间和收起按钮
  const buildDisplayAges = () => {
    const displayAges: Array<{
      type: 'age' | 'collapsed' | 'collapse-button';
      age?: number;
      startAge?: number;
      endAge?: number;
      rangeKey?: string;
    }> = [];

    for (let i = 0; i < importantAges.length; i++) {
      const currentAge = importantAges[i];
      const nextAge = importantAges[i + 1];

      // 添加当前年龄
      displayAges.push({ type: 'age', age: currentAge });

      // 检查是否需要添加折叠区间
      if (nextAge && nextAge - currentAge > 1) {
        const startGapAge = currentAge + 1;
        const endGapAge = nextAge - 1;
        const rangeKey = `${startGapAge}-${endGapAge}`;
        
        if (expandedRanges.has(rangeKey)) {
          // 展开状态：显示所有中间年龄
          for (let age = startGapAge; age <= endGapAge; age++) {
            displayAges.push({ type: 'age', age });
          }
          // 在展开的年龄范围后添加收起按钮
          displayAges.push({
            type: 'collapse-button',
            startAge: startGapAge,
            endAge: endGapAge,
            rangeKey
          });
        } else {
          // 默认折叠状态：显示折叠区间
          displayAges.push({
            type: 'collapsed',
            startAge: startGapAge,
            endAge: endGapAge,
            rangeKey
          });
        }
      }
    }

    return displayAges;
  };

  const toggleCollapse = (rangeKey: string) => {
    const newExpandedRanges = new Set(expandedRanges);
    if (newExpandedRanges.has(rangeKey)) {
      // 当前是展开状态，点击后收起
      newExpandedRanges.delete(rangeKey);
    } else {
      // 当前是收起状态，点击后展开
      newExpandedRanges.add(rangeKey);
    }
    setExpandedRanges(newExpandedRanges);
  };

  const displayAges = buildDisplayAges();

  return (
    <div 
      className="flex-1 overflow-y-auto bg-gradient-to-b from-blue-50/30 to-green-50/30 -mt-4 pt-4 timeline-content"
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ touchAction: isDragActive ? 'none' : 'auto' }}
    >
      {/* Controls Section - 修改视角切换为两个按钮 */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          {/* 视角切换按钮组 - 左侧 */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => onPartnerPerspectiveChange(false)}
              variant={!isPartnerPerspective ? "default" : "outline"}
              size="sm"
              className={`px-3 py-2 text-sm font-medium transition-all duration-300 ${
                !isPartnerPerspective 
                  ? 'text-gray-800' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
              }`}
              style={!isPartnerPerspective ? { backgroundColor: '#CAF4F7', opacity: 0.8 } : {}}
            >
              本人视角
            </Button>
            
            <Button
              onClick={() => onPartnerPerspectiveChange(true)}
              variant={isPartnerPerspective ? "default" : "outline"}
              size="sm"
              className={`px-3 py-2 text-sm font-medium transition-all duration-300 ${
                isPartnerPerspective 
                  ? 'text-gray-800' 
                  : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
              }`}
              style={isPartnerPerspective ? { backgroundColor: '#CAF4F7', opacity: 0.8 } : {}}
            >
              伴侣视角
            </Button>
          </div>
          
          {/* 提示文案 - 右侧 */}
          <div>
            <p className="text-gray-600 text-xs font-medium opacity-80">
              {isPartnerPerspective ? '伴侣视角查看人生规划' : '拖拽卡片可调整事件时间'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          {/* Timeline Line - positioned to align with age circle centers */}
          <div className="absolute left-[40px] top-0 bottom-0 w-1 bg-gradient-to-b from-[#B3EBEF] via-[#CCE9B5] to-[#FFEA96] rounded-full opacity-40"></div>
          
          <div className="space-y-3">
            {displayAges.map((item, index) => {
              if (item.type === 'collapsed') {
                return (
                  <div key={item.rangeKey} className="relative flex items-center group">
                    {/* 空白年龄圆圈占位 */}
                    <div className="relative z-10 flex items-center justify-center w-[80px]">
                      <div className="w-[45px] h-[32px] rounded-lg flex items-center justify-center bg-gray-100/80 border border-gray-200">
                        <div className="text-center">
                          <span className="text-xs text-gray-600">···</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 折叠区间显示 - 移动到事件卡片位置 */}
                    <div className="ml-6 min-h-[52px] flex items-center flex-1">
                      <button
                        onClick={() => toggleCollapse(item.rangeKey!)}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gray-50/80 hover:bg-gray-100/80 border border-gray-200 transition-colors text-sm text-gray-600"
                      >
                        <span>{item.startAge}岁 - {item.endAge}岁</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              }

              if (item.type === 'collapse-button') {
                return (
                  <div key={`collapse-${item.rangeKey}`} className="relative flex items-center group">
                    {/* 空白年龄圆圈占位 */}
                    <div className="relative z-10 flex items-center justify-center w-[80px]">
                      <div className="w-[45px] h-[32px] rounded-lg flex items-center justify-center bg-gray-100/80 border border-gray-200">
                        <div className="text-center">
                          <span className="text-xs text-gray-600">···</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 收起按钮 - 移动到事件卡片位置 */}
                    <div className="ml-6 min-h-[52px] flex items-center flex-1">
                      <button
                        onClick={() => toggleCollapse(item.rangeKey!)}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 transition-colors text-sm text-gray-600"
                      >
                        <span>收起 {item.startAge}岁 - {item.endAge}岁</span>
                        <ChevronUp className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              }

              // 正常年龄显示
              const displayAge = item.age!;
              const careerStage = careerStageStartAges[displayAge];
              
              return (
                <div 
                  key={displayAge} 
                  className="relative flex items-start group"
                  data-age={getActualAge(displayAge)}
                  onDragOver={(e) => onDragOver(e, getActualAge(displayAge))}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(e, getActualAge(displayAge))}
                >
                  {/* Age Marker with Career Info Below */}
                  <div className="relative z-10 flex flex-col items-center w-[80px]">
                    {/* Age Circle */}
                    <div className={`w-[45px] h-[45px] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 text-gray-800 bg-white border-2 ${
                      index % 3 === 0 ? 'border-[#B3EBEF]' :
                      index % 3 === 1 ? 'border-[#CCE9B5]' :
                      'border-[#FFEA96]'
                    }`}>
                      <div className="text-center">
                        <span className="text-base font-light">{displayAge}</span><span className="text-xs opacity-70 font-light ml-0.5">岁</span>
                      </div>
                    </div>
                    
                    {/* Career Stage Info Below Circle */}
                    {careerStage && (
                      <div className="mt-1 text-center w-[75px]">
                        <div className="w-[75px] min-h-[30px] px-1 py-1 bg-gray-100/80 rounded-md border border-gray-200/60 flex items-center justify-center">
                          <span className="text-[10px] text-gray-700 font-medium leading-tight">{careerStage.position}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Events Container */}
                  <div className="flex-1 ml-6 min-h-[52px] flex items-center">
                    {groupedEventsByDisplayAge[displayAge] ? (
                      <div className="flex flex-wrap gap-3 w-full">
                        {groupedEventsByDisplayAge[displayAge].map(event => (
                          <TimelineEvent
                            key={event.id}
                            event={event}
                            isDragged={draggedEvent === event.id || touchDraggedEvent === event.id}
                            colorIndex={index}
                            onDragStart={onDragStart}
                            onDragEnd={onDragEnd}
                            onTouchStart={onTouchStart}
                            isTouchDragging={isTouchDragging && touchDraggedEvent === event.id}
                            touchCurrentPosition={touchCurrentPosition}
                            isDragActive={isDragActive}
                            isAnimating={animatingEvents.includes(event.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      (draggedEvent || touchDraggedEvent) && dragOverAge === getActualAge(displayAge) && (
                        <div className="w-full h-[52px] border-2 border-dashed border-[#B3EBEF] bg-[#B3EBEF]/10 rounded-2xl flex items-center justify-center animate-pulse">
                          <span className="text-sm text-gray-600 font-medium">松开放置事件</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineContent;
