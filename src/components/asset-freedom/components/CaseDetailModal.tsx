import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CaseItem } from '@/data/practicalCases';

interface CaseDetailModalProps {
  case_: CaseItem;
  open: boolean;
  onClose: () => void;
}

const CaseDetailModal: React.FC<CaseDetailModalProps> = ({ case_, open, onClose }) => {
  const navigate = useNavigate();

  const handleFunctionClick = (functionLink: { label: string; route: string; params?: any }) => {
    onClose(); // 关闭弹窗
    if (functionLink.params) {
      navigate(functionLink.route, { state: functionLink.params });
    } else {
      navigate(functionLink.route);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <DialogTitle className="text-xl font-bold text-gray-800 mb-2">
                {case_.title}
              </DialogTitle>
              <div className="flex items-center space-x-2 mb-4">
                <Badge className="bg-[#CAF4F7]/20 text-[#0891b2] border-[#CAF4F7]/50">
                  {case_.category}
                </Badge>
                <span className="text-sm text-gray-500">
                  实用指导案例
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 图片区域 */}
          <div className="relative h-64 overflow-hidden rounded-lg bg-gray-50">
            <img 
              src={case_.image} 
              alt={case_.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDYwMCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iMjU2IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNTAgMTAwSDM1MFYxNTZIMjUwVjEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
              }}
            />
          </div>

          {/* 简述 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">案例概述</h3>
            <p className="text-gray-600 leading-relaxed">
              {case_.description}
            </p>
          </div>

          {/* 标签 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">相关标签</h3>
            <div className="flex flex-wrap gap-2">
              {case_.tags.map((tag, index) => (
                <span key={index} className="text-sm px-3 py-1 bg-[#CAF4F7]/20 text-[#0891b2] rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 详细内容 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">详细指导</h3>
            <div className="bg-[#CAF4F7]/10 rounded-lg p-4 border border-[#CAF4F7]/20">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {case_.detailContent}
              </p>
            </div>
          </div>

          {/* 相关功能 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">相关功能</h3>
            <div className="space-y-3">
              {case_.functionLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleFunctionClick(link)}
                  className="w-full justify-between text-left border-[#CAF4F7]/30 hover:bg-[#CAF4F7]/10 hover:border-[#CAF4F7]/50 h-auto py-3"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{link.label}</span>
                    <span className="text-xs text-gray-500 mt-1">
                      点击使用系统功能解决实际问题
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                </Button>
              ))}
            </div>
          </div>

          {/* 底部提示 */}
          <div className="bg-gradient-to-r from-[#B3EBEF]/10 to-[#9FE6EB]/10 rounded-lg p-4 border border-[#B3EBEF]/20">
            <p className="text-sm text-gray-700 text-center">
              💡 <strong>温馨提示：</strong>每个人的财务状况不同，建议结合自身实际情况制定个性化方案
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaseDetailModal;