import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, PiggyBank, ArrowRight, Check } from 'lucide-react';

import AssetCategoryEditor from '@/components/asset/AssetCategoryEditor';

// 资产类型定义
export interface AssetInfo {
  id: string;
  categoryId: string;
  amount: number;
  maturityMonth: string;
  // 房产特有字段
  propertyName?: string;
  marketValue?: number;
  maintenanceCost?: number;
  // 车特有字段
  carName?: string;
  // 理财/基金特有字段
  canRedeemAnytime?: string;
  // 存款特有字段
  depositType?: string;
}

const AssetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 检测是否从baogao页面进入（使用路由state或会话存储标记）
  const fromBaogao = location.state?.from === 'baogao' || sessionStorage.getItem('fromBaogao') === '1';
  
  // 资产配置状态
  const [assets, setAssets] = useState<AssetInfo[]>([]);
  const [configConfirmed, setConfigConfirmed] = useState<{[key: string]: boolean}>({});
  
  // 实时数据状态（用于显示未确认但已填写的数据）
  const [liveData, setLiveData] = useState<{[key: string]: any}>({});
  
  // 定义资产配置顺序
  const assetCategories = [
    { id: 'deposit', name: '存款', type: 'deposit' as const },
    { id: 'wealth', name: '理财/基金', type: 'wealth' as const },
    { id: 'stock', name: '股票', type: 'stock' as const },
    { id: 'property', name: '房产', type: 'property' as const },
    { id: 'car', name: '车', type: 'car' as const },
    { id: 'other', name: '其他', type: 'other' as const }
  ];

  const currentCategory = assetCategories[currentIndex];

  // 从localStorage加载数据
  useEffect(() => {
    // 从required-life页面获取房产和车的预设数据
    const getRequiredLifeAssets = () => {
      try {
        const requiredLifeData = localStorage.getItem('requiredLifeData');
        if (requiredLifeData) {
          const data = JSON.parse(requiredLifeData);
          const assets: AssetInfo[] = [];
          
          // 添加房产数据 - 幸福里和栖海云颂
          assets.push({
            id: 'preset_property_1',
            categoryId: 'property',
            amount: 280, // 市值
            maturityMonth: 'self_occupied',
            propertyName: '幸福里',
            marketValue: 280,
            maintenanceCost: 15000
          });
          
          assets.push({
            id: 'preset_property_2', 
            categoryId: 'property',
            amount: 350, // 市值
            maturityMonth: 'self_occupied', 
            propertyName: '栖海云颂',
            marketValue: 350,
            maintenanceCost: 18000
          });
          
          // 添加车数据 - 丰田和比亚迪
          assets.push({
            id: 'preset_car_1',
            categoryId: 'car',
            amount: 20, // 市值
            maturityMonth: '2023',
            carName: '丰田',
            marketValue: 20,
            maintenanceCost: 12000
          });
          
          assets.push({
            id: 'preset_car_2',
            categoryId: 'car', 
            amount: 25, // 市值
            maturityMonth: '2022',
            carName: '比亚迪',
            marketValue: 25,
            maintenanceCost: 10000
          });
          
          return assets;
        }
      } catch (error) {
        console.error('Error loading required life data:', error);
      }
      return [];
    };
    
    const savedData = localStorage.getItem('assetData');
    const presetAssets = getRequiredLifeAssets();
    
    if (savedData) {
      const data = JSON.parse(savedData);
      // 合并已保存的数据和预设数据，预设数据优先
      const existingAssets = data.assets || [];
      const nonPresetAssets = existingAssets.filter((asset: AssetInfo) => 
        !asset.id.startsWith('preset_property_') && !asset.id.startsWith('preset_car_')
      );
      const mergedAssets = [...presetAssets, ...nonPresetAssets];
      
      setAssets(mergedAssets);
      setConfigConfirmed({
        ...data.configConfirmed,
        'property': true, // 房产默认已确认
        'car': true       // 车默认已确认
      });
    } else {
      // 如果没有保存的数据，使用预设数据
      setAssets(presetAssets);
      setConfigConfirmed({
        'property': true, // 房产默认已确认
        'car': true       // 车默认已确认
      });
    }
  }, []);

  // 计算资产汇总（优先使用实时数据）
  const calculateTotalAssets = () => {
    console.log('=== 计算资产总额 ===');
    console.log('当前所有资产:', assets);
    console.log('当前类别:', currentCategory);
    console.log('确认状态:', configConfirmed);
    console.log('实时数据:', liveData);
    
    let total = assets.reduce((sum, asset) => {
      // 对于房产和车，使用市值并转换为元（市值单位是万元）
      if (asset.categoryId === 'property' || asset.categoryId === 'car') {
        const value = (asset.marketValue || asset.amount) * 10000; // 万元转换为元
        console.log(`${asset.categoryId} ${asset.propertyName || asset.carName}: 市值=${asset.marketValue}万元, 转换后=${value}元`);
        return sum + value;
      }
      console.log(`${asset.categoryId}: 金额=${asset.amount}元`);
      return sum + asset.amount;
    }, 0);
    
    console.log('基础资产总额:', total);
    
    // 加上当前正在编辑但未确认的数据
    const currentCategoryData = liveData[currentCategory.id];
    if (currentCategoryData && !configConfirmed[currentCategory.id]) {
      const liveTotal = currentCategoryData.reduce((sum: number, entry: any) => {
        // 对于房产和车，使用市值并转换为元
        if (currentCategory.type === 'property' || currentCategory.type === 'car') {
          return sum + (entry.marketValue || 0) * 10000;
        }
        return sum + (entry.amount || 0);
      }, 0);
      
      // 计算除当前类别外的其他已确认资产总额
      const otherAssetsTotal = assets
        .filter(asset => asset.categoryId !== currentCategory.id)
        .reduce((sum, asset) => {
          if (asset.categoryId === 'property' || asset.categoryId === 'car') {
            return sum + (asset.marketValue || asset.amount) * 10000;
          }
          return sum + asset.amount;
        }, 0);
      
      total = otherAssetsTotal + liveTotal;
      console.log('包含实时数据后的总额:', total);
    }
    
    console.log('最终资产总额:', total);
    return total;
  };

  // 处理实时数据变化
  const handleDataChange = (categoryId: string, data: any) => {
    setLiveData(prev => ({
      ...prev,
      [categoryId]: data
    }));
  };

  // 处理配置确认
  const handleConfigConfirm = (categoryId: string, categoryAssets: AssetInfo[]) => {
    // 移除该类别的旧资产
    const filteredAssets = assets.filter(asset => asset.categoryId !== categoryId);
    // 添加新的资产
    const updatedAssets = [...filteredAssets, ...categoryAssets];
    setAssets(updatedAssets);

    setConfigConfirmed({
      ...configConfirmed,
      [categoryId]: true
    });

    // 保存到localStorage
    const assetData = {
      assets: updatedAssets,
      configConfirmed: {
        ...configConfirmed,
        [categoryId]: true
      }
    };
    localStorage.setItem('assetData', JSON.stringify(assetData));

    // 完成当前配置后不自动跳转，由用户通过上方类型选择切换
    // 保留数据与确认状态，不改变 currentIndex
  };

  // 返回上一步
  const goToPreviousStep = () => {
    if (currentIndex > 0) {
      // 返回到前一个配置项
      const previousIndex = currentIndex - 1;
      const previousCategoryId = assetCategories[previousIndex].id;
      setCurrentIndex(previousIndex);
      // 取消前一个配置的确认状态，允许重新编辑
      setConfigConfirmed({
        ...configConfirmed,
        [previousCategoryId]: false
      });
    } else {
      // 如果是从baogao页面进入，返回baogao页面；否则返回上一页
      if (fromBaogao) {
        navigate('/baogao');
      } else {
        navigate(-1);
      }
    }
  };


  const goToNext = () => {
    // 保存资产数据
    const assetData = {
      assets,
      totalAssets: calculateTotalAssets(),
      configConfirmed
    };
    localStorage.setItem('assetData', JSON.stringify(assetData));
    navigate('/baogao');
  };

  const getCurrentAssets = () => {
    return assets.filter(asset => asset.categoryId === currentCategory.id);
  };

  return (
    <div className="min-h-screen bg-[#F4FDFD] flex flex-col">
      {/* 返回按钮 - 仅在从baogao页面进入时显示 */}
      {fromBaogao && (
        <div className="absolute top-4 left-4 z-50">
          <button
            onClick={() => { sessionStorage.removeItem('fromBaogao'); navigate('/baogao'); }}
            className="flex items-center justify-center w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg border border-gray-200/50 transition-all hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}
      
      <div className="relative flex flex-col bg-white/90 backdrop-blur-xl flex-1">
        {/* 标题区域 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#B3EBEF]/20 via-white/60 to-[#B3EBEF]/20 -mx-2">
          <div className="relative py-6 text-center flex flex-col justify-center" style={{ minHeight: '80px' }}>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight mb-2">
              梳理现有资产
            </h1>
            
            {/* 资产汇总卡片 */}
            <div className="px-3 mt-4">
              <div className="bg-gradient-to-br from-[#B3EBEF]/20 to-[#8FD8DC]/20 rounded-lg p-4 border border-[#B3EBEF]/30">
                <div className="text-2xl font-bold text-gray-900 mb-1">{Math.round(calculateTotalAssets()).toLocaleString()}元</div>
                <p className="text-sm text-gray-700">资产总金额</p>
              </div>
            </div>
          </div>
        </div>

        {/* 资产类型选择（三列网格布局） */}
        <div className="px-3 mt-3">
          <div className="grid grid-cols-3 gap-2">
            {assetCategories.map((cat, idx) => {
              const active = idx === currentIndex;
              const hasData = assets.filter(asset => asset.categoryId === cat.id).length > 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={
                    `relative flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ` +
                    (active
                      ? 'bg-[#B3EBEF]/30 border-[#8FD8DC] text-gray-900 shadow'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50')
                  }
                  aria-pressed={active}
                >
                  {cat.name}
                  {hasData && cat.id !== 'deposit' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#01BCD6' }}>
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>


        {/* 配置流程 */}
        <div className="flex-1 px-3 py-4 pb-28">
          <AssetCategoryEditor
            key={currentCategory.id}
            category={currentCategory}
            onConfirm={handleConfigConfirm}
            onDataChange={handleDataChange}
            isConfirmed={configConfirmed[currentCategory.id]}
            existingAssets={getCurrentAssets()}
          />
        </div>

        {/* 底部导航 */}
        <div className="fixed bottom-0 left-0 right-0 z-50 p-2 space-y-3 bg-gradient-to-t from-white via-white/95 to-white/90 backdrop-blur-xl border-t border-gray-100 pb-safe" 
             style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
          <div className="flex gap-2">
            <Button 
              onClick={goToNext}
              className="flex-1 py-2 text-gray-900 font-bold rounded-2xl text-xs shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-0 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:from-[#A0E2E6] hover:to-[#7BC9CE]"
            >
              <span className="flex items-center justify-center gap-2">
                资产录入完毕，下一步
                <ArrowLeft className="w-3 h-3 rotate-180" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetPage;