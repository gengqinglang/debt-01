
import React, { useState } from 'react';
import { Bot, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const FloatingAIChat = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full">
      {/* Fixed AI Assistant Entry */}
      {!isExpanded && (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-[#CCE9B5] p-4 mb-3">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=40&h=40&fit=crop&crop=face" />
              <AvatarFallback className="bg-[#CCE9B5]/30">
                <Bot className="w-5 h-5 text-gray-700" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">AI职业规划助手</h3>
              <p className="text-xs text-gray-600">点击开始对话</p>
            </div>
          </div>
          <Button
            onClick={toggleExpanded}
            className="w-full bg-[#CCE9B5] hover:bg-[#B3EBEF] text-gray-800 font-medium text-sm py-2"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            开始咨询
          </Button>
        </div>
      )}

      {/* Expanded AI Chat Window */}
      {isExpanded && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-96 flex flex-col overflow-hidden animate-scale-in mb-3">
          {/* Header */}
          <div className="bg-[#CCE9B5] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=32&h=32&fit=crop&crop=face" />
                <AvatarFallback className="bg-white/30">
                  <Bot className="w-4 h-4 text-gray-700" />
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-gray-800">AI职业规划助手</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleExpanded}
              className="p-1 h-auto text-gray-700 hover:text-gray-900 hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 p-4 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#CCE9B5]/30 flex items-center justify-center mx-auto mb-3">
                <Bot className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-600 text-sm mb-3">
                您好！我是您的AI职业规划助手
              </p>
              <p className="text-gray-500 text-xs">
                点击开始与我对话，获取个性化的职业建议
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200">
            <Button 
              className="w-full bg-[#CCE9B5] hover:bg-[#B3EBEF] text-gray-800 font-medium"
              onClick={() => {
                // TODO: 实现AI聊天功能
                console.log('开始AI对话');
              }}
            >
              开始对话
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingAIChat;
