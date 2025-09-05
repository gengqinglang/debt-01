
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GripVertical } from 'lucide-react';

interface LifeEvent {
  id: string;
  name: string;
  age: number;
  color: string;
  image: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}

interface TimelineEventProps {
  event: LifeEvent;
  isDragged: boolean;
  colorIndex: number;
  onDragStart: (eventId: string) => void;
  onDragEnd: () => void;
  onTouchStart: (eventId: string, e: React.TouchEvent) => void;
  isTouchDragging?: boolean;
  touchCurrentPosition?: { x: number; y: number } | null;
  isDragActive?: boolean;
  isAnimating?: boolean;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({
  event,
  isDragged,
  colorIndex,
  onDragStart,
  onDragEnd,
  onTouchStart,
  isTouchDragging = false,
  touchCurrentPosition = null,
  isDragActive = false,
  isAnimating = false
}) => {
  const IconComponent = event.image;

  // 根据colorIndex确定背景颜色，使用90%透明度
  const getCardBackgroundColor = (index: number) => {
    const colorIndex = index % 3;
    if (colorIndex === 0) return 'bg-[#A0E4E8]/90'; // 90%透明度的薄荷色系
    if (colorIndex === 1) return 'bg-[#CCE9B5]/90'; // 90%透明度的绿色系
    return 'bg-[#FFE8B3]/90'; // 90%透明度的黄色系
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    onTouchStart(event.id, e);
  };

  // Calculate position for floating drag preview
  const cardWidth = 200;
  const floatingStyle = isTouchDragging && touchCurrentPosition ? {
    position: 'fixed' as const,
    left: touchCurrentPosition.x - (cardWidth / 2), // Center the card on touch position
    top: touchCurrentPosition.y - 26,
    zIndex: 1000,
    pointerEvents: 'none' as const,
    transform: 'scale(1.1)',
    opacity: 0.9
  } : {};

  return (
    <>
      <Card 
        className={`shadow-lg cursor-move transform transition-all duration-300 hover:scale-105 hover:shadow-xl w-[200px] h-[52px] timeline-event ${
          isDragged && !isTouchDragging ? 'opacity-50 scale-95' : ''
        } ${isDragActive ? 'scale-110 shadow-2xl' : ''} ${isTouchDragging ? 'opacity-30' : ''} ${
          isAnimating ? 'animate-pulse scale-110 ring-2 ring-blue-400 ring-opacity-50' : ''
        } ${getCardBackgroundColor(colorIndex)}`}
        draggable={!isDragActive}
        onDragStart={() => onDragStart(event.id)}
        onDragEnd={onDragEnd}
        onTouchStart={handleTouchStart}
        style={{ touchAction: 'none' }}
      >
        <CardContent className="p-1.5 flex items-center space-x-1.5 h-full">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-gray-600" strokeWidth={1.2} />
          </div>
          <div className="flex items-center space-x-1 flex-1">
            <GripVertical className="w-2 h-2 text-gray-400" />
            <span className="text-xs font-semibold text-gray-800 truncate">{event.name}</span>
          </div>
        </CardContent>
      </Card>

      {/* Floating drag preview for touch */}
      {isTouchDragging && touchCurrentPosition && (
        <Card 
          className={`shadow-2xl w-[200px] h-[52px] timeline-event ${getCardBackgroundColor(colorIndex)}`}
          style={floatingStyle}
        >
          <CardContent className="p-1.5 flex items-center space-x-1.5 h-full">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-gray-600" strokeWidth={1.2} />
            </div>
            <div className="flex items-center space-x-1 flex-1">
              <GripVertical className="w-2 h-2 text-gray-400" />
              <span className="text-xs font-semibold text-gray-800 truncate">{event.name}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default TimelineEvent;
