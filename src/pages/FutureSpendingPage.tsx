import React, { useState } from 'react';
import { ArrowLeft, Plus, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import FreeSpendingHeatmap from '@/components/asset-freedom/components/FreeSpendingHeatmap';
import { useNavigationState } from '@/hooks/useNavigationState';
import { useNavigate } from 'react-router-dom';

interface BeneficiaryPlan {
  name: string;
  amount: number;
}

interface SupportPlan {
  age: number;
  year: string;
  maxAmount: number;
  beneficiaries: BeneficiaryPlan[];
}

const FutureSpendingPage: React.FC = () => {
  const { navigateBack } = useNavigationState();
  const navigate = useNavigate();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [supportPlans, setSupportPlans] = useState<SupportPlan[]>([]);

  const handleBack = () => {
    navigateBack();
  };

  const handleSupportPlansChange = (plans: SupportPlan[]) => {
    setSupportPlans(plans);
  };

  const handleConfirmConfig = () => {
    if (supportPlans.length > 0) {
      setShowSuccessDialog(true);
    }
  };

  const handleContinueConfig = () => {
    setShowTipDialog(true);
  };

  const handleCancel = () => {
    setShowSuccessDialog(false);
  };

  const handleCloseTip = () => {
    setShowTipDialog(false);
  };

  const handleViewResult = () => {
    setShowSuccessDialog(false);
    // 导航到发现tab页，使用与现有弹窗相同的逻辑
    navigate('/new', { 
      replace: false,
      state: { 
        activeTab: 'discover'
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen">
        {/* 头部导航 */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="flex items-center p-4">
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 ml-3">
              资助能力分析
            </h1>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="p-4 space-y-4">
          {/* 说明文案 */}
          <Card className="border border-blue-200 bg-blue-50/30">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  什么是资助能力？
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed">
                  资助能力指的是您在满足自身生活需求和储蓄计划后，每年可以用于资助亲人的可支配资金。
                  这些资金可以用于子女教育、父母赡养、亲友帮扶等用途。
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 热力图卡片 */}
          <Card className="border border-gray-200/50 bg-white">
            <CardContent className="p-4">
              <FreeSpendingHeatmap onSupportPlansChange={handleSupportPlansChange} />
            </CardContent>
          </Card>

          {/* 按钮组 */}
          <div className="space-y-3">
            {/* 继续配置其他年份按钮 */}
            <div className="flex justify-center">
              <Button
                onClick={handleContinueConfig}
                variant="outline"
                className="w-full border-[#B3EBEF] text-gray-700 hover:bg-[#B3EBEF]/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                继续配置其他年份
              </Button>
            </div>
            
            {/* 确认配置按钮 - 只有在有资助计划时才显示 */}
            {supportPlans.length > 0 && (
              <div className="flex justify-center">
                <Button
                  onClick={handleConfirmConfig}
                  className="w-full bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] text-gray-900 hover:from-[#A5E0E4] hover:to-[#7DD3D7]"
                >
                  确认配置
                </Button>
              </div>
            )}
          </div>

          {/* 温馨提示 */}
          <Card className="border border-amber-200 bg-amber-50/30">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  温馨提示
                </h3>
                <div className="text-xs text-gray-700 leading-relaxed space-y-1">
                  <p>• 点击热力图中的格子查看具体年份的资助能力</p>
                  <p>• 建议根据实际情况合理规划资助金额，避免影响自身财务安全</p>
                  <p>• 资助能力会随着收入、支出变化而调整</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                  onClick={handleCancel}
                  className="flex-1 text-sm"
                >
                  暂不查看，继续调整
                </Button>
                <Button
                  onClick={handleViewResult}
                  className="flex-1 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] text-gray-900 hover:from-[#A5E0E4] hover:to-[#7DD3D7] text-sm"
                >
                  查看最新财富分型
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Tip Dialog */}
        <Dialog open={showTipDialog} onOpenChange={() => setShowTipDialog(false)}>
          <DialogContent className="max-w-sm">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                配置提示
              </h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                请点击上图表格中的其他年份，即可创建资助计划
              </p>
              <Button
                onClick={handleCloseTip}
                className="w-full bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] text-gray-900 hover:from-[#A5E0E4] hover:to-[#7DD3D7] text-sm"
              >
                知道了
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FutureSpendingPage;