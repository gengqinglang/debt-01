
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Edit3 } from 'lucide-react';

interface ConfigurationConfirmationProps {
  isConfirmed: boolean;
  onConfirm: () => void;
  onEdit: () => void;
  canConfirm?: boolean;
}

const ConfigurationConfirmation: React.FC<ConfigurationConfirmationProps> = ({
  isConfirmed,
  onConfirm,
  onEdit,
  canConfirm = true
}) => {
  if (!canConfirm) {
    return null;
  }

  return (
    <div className="mt-8 mb-12">
      {isConfirmed ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-green-800 font-medium">配置已确认</span>
          </div>
          <Button
            onClick={onEdit}
            variant="outline"
            size="sm"
            className="border-green-300 text-green-700 hover:bg-green-100 flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            修改配置
          </Button>
        </div>
      ) : (
        <Button
          onClick={onConfirm}
          className="w-full py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:from-[#A0E4E9] hover:to-[#7DD3D7] text-gray-900 shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02]"
        >
          <span className="flex items-center justify-center gap-2">
            确认此项配置
            <Check className="w-4 h-4" />
          </span>
        </Button>
      )}
    </div>
  );
};

export default ConfigurationConfirmation;
