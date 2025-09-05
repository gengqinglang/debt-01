import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AssetJianPage = () => {
  const navigate = useNavigate();
  const [totalAssets, setTotalAssets] = useState<string>('0');

  const goToNext = () => {
    // 保存资产数据
    const assetData = {
      totalAssets: parseFloat(totalAssets) || 0
    };
    localStorage.setItem('simplifiedAssetData', JSON.stringify(assetData));
    navigate('/career-planning');
  };

  const handleInputChange = (value: string) => {
    // 只允许数字和小数点
    const filteredValue = value.replace(/[^0-9.]/g, '');
    setTotalAssets(filteredValue);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 标题区域 */}
      <div className="relative px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-br from-[#B3EBEF]/20 via-white/60 to-[#B3EBEF]/20 flex-shrink-0">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            家庭现有资产
          </h1>
          <p className="text-sm text-gray-600">
            快速录入您的资产总额
          </p>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 bg-white min-h-0">
        <div className="w-full max-w-sm space-y-4">
          {/* 说明文案 */}
          <div className="text-center space-y-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#01BCD6] rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-xl sm:text-2xl font-bold">¥</span>
            </div>
            <p className="text-gray-700 text-sm sm:text-base font-medium">
              请输入您家庭的资产总金额
            </p>
          </div>

          {/* 大输入框 */}
          <div className="space-y-4">
            <div className="relative">
                <Input
                  id="totalAssets"
                  type="text"
                  placeholder="0"
                  value={totalAssets}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="h-16 sm:h-20 text-xl sm:text-2xl text-center pr-16 sm:pr-20 font-bold border-2 border-[#B3EBEF] focus:border-[#01BCD6] rounded-2xl shadow-lg bg-white backdrop-blur-sm transition-all duration-300 text-[#01BCD6]"
                />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-6 pointer-events-none">
                <span className="text-[#01BCD6] text-lg sm:text-xl font-semibold">万元</span>
              </div>
            </div>

            {/* 示例提示 */}
            <div className="text-center bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">
                包括现金、存款、股票、基金、房产等所有资产
              </p>
              <p className="text-xs text-gray-500 border-t border-gray-200 pt-2">
                示例：房产200万 + 存款50万 + 其他20万 = 270万
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="px-4 sm:px-6 py-4 bg-white/80 backdrop-blur-sm border-t border-gray-100 flex-shrink-0">
        <Button 
          onClick={goToNext}
          className="w-full h-12 sm:h-14 text-gray-900 font-bold rounded-2xl text-sm sm:text-base shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-0 bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:from-[#A0E2E6] hover:to-[#7BC9CE]"
        >
          <span className="flex items-center justify-center gap-2 sm:gap-3">
            资产录入完毕，下一步
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default AssetJianPage;