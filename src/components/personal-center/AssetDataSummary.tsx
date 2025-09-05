import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Wallet, TrendingUp, TrendingDown, DollarSign, ChevronDown, ChevronUp, Home, Car, Briefcase } from 'lucide-react';

const AssetDataSummary = () => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  // 读取资产负债数据
  const financialData = useMemo(() => {
    console.log('=== 资产数据调试 ===');
    console.log('所有 localStorage 键:', Object.keys(localStorage));
    
    try {
      // 尝试多个可能的键名，包括实际使用的键名
      const possibleKeys = ['financialStatusData', 'financialStatus', 'assetData', 'financialData', 'assetsLiabilities'];
      let savedData = null;
      let usedKey = '';
      
      for (const key of possibleKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          savedData = data;
          usedKey = key;
          break;
        }
      }
      
      console.log('资产数据键名:', usedKey);
      console.log('资产数据原始:', savedData);
      
      if (savedData) {
        const data = JSON.parse(savedData);
        console.log('解析后的资产数据:', data);
        
        // 处理不同的数据格式
        let totalAssets = 0;
        let totalLiabilities = 0;
        let assets = [];
        let liabilities = [];
        
        // 如果数据已经有计算好的总额
        if (data.totalAssets !== undefined && data.totalLiabilities !== undefined) {
          totalAssets = data.totalAssets;
          totalLiabilities = data.totalLiabilities;
          assets = data.assets || [];
          liabilities = data.liabilities || [];
        } else {
          // 如果需要从明细计算总额
          if (data.assets && Array.isArray(data.assets)) {
            assets = data.assets;
            totalAssets = assets.reduce((sum: number, asset: any) => sum + (asset.amount || 0), 0);
          }
          
          if (data.liabilities && Array.isArray(data.liabilities)) {
            liabilities = data.liabilities;
            totalLiabilities = liabilities.reduce((sum: number, liability: any) => sum + (liability.amount || 0), 0);
          }
        }
        
        const result = {
          totalAssets,
          totalLiabilities,
          netWorth: totalAssets - totalLiabilities,
          assets,
          liabilities
        };
        
        console.log('处理后的资产数据:', result);
        console.log('=== 资产数据调试结束 ===');
        return result;
      }
      
      console.log('未找到资产数据');
      console.log('=== 资产数据调试结束 ===');
      return {
        totalAssets: 0,
        totalLiabilities: 0,
        netWorth: 0,
        assets: [],
        liabilities: []
      };
    } catch (error) {
      console.error('读取资产数据错误:', error);
      return {
        totalAssets: 0,
        totalLiabilities: 0,
        netWorth: 0,
        assets: [],
        liabilities: []
      };
    }
  }, []);

  // 清理类型名称，去掉末尾的数字
  const cleanTypeName = (typeName: string) => {
    return typeName.replace(/\d+$/, '');
  };

  // 按类型分组资产
  const groupedAssets = useMemo(() => {
    const groups: { [key: string]: { items: any[], total: number } } = {};
    
    financialData.assets.forEach((asset: any) => {
      const originalType = asset.type || '其他';
      const cleanType = cleanTypeName(originalType);
      if (!groups[cleanType]) {
        groups[cleanType] = { items: [], total: 0 };
      }
      groups[cleanType].items.push(asset);
      groups[cleanType].total += asset.amount || 0;
    });
    
    return groups;
  }, [financialData.assets]);

  // 按类型分组负债
  const groupedLiabilities = useMemo(() => {
    const groups: { [key: string]: { items: any[], total: number } } = {};
    
    financialData.liabilities.forEach((liability: any) => {
      const originalType = liability.type || '其他';
      const cleanType = cleanTypeName(originalType);
      if (!groups[cleanType]) {
        groups[cleanType] = { items: [], total: 0 };
      }
      groups[cleanType].items.push(liability);
      groups[cleanType].total += liability.amount || 0;
    });
    
    return groups;
  }, [financialData.liabilities]);

  // 资产类型图标映射
  const getAssetIcon = (type: string) => {
    switch (type) {
      case '房产':
      case '不动产':
        return Home;
      case '车辆':
      case '汽车':
        return Car;
      case '银行存款':
      case '定期存款':
        return DollarSign;
      case '股票':
      case '基金':
      case '理财产品':
        return TrendingUp;
      case '公司股权':
      case '投资':
        return Briefcase;
      default:
        return Wallet;
    }
  };

  if (financialData.totalAssets === 0 && financialData.totalLiabilities === 0) {
    return (
      <Card className="p-4 text-center">
        <div className="text-gray-500">
          <Wallet className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">暂无资产负债数据</p>
          <p className="text-xs text-gray-400 mt-1">请先完成财务状况设置</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* 净资产显示 */}
      <Card className="p-3 bg-gradient-to-br from-[#FFE8B3]/10 to-[#FFE0A1]/10 border-[#FFE8B3]/30">
        <div className="text-center">
          <div className="text-base font-semibold text-gray-900">
            净资产：{financialData.netWorth.toFixed(1)}万元
          </div>
          <div className="text-xs text-gray-600 mt-1">
            总资产 {financialData.totalAssets.toFixed(1)}万 - 总负债 {financialData.totalLiabilities.toFixed(1)}万
          </div>
        </div>
      </Card>

      {/* 资产负债汇总 */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">总资产</span>
          </div>
          <div className="text-sm font-bold text-green-600">
            {financialData.totalAssets.toFixed(1)}万
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Object.keys(groupedAssets).length}个分类
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
              <TrendingDown className="w-3 h-3 text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">总负债</span>
          </div>
          <div className="text-sm font-bold text-red-600">
            {financialData.totalLiabilities.toFixed(1)}万
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Object.keys(groupedLiabilities).length}个分类
          </div>
        </Card>
      </div>

      {/* 详细分类展开/收起 */}
      <Card className="p-3">
        <div 
          className="flex items-center justify-between cursor-pointer mb-2"
          onClick={() => setShowBreakdown(!showBreakdown)}
        >
          <span className="text-sm font-medium text-gray-900">详细分类</span>
          {showBreakdown ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </div>

        {showBreakdown && (
          <div className="space-y-3">
            {/* 资产分类明细 */}
            {Object.keys(groupedAssets).length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  资产分类明细
                </div>
                <div className="space-y-2">
                  {Object.entries(groupedAssets).map(([type, group]) => {
                    const IconComponent = getAssetIcon(type);
                    return (
                      <div key={type} className="border-l-2 border-green-200 pl-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-3 h-3 text-green-600" />
                            <span className="text-xs font-medium text-gray-800">{type}</span>
                          </div>
                          <span className="text-xs font-bold text-green-600">
                            {group.total.toFixed(1)}万
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 负债分类明细 */}
            {Object.keys(groupedLiabilities).length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-red-600" />
                  负债分类明细
                </div>
                <div className="space-y-2">
                  {Object.entries(groupedLiabilities).map(([type, group]) => (
                    <div key={type} className="border-l-2 border-red-200 pl-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="w-3 h-3 text-red-600" />
                          <span className="text-xs font-medium text-gray-800">{type}</span>
                        </div>
                        <span className="text-xs font-bold text-red-600">
                          {group.total.toFixed(1)}万
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AssetDataSummary;
