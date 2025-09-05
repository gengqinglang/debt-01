import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNavigationState } from '@/hooks/useNavigationState';
import HousePlanSelector from '@/components/optional-life/HousePlanSelector';
import { useOptionalLifeState } from '@/hooks/useOptionalLifeState';

const JuzhuguihuaPage: React.FC = () => {
  const navigate = useNavigate();
  const { navigateBack } = useNavigationState();
  const state = useOptionalLifeState();
  
  // State for housing motives and success dialog
  const [housingMotives, setHousingMotives] = useState<string[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Handle housing data change with motives
  const handleHousingDataChange = (totalAmount: number, motives: string[]) => {
    console.log('JuzhuguihuaPage: Received housing data:', { totalAmount, motives });
    state.setHousingTotalAmount(totalAmount);
    setHousingMotives(motives);
    
    // Save housing configuration similar to OptionalLifePage
    const housingConfig = {
      amount: totalAmount,
      motives: motives
    };
    
    // Update confirmed configs
    state.setConfirmedConfigs({
      ...state.confirmedConfigs,
      '购房': housingConfig
    });
    
    // Mark configuration as confirmed
    state.setConfigConfirmed({
      ...state.configConfirmed,
      '购房': true
    });
  };

  // Calculate housing total for display
  const housingTotal = useMemo(() => {
    if (state.configConfirmed['购房']) {
      const confirmedConfig = state.confirmedConfigs['购房'];
      return confirmedConfig?.amount || 0;
    }
    return state.housingTotalAmount;
  }, [state.configConfirmed, state.confirmedConfigs, state.housingTotalAmount]);

  // Save housing data to localStorage (similar to OptionalLifePage logic)
  const saveHousingData = () => {
    if (!state.configConfirmed['购房']) {
      console.log('No housing configuration confirmed');
      return;
    }

    const confirmedConfig = state.confirmedConfigs['购房'];
    const housingData = {
      selectedModules: ['购房'],
      totalAmount: confirmedConfig?.amount || 0,
      breakdown: {
        housing: confirmedConfig?.amount || 0
      },
      detailedConfigs: {
        housing: {
          motives: confirmedConfig?.motives || housingMotives || [],
          amount: confirmedConfig?.amount || 0
        }
      }
    };
    
    console.log('Saving housing data:', housingData);
    localStorage.setItem('housingPlanData', JSON.stringify(housingData));
    
    // Show success dialog
    setShowSuccessDialog(true);
  };

  // Handle success dialog actions
  const handleViewLatestWealthType = () => {
    setShowSuccessDialog(false);
    // Navigate to wealth type page or main page
    navigate('/new');
  };

  const handleContinueAdjusting = () => {
    setShowSuccessDialog(false);
    // Stay on current page
  };

  const goBack = () => {
    console.log('[JuzhuguihuaPage] Navigating back using navigateBack');
    navigateBack();
  };

  return (
    <div className="min-h-screen bg-[#F4FDFD] flex flex-col">
      <div className="relative flex flex-col bg-white/90 backdrop-blur-xl flex-1">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#B3EBEF]/20 via-white/60 to-[#B3EBEF]/20">
          <div className="relative p-4">
            {/* Back button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="absolute left-4 top-4 p-0 h-auto text-gray-600 hover:text-gray-800 z-10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            
            {/* Title */}
            <div className="text-center flex flex-col justify-center pt-8" style={{ minHeight: '60px' }}>
              <h1 className="text-lg font-bold text-gray-900 mb-1 tracking-tight">
                居住规划
              </h1>
              <div className="w-20 h-1 mx-auto rounded-full mb-2 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC]"></div>
              <p className="text-gray-700 text-xs font-medium">
                制定您的购房计划和居住安排
              </p>
            </div>
          </div>
        </div>

        {/* Total Amount Display */}
        {housingTotal > 0 && (
          <div className="px-4 py-3">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">购房总预算</span>
                <span className="text-xl font-bold text-green-600">
                  ¥{housingTotal.toFixed(0)}万
                </span>
              </div>
              {housingMotives.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-gray-600">购房动机：</span>
                  <span className="text-xs text-gray-800 ml-1">
                    {housingMotives.join('、')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Housing Plan Selector */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <HousePlanSelector
              initialMotives={housingMotives}
              initialAmount={housingTotal}
              onHousingDataChange={handleHousingDataChange}
            />
          </div>
        </div>

        {/* Save Button */}
        {state.configConfirmed['购房'] && (
          <div className="p-4 bg-white border-t border-gray-200">
            <Button
              onClick={saveHousingData}
              className="w-full bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900 font-medium"
            >
              保存购房规划
            </Button>
          </div>
        )}

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={() => setShowSuccessDialog(false)}>
          <DialogContent className="max-w-sm">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                配置更新成功！
              </h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                您的支出规划已更新，这可能会影响您的财富分型和风险评估结果。建议查看最新的财富分型，了解调整后的财务状况变化。
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleContinueAdjusting}
                  className="flex-1 text-sm"
                >
                  暂不查看，继续调整
                </Button>
                <Button
                  onClick={handleViewLatestWealthType}
                  className="flex-1 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] text-gray-900 hover:from-[#A5E0E4] hover:to-[#7DD3D7] text-sm"
                >
                  查看最新财富分型
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default JuzhuguihuaPage;