import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, DollarSign, Target, Building } from 'lucide-react';
import CongratulationsModal from '../CongratulationsModal';

interface UpdateConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigateToModule: (module: 'life-events' | 'career-income' | 'assets-liabilities') => void;
  onUpdateComplete?: () => void;
}

type ModuleStatus = 'unconfirmed' | 'confirmed' | 'needs-update';

const UpdateConfirmationModal: React.FC<UpdateConfirmationModalProps> = ({
  open,
  onOpenChange,
  onNavigateToModule,
  onUpdateComplete
}) => {
  const [moduleStatuses, setModuleStatuses] = useState<Record<string, ModuleStatus>>({
    expenditure: 'unconfirmed',
    income: 'unconfirmed',
    assets: 'unconfirmed'
  });
  const [showCongratulationsModal, setShowCongratulationsModal] = useState(false);

  const handleNoUpdateNeeded = (moduleKey: string) => {
    setModuleStatuses(prev => ({
      ...prev,
      [moduleKey]: 'confirmed'
    }));
  };

  const handleGoUpdate = (moduleKey: string, navigationModule: 'life-events' | 'career-income' | 'assets-liabilities') => {
    setModuleStatuses(prev => ({
      ...prev,
      [moduleKey]: 'needs-update'
    }));
    onOpenChange(false);
    onNavigateToModule(navigationModule);
  };

  const handleConfirmUpdate = () => {
    setShowCongratulationsModal(true);
  };

  const handleCongratulationsClose = () => {
    setShowCongratulationsModal(false);
    onOpenChange(false);
    if (onUpdateComplete) {
      onUpdateComplete();
    }
  };

  // 检查是否所有模块都已确认
  const allModulesConfirmed = Object.values(moduleStatuses).every(status => status === 'confirmed');

  const modules = [
    {
      key: 'expenditure',
      title: '支出规划',
      description: '包含必需生活、可选生活等各项支出计划',
      icon: DollarSign,
      navigationModule: 'life-events' as const,
      color: 'blue'
    },
    {
      key: 'income',
      title: '收入规划',
      description: '包含工作收入、投资收入等各项收入计划',
      icon: Target,
      navigationModule: 'career-income' as const,
      color: 'green'
    },
    {
      key: 'assets',
      title: '资产负债',
      description: '包含房产、金融资产、负债等财务状况',
      icon: Building,
      navigationModule: 'assets-liabilities' as const,
      color: 'purple'
    }
  ];

  const getStatusBadge = (status: ModuleStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <Check className="w-3 h-3 mr-1" />
            已确认
          </Badge>
        );
      case 'needs-update':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            去更新
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-semibold">
              确认信息更新
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm text-gray-600 text-center mb-6">
              请确认以下信息是否需要更新，以确保财富分析的准确性
            </div>

            {modules.map((module) => {
              const Icon = module.icon;
              const status = moduleStatuses[module.key];
              
              return (
                <div key={module.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      module.color === 'blue' ? 'bg-blue-100' :
                      module.color === 'green' ? 'bg-green-100' :
                      'bg-purple-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        module.color === 'blue' ? 'text-blue-600' :
                        module.color === 'green' ? 'text-green-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-800">{module.title}</h3>
                        {getStatusBadge(status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                      
                      <div className="flex space-x-2">
                        {status === 'confirmed' ? (
                          <Button
                            onClick={() => handleGoUpdate(module.key, module.navigationModule)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            去更新
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        ) : (
                          <>
                            <Button
                              onClick={() => handleNoUpdateNeeded(module.key)}
                              variant="outline"
                              size="sm"
                              className="text-gray-600 border-gray-300 hover:bg-gray-50"
                            >
                              无需更新
                            </Button>
                            <Button
                              onClick={() => handleGoUpdate(module.key, module.navigationModule)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              去更新
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="pt-4 border-t border-gray-200 space-y-3">
              {/* 确认按钮 */}
              <Button
                onClick={handleConfirmUpdate}
                disabled={!allModulesConfirmed}
                className={`w-full ${allModulesConfirmed ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
              >
                确认
              </Button>
              
              {/* 全部无需更新按钮 */}
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                全部无需更新
              </Button>
              
              {/* 稍后处理按钮 */}
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="w-full"
              >
                稍后处理
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 恭喜弹窗 */}
      <CongratulationsModal
        isOpen={showCongratulationsModal}
        onClose={handleCongratulationsClose}
        isMembershipSuccess={false}
        isWealthTypingUpdate={true}
      />
    </>
  );
};

export default UpdateConfirmationModal;