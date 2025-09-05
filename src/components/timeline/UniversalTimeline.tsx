
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Heart, Baby, Home, GraduationCap, Car, Briefcase, PiggyBank } from 'lucide-react';
import TimelineContent from './TimelineContent';
import QuickAdjustPanel from './QuickAdjustPanel';
import { CareerDataProvider } from '@/components/career/CareerDataProvider';
import { useToast } from '@/hooks/use-toast';

interface LifeEvent {
  id: string;
  name: string;
  age: number;
  color: string;
  image: React.ComponentType<{
    className?: string;
  }>;
}

interface UniversalTimelineProps {
  showHeader?: boolean;
  showQuickAdjust?: boolean;
  showFooterControls?: boolean;
  onEventsChange?: (events: LifeEvent[]) => void;
  className?: string;
}

const UniversalTimeline: React.FC<UniversalTimelineProps> = ({
  showHeader = true,
  showQuickAdjust = true,
  showFooterControls = false,
  onEventsChange,
  className = ""
}) => {
  const { toast } = useToast();
  
  // 使用 useRef 来存储所有定时器，确保组件卸载时能正确清理
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const animationFramesRef = useRef<Set<number>>(new Set());
  
  const [events, setEvents] = useState<LifeEvent[]>([{
    id: '1',
    name: '结婚',
    age: 28,
    color: '#E3F7FA',
    image: Heart
  }, {
    id: '2',
    name: '生育',
    age: 30,
    color: '#E8F5E8',
    image: Baby
  }, {
    id: '3',
    name: '刚需购房',
    age: 32,
    color: '#FFF3E0',
    image: Home
  }, {
    id: '4',
    name: '老大上学',
    age: 36,
    color: '#E3F7FA',
    image: GraduationCap
  }, {
    id: '5',
    name: '买车-通勤神器-8万',
    age: 35,
    color: '#E8F5E8',
    image: Car
  }, {
    id: '10',
    name: '买车-精英座驾40万',
    age: 52,
    color: '#E8F5E8',
    image: Car
  }, {
    id: '6',
    name: '老大毕业',
    age: 52,
    color: '#FFF3E0',
    image: GraduationCap
  }, {
    id: '7',
    name: '本人退休',
    age: 60,
    color: '#E3F7FA',
    image: Briefcase
  }, {
    id: '8',
    name: '伴侣退休',
    age: 58,
    color: '#E8F5E8',
    image: Briefcase
  }, {
    id: '9',
    name: '刚需购房-房贷还完',
    age: 55,
    color: '#FFF3E0',
    image: PiggyBank
  }, {
    id: '13',
    name: '改善购房',
    age: 55,
    color: '#FFF3E0',
    image: Home
  }, {
    id: '14',
    name: '现有房300万-房贷还完',
    age: 58,
    color: '#FFF3E0',
    image: PiggyBank
  }, {
    id: '11',
    name: '本人工作',
    age: 35,
    color: '#E3F7FA',
    image: Briefcase
  }, {
    id: '12',
    name: '伴侣工作',
    age: 35,
    color: '#E8F5E8',
    image: Briefcase
  }]);

  const [isPartnerPerspective, setIsPartnerPerspective] = useState(false);
  const [currentAge, setCurrentAge] = useState(30);
  const [partnerAge, setPartnerAge] = useState(28);
  const [draggedEvent, setDraggedEvent] = useState<string | null>(null);
  const [dragOverAge, setDragOverAge] = useState<number | null>(null);
  const [isQuickAdjustOpen, setIsQuickAdjustOpen] = useState(false);

  // Animation states for linked events
  const [animatingEvents, setAnimatingEvents] = useState<string[]>([]);

  // Touch drag states
  const [isTouchDragging, setIsTouchDragging] = useState(false);
  const [touchDraggedEvent, setTouchDraggedEvent] = useState<string | null>(null);
  const [touchStartPosition, setTouchStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [touchCurrentPosition, setTouchCurrentPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // 安全的定时器创建函数
  const createSafeTimeout = (callback: () => void, delay: number): NodeJS.Timeout => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delay);
    timersRef.current.add(timer);
    return timer;
  };

  // 安全的动画帧创建函数
  const createSafeAnimationFrame = (callback: () => void): number => {
    const frame = requestAnimationFrame(() => {
      animationFramesRef.current.delete(frame);
      callback();
    });
    animationFramesRef.current.add(frame);
    return frame;
  };

  // 清理所有定时器和动画帧
  const cleanupTimers = () => {
    console.log('[UniversalTimeline] Cleaning up all timers and animation frames');
    
    // 清理所有定时器
    timersRef.current.forEach(timer => {
      clearTimeout(timer);
    });
    timersRef.current.clear();
    
    // 清理所有动画帧
    animationFramesRef.current.forEach(frame => {
      cancelAnimationFrame(frame);
    });
    animationFramesRef.current.clear();
    
    // 清理长按定时器
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // 组件卸载时清理所有资源
  useEffect(() => {
    return () => {
      console.log('[UniversalTimeline] Component unmounting, cleaning up all resources');
      cleanupTimers();
    };
  }, []);

  // Notify parent component when events change
  useEffect(() => {
    if (onEventsChange) {
      onEventsChange(events);
    }
  }, [events, onEventsChange]);

  const handleDragStart = (eventId: string) => {
    setDraggedEvent(eventId);
  };

  const handleDragEnd = () => {
    setDraggedEvent(null);
    setDragOverAge(null);
  };

  const handleDragOver = (e: React.DragEvent, age: number) => {
    e.preventDefault();
    setDragOverAge(age);
  };

  const handleDragLeave = () => {
    setDragOverAge(null);
  };

  // Function to update linked events when birth event changes
  const updateLinkedEvents = (birthAge: number) => {
    const schoolAge = birthAge + 6; // 老大6岁上学
    const graduationAge = birthAge + 22; // 老大22岁毕业

    setEvents(prev => prev.map(event => {
      if (event.name === '老大上学') {
        return {
          ...event,
          age: schoolAge
        };
      }
      if (event.name === '老大毕业') {
        return {
          ...event,
          age: graduationAge
        };
      }
      return event;
    }));

    // Add animation effect using safe timer
    setAnimatingEvents(['4', '6']); // IDs for 老大上学和 老大毕业
    createSafeTimeout(() => setAnimatingEvents([]), 1000);

    // Show toast notification
    toast({
      title: "系统自动调整",
      description: `已自动调整老大上学时间至${schoolAge}岁，毕业时间至${graduationAge}岁`,
      duration: 3000
    });
  };

  const handleDrop = (e: React.DragEvent, targetAge: number) => {
    e.preventDefault();
    if (draggedEvent) {
      const draggedEventData = events.find(event => event.id === draggedEvent);

      // Update the dragged event
      setEvents(prev => prev.map(event => event.id === draggedEvent ? {
        ...event,
        age: targetAge
      } : event));

      // If it's the birth event, update linked events using safe timer
      if (draggedEventData?.name === '生育') {
        createSafeTimeout(() => {
          updateLinkedEvents(targetAge);
        }, 300);
      }
    }
    setDraggedEvent(null);
    setDragOverAge(null);
  };

  // Touch event handlers with proper cleanup
  const handleTouchStart = (eventId: string, e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    setTouchStartPosition({
      x: touch.clientX,
      y: touch.clientY
    });
    setTouchCurrentPosition({
      x: touch.clientX,
      y: touch.clientY
    });

    // 清理之前的长按定时器
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }

    // Start long press timer using safe timer
    const timer = createSafeTimeout(() => {
      setIsDragActive(true);
      setTouchDraggedEvent(eventId);
      setIsTouchDragging(true);

      // Vibrate if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
    setLongPressTimer(timer);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragActive) return;
    e.preventDefault();
    const touch = e.touches[0];
    setTouchCurrentPosition({
      x: touch.clientX,
      y: touch.clientY
    });

    // Find which age section the touch is over
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const ageElement = element?.closest('[data-age]');
    if (ageElement) {
      const age = parseInt(ageElement.getAttribute('data-age') || '0');
      setDragOverAge(age);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // 清理长按定时器
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      timersRef.current.delete(longPressTimer);
      setLongPressTimer(null);
    }
    
    if (isDragActive && touchDraggedEvent && dragOverAge) {
      const draggedEventData = events.find(event => event.id === touchDraggedEvent);

      // Drop the event
      setEvents(prev => prev.map(event => event.id === touchDraggedEvent ? {
        ...event,
        age: dragOverAge
      } : event));

      // If it's the birth event, update linked events using safe timer
      if (draggedEventData?.name === '生育') {
        createSafeTimeout(() => {
          updateLinkedEvents(dragOverAge);
        }, 300);
      }
    }

    // Reset all touch states
    setIsTouchDragging(false);
    setTouchDraggedEvent(null);
    setIsDragActive(false);
    setTouchStartPosition(null);
    setTouchCurrentPosition(null);
    setDragOverAge(null);
  };

  const handleAgeChange = (eventId: string, newAge: number) => {
    const eventData = events.find(event => event.id === eventId);
    setEvents(prev => prev.map(event => event.id === eventId ? {
      ...event,
      age: Math.max(30, Math.min(85, newAge))
    } : event));

    // If it's the birth event, update linked events using safe timer
    if (eventData?.name === '生育') {
      createSafeTimeout(() => {
        updateLinkedEvents(Math.max(30, Math.min(85, newAge)));
      }, 100);
    }
  };

  const getDisplayAge = (eventAge: number) => {
    if (isPartnerPerspective) {
      return eventAge - (currentAge - partnerAge);
    }
    return eventAge;
  };

  const getActualAge = (displayAge: number) => {
    if (isPartnerPerspective) {
      return displayAge + (currentAge - partnerAge);
    }
    return displayAge;
  };

  const groupedEventsByDisplayAge = events.reduce((acc, event) => {
    const displayAge = getDisplayAge(event.age);
    if (!acc[displayAge]) {
      acc[displayAge] = [];
    }
    acc[displayAge].push(event);
    return acc;
  }, {} as Record<number, LifeEvent[]>);

  const getDisplayAgeRange = () => {
    if (isPartnerPerspective) {
      const startAge = partnerAge;
      const endAge = Math.min(85, partnerAge + 55);
      return Array.from({
        length: endAge - startAge + 1
      }, (_, i) => startAge + i);
    } else {
      return Array.from({
        length: 56
      }, (_, i) => 30 + i);
    }
  };

  const ageRange = getDisplayAgeRange();

  return (
    <CareerDataProvider>
      <div className={className}>
        <div className="relative h-full flex flex-col min-h-[600px] overflow-hidden">
          {showHeader && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">人生大事时间线</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>当前年龄: {currentAge}岁</span>
                  <span>伴侣年龄: {partnerAge}岁</span>
                </div>
              </div>
            </div>
          )}
          
          <TimelineContent 
            ageRange={ageRange} 
            groupedEventsByDisplayAge={groupedEventsByDisplayAge} 
            draggedEvent={draggedEvent} 
            dragOverAge={dragOverAge} 
            getActualAge={getActualAge} 
            onDragOver={handleDragOver} 
            onDragLeave={handleDragLeave} 
            onDrop={handleDrop} 
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd} 
            isPartnerPerspective={isPartnerPerspective} 
            onPartnerPerspectiveChange={setIsPartnerPerspective} 
            isTouchDragging={isTouchDragging} 
            touchDraggedEvent={touchDraggedEvent} 
            touchCurrentPosition={touchCurrentPosition} 
            isDragActive={isDragActive} 
            onTouchStart={handleTouchStart} 
            onTouchMove={handleTouchMove} 
            onTouchEnd={handleTouchEnd} 
            animatingEvents={animatingEvents} 
            currentAge={currentAge} 
            partnerAge={partnerAge} 
          />

          {showQuickAdjust && (
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <QuickAdjustPanel 
                events={events} 
                isOpen={isQuickAdjustOpen} 
                onOpenChange={setIsQuickAdjustOpen} 
                isPartnerPerspective={isPartnerPerspective} 
                partnerAge={partnerAge} 
                currentAge={currentAge} 
                getDisplayAge={getDisplayAge} 
                getActualAge={getActualAge} 
                onAgeChange={handleAgeChange} 
              />
            </div>
          )}
        </div>
      </div>
    </CareerDataProvider>
  );
};

export default UniversalTimeline;
