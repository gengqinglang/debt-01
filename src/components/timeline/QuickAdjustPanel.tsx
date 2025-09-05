
import React from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Settings, Clock } from 'lucide-react';

interface LifeEvent {
  id: string;
  name: string;
  age: number;
  color: string;
  image: React.ComponentType<{ className?: string }>;
}

interface QuickAdjustPanelProps {
  events: LifeEvent[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isPartnerPerspective: boolean;
  partnerAge: number;
  currentAge: number;
  getDisplayAge: (eventAge: number) => number;
  getActualAge: (displayAge: number) => number;
  onAgeChange: (eventId: string, newAge: number) => void;
}

const QuickAdjustPanel: React.FC<QuickAdjustPanelProps> = ({
  events,
  isOpen,
  onOpenChange,
  isPartnerPerspective,
  partnerAge,
  currentAge,
  getDisplayAge,
  getActualAge,
  onAgeChange
}) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-between p-2.5 mb-3 text-sm font-medium text-gray-700 hover:bg-[#B3EBEF]/20 rounded-xl border border-gray-200 transition-all duration-300 bg-white"
        >
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-[#B3EBEF] rounded-lg flex items-center justify-center">
              <Settings className="w-3 h-3 text-gray-700" />
            </div>
            <span className="text-xs">快速调整事件年龄</span>
          </div>
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0">
        <div className="grid grid-cols-1 gap-1.5 max-h-60 overflow-y-auto mb-4 p-2 bg-gray-50 rounded-lg border border-gray-200">
          {events.map(event => {
            const IconComponent = event.image;
            return (
              <div key={event.id} className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200">
                <div className="relative">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-3 h-3 text-gray-600" />
                  </div>
                </div>
                <span className="flex-1 truncate text-xs font-medium text-gray-700">{event.name}</span>
                <input
                  type="number"
                  value={getDisplayAge(event.age)}
                  onChange={(e) => {
                    const displayAge = parseInt(e.target.value) || 30;
                    const actualAge = getActualAge(displayAge);
                    onAgeChange(event.id, actualAge);
                  }}
                  className="w-12 px-1.5 py-1 border border-gray-200 rounded-lg text-center text-xs focus:outline-none focus:ring-2 focus:ring-[#B3EBEF] focus:border-transparent bg-white"
                  min={isPartnerPerspective ? partnerAge : 30}
                  max={isPartnerPerspective ? 85 - (currentAge - partnerAge) : 85}
                />
                <span className="text-xs text-gray-500 font-medium">岁</span>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default QuickAdjustPanel;
