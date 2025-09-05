
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, CreditCard, Home, Car, Package, Plus } from 'lucide-react';

interface FinancialStatusContentProps {
  showHeader?: boolean;
  showSummary?: boolean;
  showNextButton?: boolean;
  onNext?: () => void;
}

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
}

const FinancialStatusContent: React.FC<FinancialStatusContentProps> = ({
  showHeader = true,
  showSummary = true,
  showNextButton = true,
  onNext
}) => {
  const [activeCategory, setActiveCategory] = useState('financial');
  
  // 资产数据
  const [financialAssets, setFinancialAssets] = useState(0);
  const [properties, setProperties] = useState<AssetItem[]>([]);
  const [vehicles, setVehicles] = useState<AssetItem[]>([]);
  const [otherAssets, setOtherAssets] = useState(0);
  
  // 负债数据
  const [mortgages, setMortgages] = useState<LoanItem[]>([]);
  const [carLoans, setCarLoans] = useState<LoanItem[]>([]);
  const [consumerLoans, setConsumerLoans] = useState<LoanItem[]>([]);

  // 分类配置
  const categories = [
    { id: 'financial', name: '金融资产', icon: '💳', type: 'asset' },
    { id: 'property', name: '房产', icon: '🏠', type: 'asset' },
    { id: 'vehicle', name: '车辆', icon: '🚗', type: 'asset' },
    { id: 'other', name: '其他实物资产', icon: '📦', type: 'asset' },
    { id: 'mortgage', name: '房贷', icon: '🏠', type: 'liability' },
    { id: 'carloan', name: '车贷', icon: '🚗', type: 'liability' },
    { id: 'consumer', name: '消费贷', icon: '🛒', type: 'liability' }
  ];

  // 计算汇总数据
  const totalAssets = financialAssets + 
    properties.reduce((sum, item) => sum + item.amount, 0) +
    vehicles.reduce((sum, item) => sum + item.amount, 0) +
    otherAssets;

  const totalLiabilities = 
    mortgages.reduce((sum, item) => sum + (item.monthlyPayment * item.remainingMonths), 0) +
    carLoans.reduce((sum, item) => sum + (item.monthlyPayment * item.remainingMonths), 0) +
    consumerLoans.reduce((sum, item) => sum + (item.monthlyPayment * item.remainingMonths), 0);

  const netWorth = totalAssets - totalLiabilities;

  // 添加房产
  const addProperty = () => {
    const newProperty: AssetItem = {
      id: Date.now().toString(),
      name: `房产${properties.length + 1}`,
      amount: 0
    };
    setProperties([...properties, newProperty]);
  };

  // 添加车辆
  const addVehicle = () => {
    const newVehicle: AssetItem = {
      id: Date.now().toString(),
      name: `车辆${vehicles.length + 1}`,
      amount: 0
    };
    setVehicles([...vehicles, newVehicle]);
  };

  // 获取房产信息
  const getPropertyInfo = (propertyId?: string) => {
    if (!propertyId) return null;
    return properties.find(p => p.id === propertyId);
  };

  // 添加房贷
  const addMortgage = () => {
    const newMortgage: LoanItem = {
      id: Date.now().toString(),
      name: `房贷${mortgages.length + 1}`,
      monthlyPayment: 0,
      remainingMonths: 0
    };
    setMortgages([...mortgages, newMortgage]);
  };

  // 添加车贷
  const addCarLoan = () => {
    const newCarLoan: LoanItem = {
      id: Date.now().toString(),
      name: `车贷${carLoans.length + 1}`,
      monthlyPayment: 0,
      remainingMonths: 0
    };
    setCarLoans([...carLoans, newCarLoan]);
  };

  // 添加消费贷
  const addConsumerLoan = () => {
    const newConsumerLoan: LoanItem = {
      id: Date.now().toString(),
      name: `消费贷${consumerLoans.length + 1}`,
      monthlyPayment: 0,
      remainingMonths: 0
    };
    setConsumerLoans([...consumerLoans, newConsumerLoan]);
  };

  // 渲染右侧内容
  const renderRightContent = () => {
    switch (activeCategory) {
      case 'financial':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              银行存款、理财产品、股票、基金等金融资产总值
            </div>
            <div className="space-y-3">
              <Input
                type="number"
                placeholder="请输入金融资产总额"
                value={financialAssets || ''}
                onChange={(e) => setFinancialAssets(Number(e.target.value) || 0)}
                className="text-lg py-3"
              />
              <Button 
                className="w-full bg-[#4A90A4] hover:bg-[#3A7A8A] text-white"
                onClick={() => {}}
              >
                确认
              </Button>
            </div>
          </div>
        );

      case 'property':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              房产、商铺等不动产价值
            </div>
            <Button 
              onClick={addProperty}
              className="w-full bg-[#B3EBEF] hover:bg-[#9FE6EB] text-gray-800 border border-gray-300"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加房产
            </Button>
            {properties.map((property, index) => (
              <div key={property.id} className="space-y-2">
                <div className="text-sm font-medium text-gray-700">{property.name}</div>
                <Input
                  type="number"
                  placeholder="请输入房产价值"
                  value={property.amount || ''}
                  onChange={(e) => {
                    const newProperties = [...properties];
                    newProperties[index].amount = Number(e.target.value) || 0;
                    setProperties(newProperties);
                  }}
                  className="text-lg py-3"
                />
              </div>
            ))}
          </div>
        );

      case 'vehicle':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              汽车、摩托车等交通工具价值
            </div>
            <Button 
              onClick={addVehicle}
              className="w-full bg-[#B3EBEF] hover:bg-[#9FE6EB] text-gray-800 border border-gray-300"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加车辆
            </Button>
            {vehicles.map((vehicle, index) => (
              <div key={vehicle.id} className="space-y-2">
                <div className="text-sm font-medium text-gray-700">{vehicle.name}</div>
                <Input
                  type="number"
                  placeholder="请输入车辆价值"
                  value={vehicle.amount || ''}
                  onChange={(e) => {
                    const newVehicles = [...vehicles];
                    newVehicles[index].amount = Number(e.target.value) || 0;
                    setVehicles(newVehicles);
                  }}
                  className="text-lg py-3"
                />
              </div>
            ))}
          </div>
        );

      case 'other':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              收藏品、艺术品、珠宝等其他实物资产价值
            </div>
            <div className="space-y-3">
              <Input
                type="number"
                placeholder="请输入其他资产总额"
                value={otherAssets || ''}
                onChange={(e) => setOtherAssets(Number(e.target.value) || 0)}
                className="text-lg py-3"
              />
              <Button 
                className="w-full bg-[#4A90A4] hover:bg-[#3A7A8A] text-white"
                onClick={() => {}}
              >
                确认
              </Button>
            </div>
          </div>
        );

      case 'mortgage':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              房贷详情
            </div>
            <Button 
              onClick={addMortgage}
              className="w-full bg-[#B3EBEF] hover:bg-[#9FE6EB] text-gray-800 border border-gray-300"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加房贷
            </Button>
            {mortgages.map((mortgage, index) => {
              const associatedProperty = getPropertyInfo(mortgage.propertyId);
              return (
                <div key={mortgage.id} className="space-y-3 p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-700">{mortgage.name}</div>
                    {associatedProperty && (
                      <div className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                        {associatedProperty.name}: {associatedProperty.amount}万
                      </div>
                    )}
                  </div>
                  
                  {/* 房产选择下拉框 */}
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">挂接房产</label>
                    <Select
                      value={mortgage.propertyId || ''}
                      onValueChange={(value) => {
                        const newMortgages = [...mortgages];
                        newMortgages[index].propertyId = value;
                        setMortgages(newMortgages);
                      }}
                    >
                      <SelectTrigger className="w-full text-sm bg-white">
                        <SelectValue placeholder="选择房产" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                        {properties.length === 0 ? (
                          <SelectItem value="" disabled>暂无房产，请先添加房产</SelectItem>
                        ) : (
                          properties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              {property.name} ({property.amount}万)
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600">月供金额</label>
                      <Input
                        type="number"
                        placeholder="月供"
                        value={mortgage.monthlyPayment || ''}
                        onChange={(e) => {
                          const newMortgages = [...mortgages];
                          newMortgages[index].monthlyPayment = Number(e.target.value) || 0;
                          setMortgages(newMortgages);
                        }}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">剩余还款月数</label>
                      <Input
                        type="number"
                        placeholder="月数"
                        value={mortgage.remainingMonths || ''}
                        onChange={(e) => {
                          const newMortgages = [...mortgages];
                          newMortgages[index].remainingMonths = Number(e.target.value) || 0;
                          setMortgages(newMortgages);
                        }}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'carloan':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              车贷详情
            </div>
            <Button 
              onClick={addCarLoan}
              className="w-full bg-[#B3EBEF] hover:bg-[#9FE6EB] text-gray-800 border border-gray-300"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加车贷
            </Button>
            {carLoans.map((carLoan, index) => (
              <div key={carLoan.id} className="space-y-3 p-3 bg-red-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700">{carLoan.name}</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600">月供金额</label>
                    <Input
                      type="number"
                      placeholder="月供"
                      value={carLoan.monthlyPayment || ''}
                      onChange={(e) => {
                        const newCarLoans = [...carLoans];
                        newCarLoans[index].monthlyPayment = Number(e.target.value) || 0;
                        setCarLoans(newCarLoans);
                      }}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">剩余还款月数</label>
                    <Input
                      type="number"
                      placeholder="月数"
                      value={carLoan.remainingMonths || ''}
                      onChange={(e) => {
                        const newCarLoans = [...carLoans];
                        newCarLoans[index].remainingMonths = Number(e.target.value) || 0;
                        setCarLoans(newCarLoans);
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'consumer':
        return (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              消费贷详情
            </div>
            <Button 
              onClick={addConsumerLoan}
              className="w-full bg-[#B3EBEF] hover:bg-[#9FE6EB] text-gray-800 border border-gray-300"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加消费贷
            </Button>
            {consumerLoans.map((consumerLoan, index) => (
              <div key={consumerLoan.id} className="space-y-3 p-3 bg-red-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700">{consumerLoan.name}</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600">贷款金额</label>
                    <Input
                      type="number"
                      placeholder="金额"
                      value={consumerLoan.monthlyPayment || ''}
                      onChange={(e) => {
                        const newConsumerLoans = [...consumerLoans];
                        newConsumerLoans[index].monthlyPayment = Number(e.target.value) || 0;
                        setConsumerLoans(newConsumerLoans);
                      }}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">剩余还款月数</label>
                    <Input
                      type="number"
                      placeholder="月数"
                      value={consumerLoan.remainingMonths || ''}
                      onChange={(e) => {
                        const newConsumerLoans = [...consumerLoans];
                        newConsumerLoans[index].remainingMonths = Number(e.target.value) || 0;
                        setConsumerLoans(newConsumerLoans);
                      }}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-gradient-to-b from-[#B3EBEF] to-[#87CEEB] relative">
      <div className="relative min-h-screen flex flex-col">
        {/* 标题区域 */}
        {showHeader && (
          <div className="px-4 py-6 text-center">
            <h1 className="text-xl font-bold text-gray-800 mb-2">财务状况</h1>
            <p className="text-sm text-gray-700">了解您的资产负债情况，制定合理的财务规划</p>
          </div>
        )}

        {/* 顶部汇总卡片 */}
        {showSummary && (
          <div className="px-4 mb-6">
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardContent className="p-3 text-center">
                  <div className="text-xs text-gray-600 mb-1">净资产</div>
                  <div className={`text-sm font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {netWorth.toFixed(0)}万
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardContent className="p-3 text-center">
                  <div className="text-xs text-gray-600 mb-1">总资产</div>
                  <div className="text-sm font-bold text-green-600">
                    {totalAssets.toFixed(0)}万
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg">
                <CardContent className="p-3 text-center">
                  <div className="text-xs text-gray-600 mb-1">总负债</div>
                  <div className="text-sm font-bold text-red-600">
                    {totalLiabilities.toFixed(0)}万
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* 主要内容区域 */}
        <div className="flex-1 px-4 pb-20">
          <div className="flex gap-4 h-full">
            {/* 左侧分类导航 */}
            <div className="w-28">
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full p-3 rounded-lg text-center transition-all ${
                      activeCategory === category.id
                        ? 'bg-[#4A90A4] text-white shadow-lg'
                        : 'bg-white/80 text-gray-700 hover:bg-white/90'
                    }`}
                  >
                    <div className="text-lg mb-1">{category.icon}</div>
                    <div className="text-xs font-medium leading-tight">
                      {category.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 右侧内容区域 */}
            <div className="flex-1">
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg h-full">
                <CardContent className="p-4 h-full">
                  {renderRightContent()}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        {showNextButton && onNext && (
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 bg-gradient-to-t from-[#87CEEB] to-transparent">
            <Button 
              onClick={onNext}
              className="w-full py-3 bg-[#4A90A4] hover:bg-[#3A7A8A] text-white font-bold rounded-xl text-sm shadow-lg"
            >
              继续下一步
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialStatusContent;
