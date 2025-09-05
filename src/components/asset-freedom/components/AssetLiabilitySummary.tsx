
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, TrendingUp, TrendingDown, Plus, X, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AssetItem {
  id: string;
  name: string;
  amount: number;
}

interface LoanItem {
  id: string;
  name: string;
  monthlyPayment: number;
  remainingMonths: number;
  propertyId?: string; // 关联的房产ID
  vehicleId?: string; // 关联的车辆ID
}

interface AssetLiabilityData {
  financialAssets: number;
  properties: AssetItem[];
  vehicles: AssetItem[];
  otherAssets: number;
  mortgages: LoanItem[];
  carLoans: LoanItem[];
  consumerLoans: LoanItem[];
}

// 清理名称中的数字
const cleanItemName = (name: string) => {
  return name.replace(/\d+$/, '');
};

const AssetLiabilitySummary = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  // 数据更新时间
  const [lastUpdateTime, setLastUpdateTime] = useState<string>(() => {
    const saved = localStorage.getItem('asset_liability_last_update_time');
    return saved || new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  // 更新时间的函数
  const updateLastModifiedTime = () => {
    const newTime = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    setLastUpdateTime(newTime);
    localStorage.setItem('asset_liability_last_update_time', newTime);
  };
  const [addSubjectModalOpen, setAddSubjectModalOpen] = useState(false);
  
  // 资产负债数据 - 与 FinancialStatusContent 保持一致的结构
  const [assetLiabilityData, setAssetLiabilityData] = useState<AssetLiabilityData>(() => {
    const saved = localStorage.getItem('assetLiabilityData');
    if (saved) {
      const parsedData = JSON.parse(saved);
      // 确保只有一个房贷项目
      if (parsedData.mortgages && parsedData.mortgages.length > 1) {
        parsedData.mortgages = [parsedData.mortgages[0]];
      }
      // 强制更新其他实物资产为20万
      parsedData.otherAssets = 20;
      localStorage.setItem('assetLiabilityData', JSON.stringify(parsedData));
      return parsedData;
    }
    return {
      financialAssets: 50,
      properties: [{ id: '1', name: '房产1', amount: 400 }],
      vehicles: [{ id: '2', name: '车辆1', amount: 25 }],
      otherAssets: 20,
      mortgages: [{ id: '3', name: '房贷1', monthlyPayment: 8000, remainingMonths: 240 }],
      carLoans: [{ id: '4', name: '车贷1', monthlyPayment: 2000, remainingMonths: 36 }],
      consumerLoans: [{ id: '5', name: '消费贷1', monthlyPayment: 5000, remainingMonths: 12 }]
    };
  });

  // 保存数据到localStorage
  useEffect(() => {
    localStorage.setItem('assetLiabilityData', JSON.stringify(assetLiabilityData));
  }, [assetLiabilityData]);

  // 计算汇总数据
  const totalAssets = assetLiabilityData.financialAssets + 
    assetLiabilityData.properties.reduce((sum, item) => sum + item.amount, 0) +
    assetLiabilityData.vehicles.reduce((sum, item) => sum + item.amount, 0) +
    assetLiabilityData.otherAssets;

  const totalLiabilities = 
    assetLiabilityData.mortgages.reduce((sum, item) => sum + (item.monthlyPayment * item.remainingMonths / 10000), 0) +
    assetLiabilityData.carLoans.reduce((sum, item) => sum + (item.monthlyPayment * item.remainingMonths / 10000), 0) +
    assetLiabilityData.consumerLoans.reduce((sum, item) => sum + (item.monthlyPayment * item.remainingMonths / 10000), 0);

  const netWorth = totalAssets - totalLiabilities;

  const formatAmount = (amount: number) => {
    return amount.toFixed(0);
  };

  const handleEditItem = (category: string, itemId?: string) => {
    setEditingCategory(category);
    setEditingItemId(itemId || null);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setEditingCategory(null);
    setEditingItemId(null);
  };

  const handleSaveData = (newData: Partial<AssetLiabilityData>) => {
    setAssetLiabilityData(prev => ({ ...prev, ...newData }));
    updateLastModifiedTime();
    handleCloseModal();
    setSuccessDialogOpen(true);
  };

  // 获取可选的科目类型（排除已有的科目）
  const getAvailableSubjects = () => {
    const allSubjects = [
      { key: 'financial-assets', name: '金融资产', type: 'asset' },
      { key: 'properties', name: '房产', type: 'asset' },
      { key: 'vehicles', name: '车辆', type: 'asset' },
      { key: 'other-assets', name: '其他实物资产', type: 'asset' },
      { key: 'mortgages', name: '房贷', type: 'liability' },
      { key: 'car-loans', name: '车贷', type: 'liability' },
      { key: 'consumer-loans', name: '消费贷', type: 'liability' }
    ];

    return allSubjects.filter(subject => {
      switch (subject.key) {
        case 'financial-assets':
          return assetLiabilityData.financialAssets === 0;
        case 'properties':
          return assetLiabilityData.properties.length === 0;
        case 'vehicles':
          return assetLiabilityData.vehicles.length === 0;
        case 'other-assets':
          return false; // 其他实物资产始终显示，不在新增列表中
        case 'mortgages':
          return assetLiabilityData.mortgages.length === 0;
        case 'car-loans':
          return assetLiabilityData.carLoans.length === 0;
        case 'consumer-loans':
          return assetLiabilityData.consumerLoans.length === 0;
        default:
          return false;
      }
    });
  };

  const handleAddSubject = (subjectKey: string) => {
    setAddSubjectModalOpen(false);
    // 立即进入编辑状态
    setEditingCategory(subjectKey);
    setEditingItemId(null);
    setEditModalOpen(true);
  };

  // 渲染资产科目
  const renderAssetItems = () => {
    const items = [];
    
    // 金融资产
    if (assetLiabilityData.financialAssets > 0) {
      items.push({
        id: 'financial',
        name: '金融资产',
        amount: assetLiabilityData.financialAssets,
        category: '金融资产',
        type: 'asset' as const,
        editCategory: 'financial-assets'
      });
    }

    // 房产
    assetLiabilityData.properties.forEach(property => {
      items.push({
        id: property.id,
        name: property.name,
        amount: property.amount,
        category: '房产',
        type: 'asset' as const,
        editCategory: 'properties'
      });
    });

    // 车辆
    assetLiabilityData.vehicles.forEach(vehicle => {
      items.push({
        id: vehicle.id,
        name: vehicle.name,
        amount: vehicle.amount,
        category: '车辆',
        type: 'asset' as const,
        editCategory: 'vehicles'
      });
    });

    // 其他资产 - 始终显示
    items.push({
      id: 'other',
      name: '其他实物资产',
      amount: assetLiabilityData.otherAssets,
      category: '其他实物资产',
      type: 'asset' as const,
      editCategory: 'other-assets'
    });

    return items.sort((a, b) => b.amount - a.amount);
  };

  // 渲染负债科目
  const renderLiabilityItems = () => {
    const items = [];

    // 房贷
    assetLiabilityData.mortgages.forEach(mortgage => {
      const totalAmount = mortgage.monthlyPayment * mortgage.remainingMonths / 10000;
      items.push({
        id: mortgage.id,
        name: mortgage.name,
        amount: totalAmount,
        category: '房贷',
        type: 'liability' as const,
        editCategory: 'mortgages'
      });
    });

    // 车贷
    assetLiabilityData.carLoans.forEach(carLoan => {
      const totalAmount = carLoan.monthlyPayment * carLoan.remainingMonths / 10000;
      items.push({
        id: carLoan.id,
        name: carLoan.name,
        amount: totalAmount,
        category: '车贷',
        type: 'liability' as const,
        editCategory: 'car-loans'
      });
    });

    // 消费贷
    assetLiabilityData.consumerLoans.forEach(consumerLoan => {
      const totalAmount = consumerLoan.monthlyPayment * consumerLoan.remainingMonths / 10000;
      items.push({
        id: consumerLoan.id,
        name: consumerLoan.name,
        amount: totalAmount,
        category: '消费贷',
        type: 'liability' as const,
        editCategory: 'consumer-loans'
      });
    });

    return items.sort((a, b) => b.amount - a.amount);
  };

  const handleViewWealthTyping = () => {
    setSuccessDialogOpen(false);
    navigate('/new', {
      state: {
        activeTab: 'planning',
        activePlanningTab: 'wealth-typing'
      }
    });
  };

  const handleContinueAdjusting = () => {
    setSuccessDialogOpen(false);
  };

  const availableSubjects = getAvailableSubjects();

  return (
    <div className="space-y-3">
      {/* 大卡片容器 */}
      <Card className="bg-gradient-to-r from-[#B3EBEF]/10 to-[#87CEEB]/10 border-[#B3EBEF] shadow-lg rounded-xl">
        <CardContent className="p-4">
          {/* 净资产、总资产、总负债三个卡片 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#B3EBEF] to-[#87CEEB] rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-gray-900" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">资产负债状况</h3>
                <p className="text-xs text-gray-500 mt-1">最后更新：{lastUpdateTime}</p>
              </div>
            </div>
          </div>

          {/* 净资产、总资产、总负债展示为三个并列卡片 */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/60 rounded-lg p-3 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">净资产</div>
              <div className="text-sm font-bold text-blue-600">{formatAmount(netWorth)}万</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">总资产</div>
              <div className="text-sm font-bold text-green-600">{formatAmount(totalAssets)}万</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3 border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">总负债</div>
              <div className="text-sm font-bold text-red-600">{formatAmount(totalLiabilities)}万</div>
            </div>
          </div>

          {/* 资产模块 */}
          <div className="mb-6">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-800">资产明细</h4>
            </div>
            <div className="space-y-2">
              {renderAssetItems().map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between py-3 bg-white/60 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center flex-1 pl-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">{cleanItemName(item.name)}</h5>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pr-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-600">
                        {formatAmount(item.amount)}万
                      </div>
                      <div className="text-xs text-gray-500">
                        占比 {totalAssets > 0 ? ((item.amount / totalAssets) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                    <Button
                      onClick={() => handleEditItem(item.editCategory, item.id)}
                      size="sm"
                      variant="ghost"
                      className="p-1 h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 负债模块 */}
          <div className="mb-6">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-800">负债明细</h4>
            </div>
            <div className="space-y-2">
              {renderLiabilityItems().map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between py-3 bg-white/60 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center flex-1 pl-3">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">{cleanItemName(item.name)}</h5>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pr-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-red-600">
                        {formatAmount(item.amount)}万
                      </div>
                      <div className="text-xs text-gray-500">
                        占比 {totalLiabilities > 0 ? ((item.amount / totalLiabilities) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                    <Button
                      onClick={() => handleEditItem(item.editCategory, item.id)}
                      size="sm"
                      variant="ghost"
                      className="p-1 h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 新增科目按钮 - 移到卡片内部底部 */}
          {availableSubjects.length > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={() => setAddSubjectModalOpen(true)}
                className="w-full bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 px-6 py-2 rounded-lg flex items-center justify-center gap-2"
                variant="outline"
              >
                <Plus className="w-4 h-4" />
                添加资产负债
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 精准分型提示卡片 */}
      <Card className="bg-gradient-to-r from-[#B3EBEF]/5 to-[#87CEEB]/5 border border-[#B3EBEF]/20">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#B3EBEF] to-[#87CEEB] rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-gray-800" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-800 mb-1">让分型结果更精准</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                详细录入您的资产负债信息，系统将实时更新财富分型结果，为您提供更精准的财务分析和建议方案
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 新增科目选择弹窗 */}
      <Dialog open={addSubjectModalOpen} onOpenChange={setAddSubjectModalOpen}>
        <DialogContent className="w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#B3EBEF]" />
              选择要新增的科目
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              {availableSubjects.map((subject) => (
                <Button
                  key={subject.key}
                  onClick={() => handleAddSubject(subject.key)}
                  variant="outline"
                  className="w-full justify-start h-12 bg-white/60 border-gray-200 hover:bg-[#B3EBEF]/10"
                >
                  <div className="flex items-center gap-3">
                    {subject.type === 'asset' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{subject.name}</div>
                      <div className="text-xs text-gray-500">
                        {subject.type === 'asset' ? '资产科目' : '负债科目'}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setAddSubjectModalOpen(false)}
            >
              取消
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 编辑弹窗 */}
      <AssetLiabilityEditDialog
        isOpen={editModalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
        itemId={editingItemId}
        data={assetLiabilityData}
        onSave={handleSaveData}
      />

      {/* 保存成功确认弹窗 */}
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent className="w-[90vw] max-w-sm mx-auto rounded-2xl">
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-lg font-semibold text-gray-900">
              资产负债更新成功！
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-600 mt-2 leading-relaxed">
              您的资产负债已更新，这可能会影响您的财富分型和风险评估结果。建议查看最新的财富分型，了解调整后的财务状况变化。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col gap-2 w-full">
            <AlertDialogAction
              onClick={handleViewWealthTyping}
              className="w-full bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] text-gray-900 hover:from-[#A5E0E4] hover:to-[#7DD3D7] font-medium"
            >
              查看最新财富分型
            </AlertDialogAction>
            <AlertDialogCancel
              onClick={handleContinueAdjusting}
              className="w-full mt-0"
            >
              暂不查看，继续调整
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// 编辑弹窗组件
interface AssetLiabilityEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category: string | null;
  itemId: string | null;
  data: AssetLiabilityData;
  onSave: (data: Partial<AssetLiabilityData>) => void;
}

const AssetLiabilityEditDialog: React.FC<AssetLiabilityEditDialogProps> = ({
  isOpen,
  onClose,
  category,
  itemId,
  data,
  onSave
}) => {
  const [localData, setLocalData] = useState<AssetLiabilityData>(data);

  useEffect(() => {
    setLocalData(data);
  }, [data, isOpen]);

  const handleSave = () => {
    onSave(localData);
  };

  const addProperty = () => {
    const newProperty: AssetItem = {
      id: Date.now().toString(),
      name: `房产${localData.properties.length + 1}`,
      amount: 0
    };
    setLocalData(prev => ({
      ...prev,
      properties: [...prev.properties, newProperty]
    }));
  };

  const addVehicle = () => {
    const newVehicle: AssetItem = {
      id: Date.now().toString(),
      name: `车辆${localData.vehicles.length + 1}`,
      amount: 0
    };
    setLocalData(prev => ({
      ...prev,
      vehicles: [...prev.vehicles, newVehicle]
    }));
  };

  const addMortgage = () => {
    const newMortgage: LoanItem = {
      id: Date.now().toString(),
      name: `房贷${localData.mortgages.length + 1}`,
      monthlyPayment: 0,
      remainingMonths: 0
    };
    setLocalData(prev => ({
      ...prev,
      mortgages: [...prev.mortgages, newMortgage]
    }));
  };

  const addCarLoan = () => {
    const newCarLoan: LoanItem = {
      id: Date.now().toString(),
      name: `车贷${localData.carLoans.length + 1}`,
      monthlyPayment: 0,
      remainingMonths: 0
    };
    setLocalData(prev => ({
      ...prev,
      carLoans: [...prev.carLoans, newCarLoan]
    }));
  };

  const addConsumerLoan = () => {
    const newConsumerLoan: LoanItem = {
      id: Date.now().toString(),
      name: `消费贷${localData.consumerLoans.length + 1}`,
      monthlyPayment: 0,
      remainingMonths: 0
    };
    setLocalData(prev => ({
      ...prev,
      consumerLoans: [...prev.consumerLoans, newConsumerLoan]
    }));
  };

  const removeProperty = (id: string) => {
    setLocalData(prev => ({
      ...prev,
      properties: prev.properties.filter(item => item.id !== id)
    }));
  };

  const removeVehicle = (id: string) => {
    setLocalData(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter(item => item.id !== id)
    }));
  };

  const removeMortgage = (id: string) => {
    setLocalData(prev => ({
      ...prev,
      mortgages: prev.mortgages.filter(item => item.id !== id)
    }));
  };

  const removeCarLoan = (id: string) => {
    setLocalData(prev => ({
      ...prev,
      carLoans: prev.carLoans.filter(item => item.id !== id)
    }));
  };

  const removeConsumerLoan = (id: string) => {
    setLocalData(prev => ({
      ...prev,
      consumerLoans: prev.consumerLoans.filter(item => item.id !== id)
    }));
  };

  const renderEditContent = () => {
    switch (category) {
      case 'financial-assets':
        return (
          <div>
            <Label className="text-sm font-medium">金融资产（万元）</Label>
            <p className="text-xs text-gray-500 mb-2">银行存款、理财产品、股票、基金等</p>
            <Input
              type="number"
              value={localData.financialAssets || ''}
              onChange={(e) => setLocalData(prev => ({
                ...prev,
                financialAssets: Number(e.target.value) || 0
              }))}
              placeholder="请输入金融资产总额"
            />
          </div>
        );

      case 'properties':
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">房产</Label>
              <Button onClick={addProperty} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                添加房产
              </Button>
            </div>
            {localData.properties.map((property, index) => (
              <div key={property.id} className="flex items-center gap-2 mb-2">
                <Input
                  placeholder="房产名称"
                  value={property.name}
                  onChange={(e) => {
                    const newProperties = [...localData.properties];
                    newProperties[index].name = e.target.value;
                    setLocalData(prev => ({ ...prev, properties: newProperties }));
                  }}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="价值（万元）"
                  value={property.amount || ''}
                  onChange={(e) => {
                    const newProperties = [...localData.properties];
                    newProperties[index].amount = Number(e.target.value) || 0;
                    setLocalData(prev => ({ ...prev, properties: newProperties }));
                  }}
                  className="w-32"
                />
                <Button
                  onClick={() => removeProperty(property.id)}
                  size="sm"
                  variant="ghost"
                  className="p-1 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        );

      case 'vehicles':
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">车辆</Label>
              <Button onClick={addVehicle} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                添加车辆
              </Button>
            </div>
            {localData.vehicles.map((vehicle, index) => (
              <div key={vehicle.id} className="flex items-center gap-2 mb-2">
                <Input
                  placeholder="车辆名称"
                  value={vehicle.name}
                  onChange={(e) => {
                    const newVehicles = [...localData.vehicles];
                    newVehicles[index].name = e.target.value;
                    setLocalData(prev => ({ ...prev, vehicles: newVehicles }));
                  }}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="价值（万元）"
                  value={vehicle.amount || ''}
                  onChange={(e) => {
                    const newVehicles = [...localData.vehicles];
                    newVehicles[index].amount = Number(e.target.value) || 0;
                    setLocalData(prev => ({ ...prev, vehicles: newVehicles }));
                  }}
                  className="w-32"
                />
                <Button
                  onClick={() => removeVehicle(vehicle.id)}
                  size="sm"
                  variant="ghost"
                  className="p-1 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        );

      case 'other-assets':
        return (
          <div>
            <Label className="text-sm font-medium">其他实物资产（万元）</Label>
            <p className="text-xs text-gray-500 mb-2">收藏品、艺术品、珠宝等</p>
            <Input
              type="number"
              value={localData.otherAssets || ''}
              onChange={(e) => setLocalData(prev => ({
                ...prev,
                otherAssets: Number(e.target.value) || 0
              }))}
              placeholder="请输入其他资产总额"
            />
          </div>
        );

      case 'mortgages':
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">房贷</Label>
              <Button onClick={addMortgage} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                添加房贷
              </Button>
            </div>
            {localData.mortgages.map((mortgage, index) => {
              const associatedProperty = localData.properties.find(p => p.id === mortgage.propertyId);
              return (
                <div key={mortgage.id} className="p-3 bg-red-50 rounded-lg mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-700 flex-1">{mortgage.name}</div>
                    <Button
                      onClick={() => removeMortgage(mortgage.id)}
                      size="sm"
                      variant="ghost"
                      className="p-1 h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* 房产关联选择 */}
                  <div className="mb-3">
                    <Label className="text-xs mb-1 block">挂接房产</Label>
                    <Select
                      value={mortgage.propertyId || ''}
                      onValueChange={(value) => {
                        const newMortgages = [...localData.mortgages];
                        newMortgages[index].propertyId = value;
                        setLocalData(prev => ({ ...prev, mortgages: newMortgages }));
                      }}
                    >
                      <SelectTrigger className="w-full text-xs bg-white">
                        <SelectValue placeholder="选择房产" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                        {localData.properties.length === 0 ? (
                          <SelectItem value="" disabled>暂无房产，请先添加房产</SelectItem>
                        ) : (
                          localData.properties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              {property.name} ({property.amount}万)
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">月供金额（元）</Label>
                      <Input
                        type="number"
                        value={mortgage.monthlyPayment || ''}
                        onChange={(e) => {
                          const newMortgages = [...localData.mortgages];
                          newMortgages[index].monthlyPayment = Number(e.target.value) || 0;
                          setLocalData(prev => ({ ...prev, mortgages: newMortgages }));
                        }}
                        placeholder="月供"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">剩余还款月数</Label>
                      <Input
                        type="number"
                        value={mortgage.remainingMonths || ''}
                        onChange={(e) => {
                          const newMortgages = [...localData.mortgages];
                          newMortgages[index].remainingMonths = Number(e.target.value) || 0;
                          setLocalData(prev => ({ ...prev, mortgages: newMortgages }));
                        }}
                        placeholder="月数"
                      />
                    </div>
                  </div>
                  
                  {/* 系统提示信息 - 只在非新增贷款时显示 */}
                  {mortgage.remainingMonths > 0 && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                      💡 系统提示：该笔贷款如正常还款，剩余还款月数应为{mortgage.remainingMonths - 1}月。如您已按时还款，请及时更新剩余还款月数以确保数据准确性。
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );

      case 'car-loans':
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">车贷</Label>
              <Button onClick={addCarLoan} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                添加车贷
              </Button>
            </div>
            {localData.carLoans.map((carLoan, index) => (
              <div key={carLoan.id} className="p-3 bg-red-50 rounded-lg mb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-700 flex-1">{carLoan.name}</div>
                  <Button
                    onClick={() => removeCarLoan(carLoan.id)}
                    size="sm"
                    variant="ghost"
                    className="p-1 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* 车辆关联选择 */}
                <div className="mb-3">
                  <Label className="text-xs mb-1 block">挂接车辆</Label>
                  <Select
                    value={carLoan.vehicleId || ''}
                    onValueChange={(value) => {
                      const newCarLoans = [...localData.carLoans];
                      newCarLoans[index].vehicleId = value;
                      setLocalData(prev => ({ ...prev, carLoans: newCarLoans }));
                    }}
                  >
                    <SelectTrigger className="w-full text-xs bg-white">
                      <SelectValue placeholder="选择车辆" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      {localData.vehicles.length === 0 ? (
                        <SelectItem value="" disabled>暂无车辆，请先添加车辆</SelectItem>
                      ) : (
                        localData.vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.name} ({vehicle.amount}万)
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">月供金额（元）</Label>
                    <Input
                      type="number"
                      value={carLoan.monthlyPayment || ''}
                      onChange={(e) => {
                        const newCarLoans = [...localData.carLoans];
                        newCarLoans[index].monthlyPayment = Number(e.target.value) || 0;
                        setLocalData(prev => ({ ...prev, carLoans: newCarLoans }));
                      }}
                      placeholder="月供"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">剩余还款月数</Label>
                    <Input
                      type="number"
                      value={carLoan.remainingMonths || ''}
                      onChange={(e) => {
                        const newCarLoans = [...localData.carLoans];
                        newCarLoans[index].remainingMonths = Number(e.target.value) || 0;
                        setLocalData(prev => ({ ...prev, carLoans: newCarLoans }));
                      }}
                      placeholder="月数"
                    />
                  </div>
                </div>
                
                {/* 系统提示信息 - 只在非新增贷款时显示 */}
                {carLoan.remainingMonths > 0 && (
                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                    💡 系统提示：该笔贷款如正常还款，剩余还款月数应为{carLoan.remainingMonths - 1}月。如您已按时还款，请及时更新剩余还款月数以确保数据准确性。
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'consumer-loans':
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium">消费贷</Label>
              <Button onClick={addConsumerLoan} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-1" />
                添加消费贷
              </Button>
            </div>
            {localData.consumerLoans.map((consumerLoan, index) => (
              <div key={consumerLoan.id} className="p-3 bg-red-50 rounded-lg mb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-700 flex-1">{consumerLoan.name}</div>
                  <Button
                    onClick={() => removeConsumerLoan(consumerLoan.id)}
                    size="sm"
                    variant="ghost"
                    className="p-1 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">贷款金额（元）</Label>
                    <Input
                      type="number"
                      value={consumerLoan.monthlyPayment || ''}
                      onChange={(e) => {
                        const newConsumerLoans = [...localData.consumerLoans];
                        newConsumerLoans[index].monthlyPayment = Number(e.target.value) || 0;
                        setLocalData(prev => ({ ...prev, consumerLoans: newConsumerLoans }));
                      }}
                      placeholder="金额"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">剩余还款月数</Label>
                    <Input
                      type="number"
                      value={consumerLoan.remainingMonths || ''}
                      onChange={(e) => {
                        const newConsumerLoans = [...localData.consumerLoans];
                        newConsumerLoans[index].remainingMonths = Number(e.target.value) || 0;
                        setLocalData(prev => ({ ...prev, consumerLoans: newConsumerLoans }));
                      }}
                      placeholder="月数"
                    />
                    </div>
                  </div>
                  
                  {/* 系统提示信息 - 只在非新增贷款时显示 */}
                  {consumerLoan.remainingMonths > 0 && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                      💡 系统提示：该笔贷款如正常还款，剩余还款月数应为{consumerLoan.remainingMonths - 1}月。如您已按时还款，请及时更新剩余还款月数以确保数据准确性。
                    </div>
                  )}
                </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="p-4 text-center text-gray-500">
            暂不支持此类科目的编辑
          </div>
        );
    }
  };

  const getDialogTitle = () => {
    switch (category) {
      case 'financial-assets':
        return '编辑金融资产';
      case 'properties':
        return '编辑房产';
      case 'vehicles':
        return '编辑车辆';
      case 'other-assets':
        return '编辑其他资产';
      case 'mortgages':
        return '编辑房贷';
      case 'car-loans':
        return '编辑车贷';
      case 'consumer-loans':
        return '编辑消费贷';
      default:
        return '编辑资产负债';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {category?.includes('assets') || category?.includes('properties') || category?.includes('vehicles') ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderEditContent()}
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            取消
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] text-gray-900 hover:from-[#A5E0E4] hover:to-[#7DD3D7]">
            确认保存
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetLiabilitySummary;
