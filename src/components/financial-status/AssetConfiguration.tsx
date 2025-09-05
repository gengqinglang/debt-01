import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Banknote, TrendingUp, PieChart, Shield, Check } from 'lucide-react';

interface AssetConfigurationProps {
  category: any;
  onConfirm: (categoryId: string, data: any) => void;
  isConfirmed: boolean;
  existingData?: any;
}

const AssetConfiguration: React.FC<AssetConfigurationProps> = ({
  category,
  onConfirm,
  isConfirmed,
  existingData
}) => {
  const [formData, setFormData] = useState({
    name: category.name,
    amount: 0
  });

  // 从现有数据初始化表单
  useEffect(() => {
    if (existingData) {
      setFormData({ ...formData, ...existingData });
    }
  }, [existingData]);

  const getIcon = () => {
    switch (category.type) {
      case 'deposit':
        return <Banknote className="w-5 h-5" />;
      case 'wealth':
        return <TrendingUp className="w-5 h-5" />;
      case 'fund':
        return <PieChart className="w-5 h-5" />;
      case 'insurance':
        return <Shield className="w-5 h-5" />;
      default:
        return <Banknote className="w-5 h-5" />;
    }
  };

  const getDescription = () => {
    switch (category.type) {
      case 'deposit':
        return '包括活期存款、定期存款、货币基金等';
      case 'wealth':
        return '包括银行理财、信托产品、券商理财等';
      case 'fund':
        return '包括股票基金、债券基金、混合基金等';
      case 'insurance':
        return '包括年金险、终身寿险等储蓄型保险';
      default:
        return '请填写您的资产金额';
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleConfirm = () => {
    onConfirm(category.id, formData);
  };

  const canConfirm = () => {
    return formData.amount >= 0; // 允许0值，表示该类资产为空
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#B3EBEF]/20 flex items-center justify-center">
            {getIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-600">{getDescription()}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="asset-amount" className="text-sm text-gray-600">资产金额（万元）</Label>
            <Input
              id="asset-amount"
              type="number"
              placeholder="请输入金额，没有可填0"
              value={formData.amount || ''}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              className="mt-1 text-lg"
              disabled={isConfirmed}
            />
          </div>

          {/* 资产说明 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">资产说明</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {category.type === 'deposit' && (
                <>
                  <li>• 活期存款：银行卡余额、支付宝余额等</li>
                  <li>• 定期存款：银行定期存款、大额存单等</li>
                  <li>• 货币基金：余额宝、零钱通等</li>
                </>
              )}
              {category.type === 'wealth' && (
                <>
                  <li>• 银行理财：各银行发售的理财产品</li>
                  <li>• 信托产品：信托公司发行的集合资金信托</li>
                  <li>• 券商理财：证券公司资管产品</li>
                </>
              )}
              {category.type === 'fund' && (
                <>
                  <li>• 股票基金：主要投资股票市场的基金</li>
                  <li>• 债券基金：主要投资债券市场的基金</li>
                  <li>• 混合基金：同时投资股票和债券的基金</li>
                </>
              )}
              {category.type === 'insurance' && (
                <>
                  <li>• 年金险：按期返还的保险产品</li>
                  <li>• 终身寿险：具有储蓄功能的寿险</li>
                  <li>• 万能险：投资收益可变的保险产品</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* 确认按钮 */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <Button 
            onClick={handleConfirm}
            className="w-full py-3 bg-[#B3EBEF] hover:bg-[#8FD8DC] text-gray-900 font-semibold rounded-lg"
            disabled={!canConfirm()}
          >
            <Check className="w-4 h-4 mr-2" />
            确认{category.name}信息
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetConfiguration;