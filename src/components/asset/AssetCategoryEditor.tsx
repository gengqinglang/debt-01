import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Check, PiggyBank, TrendingUp, PieChart, Building, Home, Car, BarChart3 } from 'lucide-react';
import { AssetInfo } from '@/pages/AssetPage';

interface AssetCategoryEditorProps {
  category: any;
  onConfirm: (categoryId: string, assets: AssetInfo[]) => void;
  onDataChange: (categoryId: string, data: any) => void;
  isConfirmed: boolean;
  existingAssets?: AssetInfo[];
}

interface AssetEntry {
  id: string;
  amount: number;
  maturityMonth: string;
  // 房产特有字段
  propertyName?: string;
  marketValue?: number; // 市值（万元）
  maintenanceCost?: number; // 养房成本（元/年）
  // 车特有字段
  carName?: string;
  // marketValue 和 maintenanceCost 共用（车的市值和养车成本）
  // 理财/基金特有字段
  canRedeemAnytime?: string; // 是否可随时赎回：'yes' | 'no'
  // 存款特有字段
  depositType?: string; // 存款类型：'current' | 'term'
}

// 生成临时唯一ID
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const AssetCategoryEditor: React.FC<AssetCategoryEditorProps> = ({
  category,
  onConfirm,
  onDataChange,
  isConfirmed,
  existingAssets = []
}) => {
  const [assetEntries, setAssetEntries] = useState<AssetEntry[]>([
    { id: uid(), amount: 0, maturityMonth: '' }
  ]);
  
  // 状态管理：确认状态与数据变更检测
  const [lastConfirmedData, setLastConfirmedData] = useState<AssetEntry[]>([]);
  const [hasDataChanged, setHasDataChanged] = useState(false);

  // 从现有数据初始化表单（只在组件首次加载或类别切换时执行）
  useEffect(() => {
    if (existingAssets.length > 0) {
      setAssetEntries(existingAssets.map(asset => ({
        id: asset.id || uid(),
        amount: asset.amount,
        maturityMonth: asset.maturityMonth,
        // 房产特有字段
        ...(category.type === 'property' && {
          propertyName: asset.propertyName,
          marketValue: asset.marketValue,
          maintenanceCost: asset.maintenanceCost
        }),
        // 车特有字段
        ...(category.type === 'car' && {
          carName: asset.carName,
          marketValue: asset.marketValue,
          maintenanceCost: asset.maintenanceCost
        }),
        // 存款特有字段
        ...(category.type === 'deposit' && { 
          depositType: asset.depositType || 'current' 
        }),
        // 理财/基金特有字段
        ...(category.type === 'wealth' && {
          canRedeemAnytime: asset.canRedeemAnytime
        })
      })));
    } else {
      // 如果没有现有数据，重置为默认状态
      setAssetEntries([{ 
        id: uid(), 
        amount: 0, 
        maturityMonth: '',
        ...(category.type === 'deposit' && { depositType: 'current' })
      }]);
    }
  }, [category.id]); // 只在类别ID变化时重新初始化

  const getIcon = () => {
    switch (category.type) {
      case 'currentDeposit':
        return <PiggyBank className="w-5 h-5" />;
      case 'deposit':
        return <PiggyBank className="w-5 h-5" />;
      case 'wealth':
        return <TrendingUp className="w-5 h-5" />;
      case 'stock':
        return <BarChart3 className="w-5 h-5" />;
      case 'property':
        return <Home className="w-5 h-5" />;
      case 'car':
        return <Car className="w-5 h-5" />;
      case 'other':
        return <Building className="w-5 h-5" />;
      default:
        return <PiggyBank className="w-5 h-5" />;
    }
  };

  const getMaturityLabel = () => {
    switch (category.type) {
      case 'currentDeposit':
        return '资金状态';
      case 'deposit':
        return '到期时间';
      case 'wealth':
        return '到期时间';
      case 'property':
        return '持有状态';
      case 'car':
        return '购买时间';
      case 'other':
        return '预期持有';
      default:
        return '期限';
    }
  };

  const getMaturityOptions = () => {
    switch (category.type) {
      case 'currentDeposit':
        return [
          { value: 'available', label: '随时可用' },
          { value: 'notice_3_days', label: '3天通知' },
          { value: 'notice_7_days', label: '7天通知' }
        ];
      case 'deposit':
      case 'wealth':
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); // 0-based month
        const options = [];
        
        // 生成从当前月份开始的未来60个月的选项
        for (let i = 0; i < 60; i++) {
          const futureDate = new Date(currentYear, currentMonth + i, 1);
          const year = futureDate.getFullYear();
          const month = futureDate.getMonth() + 1; // Convert to 1-based month
          const value = `${year}-${month.toString().padStart(2, '0')}`;
          const label = `${year}年${month}月`;
          options.push({ value, label });
        }
        
        return options;
      case 'property':
        return [
          { value: 'self_occupied', label: '自住' },
          { value: 'investment', label: '投资' },
          { value: 'rental', label: '出租中' },
          { value: 'vacant', label: '空置' }
        ];
      case 'car':
        return [
          { value: '2024', label: '2024年' },
          { value: '2023', label: '2023年' },
          { value: '2022', label: '2022年' },
          { value: '2021', label: '2021年' },
          { value: '2020', label: '2020年' },
          { value: '2019', label: '2019年' },
          { value: 'before_2019', label: '2019年前' }
        ];
      case 'other':
        return [
          { value: 'flexible', label: '灵活调整' },
          { value: 'medium_term', label: '中期投资' },
          { value: 'long_term', label: '长期投资' }
        ];
      default:
        return [];
    }
  };

  const getExamples = () => {
    switch (category.type) {
      case 'deposit':
        return [
          '• 活期存款：银行卡余额、支付宝余额、微信余额',
          '• 定期存款：银行定期存款产品',
          '• 大额存单：银行大额存单产品',
          '• 国债：购买的国债产品'
        ];
      case 'wealth':
        return [
          '• 银行理财：银行发售的固定期限理财产品',
          '• 股票型基金：主要投资股票市场的基金',
          '• 债券型基金：主要投资债券市场的基金',
          '• 混合型基金：同时投资股票和债券的基金',
          '• 信托产品：信托公司发行的集合信托计划',
          '• 券商理财：证券公司发行的资管产品'
        ];
      case 'stock':
        return [
          '• A股股票：在沪深交易所上市的公司股票',
          '• 港股：在香港交易所上市的公司股票',
          '• 美股：在美国交易所上市的公司股票',
          '• 科创板股票：在科创板上市的公司股票'
        ];
      case 'property':
        return [
          '• 住宅房产：自住或投资的住宅物业',
          '• 商业地产：商铺、写字楼等商业物业',
          '• 土地使用权：拥有的土地使用权价值'
        ];
      case 'car':
        return [
          '• 私家车：个人名下的小轿车、SUV等',
          '• 商用车：货车、客车等商业用途车辆',
          '• 新能源车：电动车、混合动力车等'
        ];
      case 'other':
        return [
          '• 个股投资：直接持有的上市公司股票',
          '• 债券投资：企业债、可转债等债券产品',
          '• 贵金属：黄金、白银等实物或ETF投资',
          '• 个人借款：借给他人的资金'
        ];
      default:
        return [];
    }
  };

  const addAssetEntry = () => {
    const newEntry = { 
      id: uid(), 
      amount: 0, 
      maturityMonth: '',
      ...(category.type === 'deposit' && { depositType: 'current' })
    };
    const updated = [...assetEntries, newEntry];
    setAssetEntries(updated);
    
    // 标记数据已变更
    setHasDataChanged(true);
    
    // 实时更新数据到父组件
    onDataChange(category.id, updated);
  };

  const removeAssetEntry = (index: number) => {
    if (assetEntries.length > 1) {
      const updated = assetEntries.filter((_, i) => i !== index);
      setAssetEntries(updated);
      
      // 标记数据已变更
      setHasDataChanged(true);
      
      // 实时更新数据到父组件
      onDataChange(category.id, updated);
    }
  };

  const handleEntryChange = (index: number, field: keyof AssetEntry, value: any) => {
    const updated = [...assetEntries];
    updated[index] = { ...updated[index], [field]: value };
    
    // 如果是房产类型且修改了市值，自动计算养房成本
    if (category.type === 'property' && field === 'marketValue' && value) {
      const marketValue = parseFloat(value);
      if (!isNaN(marketValue) && marketValue > 0) {
        // 养房成本 = 市值(万元) * 0.15% * 10000(转换为元)
        const maintenanceCost = Math.round(marketValue * 0.0015 * 10000);
        updated[index] = { ...updated[index], maintenanceCost };
      }
    }
    
    // 如果是车类型且修改了市值，自动计算养车成本
    if (category.type === 'car' && field === 'marketValue' && value) {
      const marketValue = parseFloat(value);
      if (!isNaN(marketValue) && marketValue > 0) {
        // 养车成本 = 市值(万元) * 2% * 10000(转换为元)
        const maintenanceCost = Math.round(marketValue * 0.02 * 10000);
        updated[index] = { ...updated[index], maintenanceCost };
      }
    }
    
    setAssetEntries(updated);
    
    // 标记数据已变更
    setHasDataChanged(true);
    
    // 实时更新数据到父组件
    onDataChange(category.id, updated);
  };

  const handleConfirm = () => {
    const validAssets = assetEntries
      .filter(entry => {
        if (category.type === 'property') {
          return entry.propertyName && entry.marketValue && entry.marketValue > 0;
        }
        if (category.type === 'car') {
          return entry.carName && entry.marketValue && entry.marketValue > 0;
        }
        if (category.type === 'wealth') {
          return entry.amount > 0 && entry.canRedeemAnytime && 
            (entry.canRedeemAnytime === 'yes' || entry.maturityMonth);
        }
        if (category.type === 'deposit') {
          return entry.amount > 0 && entry.depositType && 
            (entry.depositType === 'current' || entry.maturityMonth);
        }
        return entry.amount > 0;
      })
      .map(entry => ({
        id: Date.now().toString() + Math.random(),
        categoryId: category.id,
        amount: (category.type === 'property' || category.type === 'car') ? (entry.marketValue || 0) : entry.amount,
        maturityMonth: entry.maturityMonth,
        // 房产特有字段
        ...(category.type === 'property' && {
          propertyName: entry.propertyName,
          marketValue: entry.marketValue,
          maintenanceCost: entry.maintenanceCost
        }),
        // 车特有字段
        ...(category.type === 'car' && {
          carName: entry.carName,
          marketValue: entry.marketValue,
          maintenanceCost: entry.maintenanceCost
        }),
        // 理财/基金特有字段
        ...(category.type === 'wealth' && {
          canRedeemAnytime: entry.canRedeemAnytime
        }),
        // 存款特有字段
        ...(category.type === 'deposit' && {
          depositType: entry.depositType
        })
      }));
    
    // 保存确认时的数据快照
    setLastConfirmedData([...assetEntries]);
    setHasDataChanged(false);
    
    onConfirm(category.id, validAssets);
  };

  const getTotalAmount = () => {
    return assetEntries.reduce((sum, entry) => {
      if (category.type === 'property' || category.type === 'car') {
        return sum + (entry.marketValue || 0);
      }
      return sum + (entry.amount || 0);
    }, 0);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
      </div>


      {/* 资产录入 */}
      <div className="space-y-4">
        {assetEntries.map((entry, index) => (
          <div key={entry.id}>
            <div className="rounded-lg py-6 px-3 bg-white relative" style={{ border: '2px solid #CAF4F7' }}>
              {/* 删除按钮 - 移到右上角 */}
              {assetEntries.length > 1 && (
                <Button 
                  onClick={() => removeAssetEntry(index)}
                  variant="ghost" 
                  size="sm"
                  className="absolute top-2 right-2 text-red-600 hover:text-red-700 hover:bg-red-50 p-1.5 h-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              {category.type === 'deposit' ? (
                // 存款显示专用字段
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-700">
                      存款类别 <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-1 flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEntryChange(index, 'depositType', 'current')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          entry.depositType === 'current'
                            ? 'bg-[#B3EBEF]/30 border-[#8FD8DC] text-gray-900'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        活期存款
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEntryChange(index, 'depositType', 'term')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          entry.depositType === 'term'
                            ? 'bg-[#B3EBEF]/30 border-[#8FD8DC] text-gray-900'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        定期存款
                      </button>
                    </div>
                  </div>
                  {entry.depositType && (
                    <>
                      {entry.depositType === 'current' ? (
                        <div>
                          <Label htmlFor={`amount-${index}`} className="text-xs font-medium text-gray-700">
                            金额(元) <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`amount-${index}`}
                            type="number"
                            placeholder="输入金额"
                            value={entry.amount === 0 ? '' : entry.amount}
                            onChange={(e) => handleEntryChange(index, 'amount', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                            className="mt-1 h-9 text-sm"
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`amount-${index}`} className="text-xs font-medium text-gray-700">
                              金额(元) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id={`amount-${index}`}
                              type="number"
                              placeholder="输入金额"
                              value={entry.amount === 0 ? '' : entry.amount}
                              onChange={(e) => handleEntryChange(index, 'amount', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                              className="mt-1 h-9 text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`maturity-${index}`} className="text-xs font-medium text-gray-700">
                              到期时间 <span className="text-red-500">*</span>
                            </Label>
                            <Select 
                              value={entry.maturityMonth} 
                              onValueChange={(value) => handleEntryChange(index, 'maturityMonth', value)}
                            >
                              <SelectTrigger className="mt-1 h-9 text-sm">
                                <SelectValue placeholder="选择到期时间" />
                              </SelectTrigger>
                              <SelectContent className="bg-white z-50">
                                {getMaturityOptions().map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : category.type === 'property' ? (
                // 房产显示专用字段
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`propertyName-${index}`} className="text-xs font-medium text-gray-700">
                      名称 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`propertyName-${index}`}
                      type="text"
                      placeholder="如：海淀某小区"
                      value={entry.propertyName || ''}
                      onChange={(e) => handleEntryChange(index, 'propertyName', e.target.value)}
                      className="mt-1 h-9 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`marketValue-${index}`} className="text-xs font-medium text-gray-700">
                        市值（万元） <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`marketValue-${index}`}
                        type="number"
                        placeholder="如：300"
                        value={entry.marketValue || ''}
                        onChange={(e) => handleEntryChange(index, 'marketValue', parseFloat(e.target.value) || 0)}
                        className="mt-1 h-9 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`maintenanceCost-${index}`} className="text-xs font-medium text-gray-700">
                        养房成本（元/年） <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`maintenanceCost-${index}`}
                        type="number"
                        placeholder="如：12000"
                        value={entry.maintenanceCost || ''}
                        onChange={(e) => handleEntryChange(index, 'maintenanceCost', parseFloat(e.target.value) || 0)}
                        className="mt-1 h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ) : category.type === 'car' ? (
                // 车显示专用字段
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`carName-${index}`} className="text-xs font-medium text-gray-700">
                      名称 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id={`carName-${index}`}
                      type="text"
                      placeholder="如：奔驰C200"
                      value={entry.carName || ''}
                      onChange={(e) => handleEntryChange(index, 'carName', e.target.value)}
                      className="mt-1 h-9 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`marketValue-${index}`} className="text-xs font-medium text-gray-700">
                        市值（万元） <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`marketValue-${index}`}
                        type="number"
                        placeholder="如：30"
                        value={entry.marketValue || ''}
                        onChange={(e) => handleEntryChange(index, 'marketValue', parseFloat(e.target.value) || 0)}
                        className="mt-1 h-9 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`maintenanceCost-${index}`} className="text-xs font-medium text-gray-700">
                        养车成本（元/年） <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`maintenanceCost-${index}`}
                        type="number"
                        placeholder="如：6000"
                        value={entry.maintenanceCost || ''}
                        onChange={(e) => handleEntryChange(index, 'maintenanceCost', parseFloat(e.target.value) || 0)}
                        className="mt-1 h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ) : category.type === 'wealth' ? (
                // 理财/基金显示专用字段
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`amount-${index}`} className="text-xs font-medium text-gray-700">
                        金额(元) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`amount-${index}`}
                        type="number"
                        placeholder="输入金额"
                        value={entry.amount === 0 ? '' : entry.amount}
                        onChange={(e) => handleEntryChange(index, 'amount', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                        className="mt-1 h-9 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`canRedeemAnytime-${index}`} className="text-xs font-medium text-gray-700">
                        赎回方式 <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={entry.canRedeemAnytime || ''} 
                        onValueChange={(value) => handleEntryChange(index, 'canRedeemAnytime', value)}
                      >
                        <SelectTrigger className="mt-1 h-9 text-sm">
                          <SelectValue placeholder="选择赎回方式" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          <SelectItem value="yes">随时可赎回</SelectItem>
                          <SelectItem value="no">约定时间赎回</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {entry.canRedeemAnytime === 'no' && (
                    <div>
                       <Label htmlFor={`maturity-${index}`} className="text-xs font-medium text-gray-700">
                         可赎回时间 <span className="text-red-500">*</span>
                       </Label>
                      <Select 
                        value={entry.maturityMonth} 
                        onValueChange={(value) => handleEntryChange(index, 'maturityMonth', value)}
                      >
                        <SelectTrigger className="mt-1 h-9 text-sm">
                          <SelectValue placeholder="选择到期时间" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {getMaturityOptions().map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ) : category.type === 'stock' ? (
                // 股票显示专用字段
                <div>
                  <Label htmlFor={`amount-${index}`} className="text-xs font-medium text-gray-700">
                    持仓市值(元) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`amount-${index}`}
                    type="number"
                    placeholder="输入持仓市值"
                    value={entry.amount === 0 ? '' : entry.amount}
                    onChange={(e) => handleEntryChange(index, 'amount', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                    className="mt-1 h-9 text-sm"
                  />
                </div>
              ) : (
                // 其他资产类型显示金额和期限
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`amount-${index}`} className="text-xs font-medium text-gray-700">
                      金额(元) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                    id={`amount-${index}`}
                    type="number"
                    placeholder="输入金额"
                    value={entry.amount === 0 ? '' : entry.amount}
                    onChange={(e) => handleEntryChange(index, 'amount', e.target.value === '' ? 0 : parseFloat(e.target.value) || 0)}
                    className="mt-1 h-9 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`maturity-${index}`} className="text-xs font-medium text-gray-700">
                      {getMaturityLabel()} <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={entry.maturityMonth} 
                      onValueChange={(value) => handleEntryChange(index, 'maturityMonth', value)}
                    >
                      <SelectTrigger className="mt-1 h-9 text-sm">
                        <SelectValue placeholder={`选择${getMaturityLabel()}`} />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {getMaturityOptions().map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
            
            {/* 资产说明 - 只在最后一笔资产下方显示 */}
            {index === assetEntries.length - 1 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-xs font-medium text-gray-700 mb-2">资产说明</div>
                <div className="space-y-1">
                  {getExamples().map((example, idx) => (
                    <div key={idx} className="text-xs text-gray-600">{example}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* 按钮区域 - 一行显示 */}
        <div className="">
          <div className="grid grid-cols-2 gap-3 mt-6 mb-3">
            <Button
              onClick={addAssetEntry}
              variant="outline"
              className="flex-1 py-2 text-gray-700 font-bold rounded-2xl text-xs shadow-lg transform hover:scale-[1.02] transition-all duration-300 border border-gray-300 bg-white hover:bg-gray-50"
            >
              <Plus className="w-3 h-3 mr-2" />
              再录一笔
            </Button>
            <Button 
              onClick={handleConfirm}
              className={`flex-1 py-2 text-sm font-bold rounded-2xl transform transition-all duration-300 hover:scale-[1.02] ${
                isConfirmed && !hasDataChanged
                  ? 'bg-gradient-to-r from-[#B3EBEF]/50 to-[#8FD8DC]/50 text-gray-600 opacity-50'
                  : 'bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:from-[#A0E4E9] hover:to-[#7DD3D7] text-gray-900 shadow-md hover:shadow-lg'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {isConfirmed && !hasDataChanged ? '已确认' : `确认${category.name}信息`}
                <Check className="w-4 h-4" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCategoryEditor;