import React from 'react';
import { TrendingDown } from 'lucide-react';

export const HousingRecommendationContent: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 第一套房：置换+融资购房 */}
      <div className="space-y-3">
        {/* 第一套房合并卡片 */}
        <div className="bg-white rounded-lg p-4 shadow-sm relative">
          <div className="mb-3">
            <h5 className="text-sm font-medium text-gray-800">购房计划</h5>
            <span className="absolute top-4 right-4 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium">第一套</span>
          </div>
          
          {/* 购房信息 */}
          <div className="grid grid-cols-4 gap-4 text-sm mb-4">
            <div className="text-center">
              <div className="font-medium text-gray-800">40岁</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-800">投资购房</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-800">3居室</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-800">500万</div>
            </div>
          </div>

          {/* 分隔线 */}
          <div className="border-t border-gray-100 mb-4"></div>

          {/* 购买方式标题 */}
          <div className="mb-3 flex items-center space-x-2">
            <h6 className="text-sm font-medium text-gray-700">购买方式</h6>
            <span className="px-2 py-1 text-xs rounded-full text-gray-800" style={{backgroundColor: '#CAF4F7'}}>置换+融资</span>
          </div>

          {/* 置换房产信息 */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">置换</span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <span className="text-gray-700">置换房产：</span>
                <span className="font-bold text-gray-800">300万</span>
              </div>
              <div>
                <span className="text-gray-700">置换时间：</span>
                <span className="font-bold text-gray-800">40岁</span>
              </div>
              <div>
                <span className="text-gray-700">提前还贷：</span>
                <span className="font-bold text-gray-800">150万</span>
              </div>
            </div>
          </div>

          {/* 分隔线 */}
          <div className="border-t border-gray-100 mb-4"></div>

          {/* 融资信息 */}
          <div>
            <div className="flex items-center mb-2">
              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">融资</span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <span className="text-gray-700">首付金额：</span>
                <span className="font-bold text-gray-800">200万</span>
              </div>
              <div>
                <span className="text-gray-700">贷款金额：</span>
                <span className="font-bold text-gray-800">300万</span>
              </div>
              <div>
                <span className="text-gray-700">贷款期限：</span>
                <span className="font-bold text-gray-800">30年</span>
              </div>
              <div>
                <span className="text-gray-700">预计月供：</span>
                <span className="font-bold text-gray-800">1.5万</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 第二套房：融资购房 */}
      <div className="space-y-3">
        {/* 第二套房合并卡片 */}
        <div className="bg-white rounded-lg p-4 shadow-sm relative">
          <div className="mb-3">
            <h5 className="text-sm font-medium text-gray-800">未来购房-建议购房方式</h5>
            <span className="absolute top-4 right-4 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium">第二套</span>
          </div>
          
          {/* 购房信息 */}
          <div className="grid grid-cols-4 gap-4 text-sm mb-4">
            <div className="text-center">
              <div className="font-medium text-gray-800">45岁</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-800">自住购房</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-800">4居室</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-800">800万</div>
            </div>
          </div>

          {/* 分隔线 */}
          <div className="border-t border-gray-100 mb-4"></div>

          {/* 融资详细信息 */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <span className="text-gray-700">首付金额：</span>
              <span className="font-bold text-gray-800">360万</span>
            </div>
            <div>
              <span className="text-gray-700">贷款金额：</span>
              <span className="font-bold text-gray-800">240万</span>
            </div>
            <div>
              <span className="text-gray-700">贷款期限：</span>
              <span className="font-bold text-gray-800">25年</span>
            </div>
            <div>
              <span className="text-gray-700">预计月供：</span>
              <span className="font-bold text-gray-800">1.3万</span>
            </div>
          </div>
        </div>
      </div>

      {/* 第三套房：全款购房 */}
      <div className="space-y-3">
        {/* 第三套房合并卡片 */}
        <div className="bg-white rounded-lg p-4 shadow-sm relative">
          <div className="mb-3">
            <h5 className="text-sm font-medium text-gray-800">未来购房-建议购房方式</h5>
            <span className="absolute top-4 right-4 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium">第三套</span>
          </div>
          
          {/* 购房信息 */}
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-gray-800">50岁</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-800">度假房</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-800">2居室</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-800">300万</div>
            </div>
          </div>
        </div>
      </div>

      {/* 第四套房：降低购房金额+置换+融资购房 */}
      <div className="space-y-3">
        {/* 第四套房合并卡片 */}
        <div className="bg-white rounded-lg p-4 shadow-sm relative">
          <div className="mb-3">
            <h5 className="text-sm font-medium text-gray-800">未来购房-建议购房方式</h5>
            <span className="absolute top-4 right-4 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium">第四套</span>
          </div>
          
          {/* 购房信息 */}
          <div className="grid grid-cols-4 gap-4 text-sm mb-4">
            <div className="text-center">
              <div className="font-medium text-gray-800">50岁</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-800">投资购房</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-800">3居室</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-400 line-through">500万</div>
            </div>
          </div>

          {/* 分隔线 */}
          <div className="border-t border-gray-100 mb-4"></div>

          {/* 降低购房金额 */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="px-2 py-1 text-xs rounded-full text-gray-800" style={{backgroundColor: '#CAF4F7'}}>降低购房金额</span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <span className="text-gray-700">降低后预算：</span>
                <span className="font-bold text-gray-800">400万</span>
              </div>
            </div>
          </div>

          {/* 分隔线 */}
          <div className="border-t border-gray-100 mb-4"></div>

          {/* 置换 */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="px-2 py-1 text-xs rounded-full text-gray-800" style={{backgroundColor: '#CAF4F7'}}>卖掉现有房</span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <span className="text-gray-700">出售房产：</span>
                <span className="font-bold text-gray-800">300万</span>
              </div>
              <div>
                <span className="text-gray-700">出售时间：</span>
                <span className="font-bold text-gray-800">50岁</span>
              </div>
              <div>
                <span className="text-gray-700">提前还贷：</span>
                <span className="font-bold text-gray-800">150万</span>
              </div>
            </div>
          </div>

          {/* 分隔线 */}
          <div className="border-t border-gray-100 mb-4"></div>

          {/* 融资购房 */}
          <div>
            <div className="flex items-center mb-2">
              <span className="px-2 py-1 text-xs rounded-full text-gray-800" style={{backgroundColor: '#CAF4F7'}}>融资购房</span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <span className="text-gray-700">首付金额：</span>
                <span className="font-bold text-gray-800">200万</span>
              </div>
              <div>
                <span className="text-gray-700">贷款金额：</span>
                <span className="font-bold text-gray-800">300万</span>
              </div>
              <div>
                <span className="text-gray-700">贷款期限：</span>
                <span className="font-bold text-gray-800">30年</span>
              </div>
              <div>
                <span className="text-gray-700">预计月供：</span>
                <span className="font-bold text-gray-800">1.5万</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 降低租房支出 */}
      <div className="space-y-3">
        <div className="bg-white rounded-lg p-4 shadow-sm mt-1 flex items-center">
          <div className="space-y-4 w-full">
            <h5 className="text-sm font-medium text-gray-800">降低租房支出</h5>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-800">
                  影响年份：28岁-40岁
                </span>
              </div>
              
              <div className="flex items-start justify-between py-1.5">
                <div className="flex flex-col items-start">
                  <span className="text-sm text-gray-600 mb-1">原规划支出</span>
                  <span className="text-sm text-gray-400 line-through">
                    8000元/月
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm text-gray-600 mb-1">建议调整为</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-gray-800">
                      6000元/月
                    </span>
                    <div className="flex items-center space-x-1">
                      <TrendingDown className="w-3 h-3 text-red-500" />
                      <span className="text-sm text-red-500 font-medium">
                        25%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 出售房产 */}
      <div className="space-y-3">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h5 className="text-sm font-medium text-gray-800 mb-3">出售房产</h5>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <span className="text-gray-700">房产价值：</span>
              <span className="font-bold text-gray-800">300万</span>
            </div>
            <div>
              <span className="text-gray-700">出售时间：</span>
              <span className="font-bold text-gray-800">40岁</span>
            </div>
            <div>
              <span className="text-gray-700">提前还贷：</span>
              <span className="font-bold text-gray-800">150万</span>
            </div>
            <div>
              <span className="text-gray-700">减少租金：</span>
              <span className="font-bold text-gray-800">20.4万</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-700">减少租期：</span>
              <span className="font-bold text-gray-800">40岁-48岁</span>
            </div>
          </div>
        </div>
      </div>

      {/* 出租房产 */}
      <div className="space-y-3">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h5 className="text-sm font-medium text-gray-800 mb-3">出租房产</h5>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <span className="text-gray-700">房产价值：</span>
              <span className="font-bold text-gray-800">200万</span>
            </div>
            <div>
              <span className="text-gray-700">预估租金：</span>
              <span className="font-bold text-gray-800">500元/月</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-700">出租时间：</span>
              <span className="font-bold text-gray-800">40岁-50岁</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};