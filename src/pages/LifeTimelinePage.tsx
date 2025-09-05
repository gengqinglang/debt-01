import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Settings2 } from 'lucide-react';
import UniversalTimeline from '@/components/timeline/UniversalTimeline';
import TimelineHeader from '@/components/timeline/TimelineHeader';
import QuickAdjustPanel from '@/components/timeline/QuickAdjustPanel';

const LifeTimelinePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-scroll to top when component mounts (fixes mobile navigation issue)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [currentAge, setCurrentAge] = useState(30);
  const [partnerAge, setPartnerAge] = useState(28);
  const [isQuickAdjustOpen, setIsQuickAdjustOpen] = useState(false);
  const [events, setEvents] = useState([]);


  // Check if user came from expenditure page
  const showBackButton = location.state?.from === 'expenditure';
  
  // Check if user came from /new page planning tab life-events module
  const isFromLifeEvents = location.state?.from === 'expenditure' || 
                          (location.state?.activeTab === 'planning' && location.state?.activePlanningTab === 'life-events');

  const goToNext = () => {
    navigate('/rongzijuece');
  };

  const goBack = () => {
    // 返回到规划tab的生涯支出页面
    navigate('/new', { 
      state: { 
        activeTab: 'planning', 
        activePlanningTab: 'life-events'
      } 
    });
  };

  const getDisplayAge = (eventAge: number) => {
    return eventAge;
  };

  const getActualAge = (displayAge: number) => {
    return displayAge;
  };

  const handleAgeChange = (eventId: string, newAge: number) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, age: newAge } : event
    ));
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* 手机屏幕容器 */}
      <div className="max-w-md mx-auto relative min-h-screen bg-white border-x border-gray-100">
        {/* 优化容器布局 - 防止header溢出 */}
        <div className="relative h-full flex flex-col min-h-screen pb-32">
        {/* Conditional Back Button */}
        {showBackButton && (
          <div className="p-3 border-b border-gray-200">
            <Button
              onClick={goBack}
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回生涯支出</span>
            </Button>
          </div>
        )}
        
        <TimelineHeader 
          currentAge={currentAge}
          partnerAge={partnerAge}
          onCurrentAgeChange={setCurrentAge}
          onPartnerAgeChange={setPartnerAge}
          readonly={isFromLifeEvents}
        />
        
        <UniversalTimeline 
          showHeader={false}
          showQuickAdjust={false}
          showFooterControls={false}
          className="flex-1"
          onEventsChange={setEvents}
        />

        {/* 悬浮球 - 快速调整入口 */}
        <div className="fixed bottom-24 right-[calc(50%-24rem/2+1rem)] z-40">
          <div className="relative group">
            <button
              onClick={() => setIsQuickAdjustOpen(!isQuickAdjustOpen)}
              className="w-14 h-14 bg-gradient-to-br from-[#B3EBEF] to-[#8FD8DC] hover:from-[#A5E0E4] hover:to-[#7DD3D7] text-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
            >
              <Settings2 className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
            </button>
            
            {/* 悬浮球标签 */}
            <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              调整
            </div>
          </div>
        </div>

        {/* Quick Adjust Panel - 当悬浮球被点击时显示 */}
        {isQuickAdjustOpen && (
          <div className="fixed bottom-80 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-xl z-50 animate-fade-in">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-medium text-gray-800">快速调整事件时间</h3>
              <button
                onClick={() => setIsQuickAdjustOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-3 bg-gray-50 max-h-60 overflow-y-auto">
              <QuickAdjustPanel 
                events={events} 
                isOpen={true} 
                onOpenChange={() => {}} 
                isPartnerPerspective={false} 
                partnerAge={partnerAge} 
                currentAge={currentAge} 
                getDisplayAge={getDisplayAge} 
                getActualAge={getActualAge} 
                onAgeChange={handleAgeChange} 
              />
            </div>
          </div>
        )}

        {/* Fixed Footer Controls - 固定在手机屏幕底部 */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-3 bg-gray-50 border-t border-gray-200 shadow-lg z-50">
          <div className="w-full space-y-3">
            <Button onClick={goToNext} className="w-full py-2.5 bg-[#B3EBEF] hover:bg-[#9FE6EB] text-gray-800 font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border border-white">
              <span>确认时间线</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LifeTimelinePage;
