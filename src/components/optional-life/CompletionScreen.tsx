
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';

interface CompletionScreenProps {
  onCompleteSelection: () => void;
  onBackToSelection: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  onCompleteSelection,
  onBackToSelection
}) => {
  return (
    <div className="flex-1 p-3 overflow-y-auto pb-28">
      <div className="max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">配置完成！</h2>
            <p className="text-gray-600">已完成所有选定项目的配置</p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={onCompleteSelection}
              className="w-full py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:from-[#A0E4E9] hover:to-[#7DD3D7] text-gray-900 shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02]"
            >
              <span className="flex items-center justify-center gap-2">
                继续下一步
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
            <Button
              onClick={onBackToSelection}
              variant="outline"
              className="w-full py-3 text-sm font-bold rounded-xl"
            >
              重新选择项目
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
