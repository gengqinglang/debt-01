
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calculator, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ExpenditureBreakdown {
  marriage?: number;
  birth?: number;
  housing?: number;
  car?: number;
  travel?: number;
  care?: number;
}

interface TotalExpenditureDisplayProps {
  totalAmount: number;
  breakdown: ExpenditureBreakdown;
  selectedModules: string[];
}

const TotalExpenditureDisplay: React.FC<TotalExpenditureDisplayProps> = ({
  totalAmount,
  breakdown,
  selectedModules
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');

  const handleHelpClick = () => {
    setDialogOpen(true);
  };

  const moduleNames = {
    marriage: '结婚',
    birth: '生育',
    housing: '购房',
    car: '购车',
    travel: '旅游',
    care: '赡养'
  };

  const moduleExplanations = {
    marriage: '结婚支出包含婚礼费用、彩礼、蜜月旅行等所有结婚相关开销',
    birth: '生育支出包含孕期检查、分娩费用、产后护理、婴儿用品等生育相关开销',
    housing: '购房支出包含房款、装修费用、后续的养房成本（物业费、维修等）',
    car: '购车支出包含车辆购置费、保险费、养车成本（保养、油费等）',
    travel: '旅游支出包含度假旅行、交通费用、住宿餐饮等休闲娱乐开销',
    care: '赡养支出包含父母日常生活费、医疗费、护理费等赡养相关开销'
  };

  const handleItemHelpClick = (key: string) => {
    setSelectedItem(key);
    setItemDialogOpen(true);
  };

  const formatAmount = (amount: number) => {
    return amount.toFixed(0);
  };

  return (
    <Card className="mb-6 bg-gradient-to-r from-[#B3EBEF]/20 to-[#8FD8DC]/20 border-[#B3EBEF] shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] rounded-full flex items-center justify-center">
              <Calculator className="w-4 h-4 text-gray-900" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">未来人生总支出</h3>
              <HelpCircle 
                className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                onClick={handleHelpClick}
              />
            </div>
          </div>
          <div className="text-right">
            <div 
              className="flex items-center gap-2 cursor-pointer transition-all duration-300"
              onClick={() => selectedModules.length > 0 && setShowBreakdown(!showBreakdown)}
            >
              <div className="text-base font-bold text-gray-900">
                {formatAmount(totalAmount)}万
              </div>
              {selectedModules.length > 0 && (
                showBreakdown ? (
                  <ChevronUp className="w-4 h-4 text-gray-600 hover:text-gray-900 transition-colors" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600 hover:text-gray-900 transition-colors" />
                )
              )}
            </div>
          </div>
        </div>
        
        {showBreakdown && selectedModules.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 animate-fade-in">
             {Object.entries(breakdown).map(([key, amount]) => {
               if (!amount || amount === 0) return null;
               const moduleName = moduleNames[key as keyof typeof moduleNames];
               return (
                 <div key={key} className="flex justify-between items-center text-sm">
                   <div className="flex items-center gap-2">
                     <span className="text-gray-700">{moduleName}</span>
                     <HelpCircle 
                       className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                       onClick={() => handleItemHelpClick(key)}
                     />
                   </div>
                   <span className="font-medium text-gray-900">{formatAmount(amount)}万</span>
                 </div>
               );
             })}
           </div>
         )}
       </div>

       {/* 总支出解释弹窗 */}
       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle>未来人生总支出</DialogTitle>
           </DialogHeader>
           <DialogDescription className="text-sm leading-relaxed text-gray-700">
             此处需要解释一下未来人生支出考虑了增长率
           </DialogDescription>
         </DialogContent>
       </Dialog>

       {/* 支出项解释弹窗 */}
       <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
         <DialogContent className="max-w-md">
           <DialogHeader>
             <DialogTitle>{moduleNames[selectedItem as keyof typeof moduleNames]}支出说明</DialogTitle>
           </DialogHeader>
           <DialogDescription className="text-sm leading-relaxed text-gray-700">
             {moduleExplanations[selectedItem as keyof typeof moduleExplanations]}
           </DialogDescription>
         </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TotalExpenditureDisplay;
