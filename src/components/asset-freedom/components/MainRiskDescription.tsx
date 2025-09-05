import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface LifeEvent {
  name: string;
  amount: number;
}

interface CashFlowData {
  age: number;
  cashFlowSurplus: number;
  lifeEvents: LifeEvent[];
}

interface MainRiskDescriptionProps {
  onViewAssessmentBasis: () => void;
}

export const MainRiskDescription: React.FC<MainRiskDescriptionProps> = ({
  onViewAssessmentBasis
}) => {
  const [selectedPoint, setSelectedPoint] = useState<CashFlowData | null>(null);

  // 生成现金流数据（简化版，只显示一条线）
  const generateCashFlowData = (): CashFlowData[] => {
    const data: CashFlowData[] = [];

    // 定义人生大事及其支出金额
    const allLifeEvents = [
      { name: '结婚', amount: 35 },
      { name: '生育', amount: 15 },
      { name: '老大教育', amount: 120 },
      { name: '老二教育', amount: 120 },
      { name: '刚需购房-还房贷', amount: 280 },
      { name: '刚需购房', amount: 150 },
      { name: '购车', amount: 25 },
      { name: '改善购房', amount: 200 },
      { name: '投资购房', amount: 180 }
    ];

    // 预分配大事到特定年龄（36岁结婚，38岁生老大，40岁生老二）
    const lifeEventsByAge: { [age: number]: LifeEvent[] } = {
      36: [{ name: '结婚', amount: 35 }, { name: '刚需购房', amount: 150 }, { name: '房贷断供-刚需房', amount: 28 }], // 缺口年份开始
      37: [{ name: '房贷断供-刚需房', amount: 28 }],
      38: [{ name: '生育-老大', amount: 15 }, { name: '房贷断供-刚需房', amount: 28 }], // 生老大
      39: [{ name: '房贷断供-刚需房', amount: 28 }],
      40: [{ name: '生育-老二', amount: 15 }, { name: '房贷断供-刚需房', amount: 28 }], // 生老二
      41: [{ name: '房贷断供-刚需房', amount: 28 }],
      42: [{ name: '购车', amount: 25 }, { name: '房贷断供-刚需房', amount: 28 }],
      43: [{ name: '房贷断供-刚需房', amount: 28 }],
      44: [{ name: '老大教育-小学一年级', amount: 8 }, { name: '房贷断供-刚需房', amount: 28 }], // 老大6岁上学 (38+6=44)
      45: [{ name: '老大教育-小学二年级', amount: 8 }, { name: '改善购房', amount: 200 }, { name: '房贷断供-刚需房', amount: 28 }],
      46: [{ name: '老大教育-小学三年级', amount: 9 }, { name: '老二教育-小学一年级', amount: 8 }, { name: '房贷断供-刚需房', amount: 28 }], // 老二6岁上学 (40+6=46)
      47: [{ name: '老大教育-小学四年级', amount: 9 }, { name: '老二教育-小学二年级', amount: 8 }, { name: '投资购房费用不足', amount: 180 }, { name: '房贷断供-刚需房', amount: 28 }],
      48: [{ name: '老大教育-小学五年级', amount: 10 }, { name: '老二教育-小学三年级', amount: 9 }, { name: '房贷断供-刚需房', amount: 28 }],
      49: [{ name: '老大教育-小学六年级', amount: 10 }, { name: '老二教育-小学四年级', amount: 9 }, { name: '房贷断供-刚需房', amount: 28 }],
      50: [{ name: '老大教育-初一', amount: 12 }, { name: '老二教育-小学五年级', amount: 10 }, { name: '房贷断供-刚需房', amount: 28 }], // 缺口年份结束
      51: [{ name: '老大教育-初二', amount: 12 }, { name: '老二教育-小学六年级', amount: 10 }, { name: '房贷断供-刚需房', amount: 28 }],
      52: [{ name: '老大教育-初三', amount: 13 }, { name: '老二教育-初一', amount: 12 }, { name: '房贷断供-刚需房', amount: 28 }],
      53: [{ name: '老大教育-高一', amount: 15 }, { name: '老二教育-初二', amount: 12 }, { name: '房贷断供-刚需房', amount: 28 }],
      54: [{ name: '老大教育-高二', amount: 15 }, { name: '老二教育-初三', amount: 13 }, { name: '房贷断供-刚需房', amount: 28 }],
      55: [{ name: '老大教育-高三', amount: 16 }, { name: '老二教育-高一', amount: 15 }],
      56: [{ name: '老大教育-大学一年级', amount: 20 }, { name: '老二教育-高二', amount: 15 }],
      57: [{ name: '老大教育-大学二年级', amount: 20 }, { name: '老二教育-高三', amount: 16 }],
      58: [{ name: '老大教育-大学三年级', amount: 21 }, { name: '老二教育-大学一年级', amount: 20 }],
      59: [{ name: '老大教育-大学四年级', amount: 21 }, { name: '老二教育-大学二年级', amount: 20 }],
      60: [{ name: '老二教育-大学三年级', amount: 21 }],
      61: [{ name: '老二教育-大学四年级', amount: 21 }]
    };

    for (let age = 28; age <= 85; age++) {
      let cashFlowSurplus;
      
      // 模拟现金流变化：28-35岁有盈余，36-50岁有缺口，51岁后逐渐恢复
      if (age <= 35) {
        // 早期有盈余，逐渐减少
        cashFlowSurplus = 25 - (age - 28) * 3;
      } else if (age <= 50) {
        // 中期有缺口，逐渐加深后恢复
        const midPoint = 43;
        if (age <= midPoint) {
          cashFlowSurplus = -5 - (age - 36) * 4; // 缺口加深
        } else {
          cashFlowSurplus = -33 + (age - midPoint) * 2; // 缺口减少
        }
      } else {
        // 后期恢复盈余
        cashFlowSurplus = -5 + (age - 50) * 1.5;
        if (cashFlowSurplus > 30) cashFlowSurplus = 30; // 上限
      }

      // 添加小幅波动
      const waveEffect = Math.sin((age - 28) * 0.4) * 2;
      cashFlowSurplus += waveEffect;

      // 获取当年的人生大事
      const currentYearEvents = lifeEventsByAge[age] || [];

      data.push({
        age,
        cashFlowSurplus: Math.round(cashFlowSurplus * 10) / 10,
        lifeEvents: currentYearEvents
      });
    }

    return data;
  };

  const cashFlowData = generateCashFlowData();

  const handlePointClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const pointData = data.activePayload[0].payload;
      setSelectedPoint(pointData);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const pointData = payload[0].payload;
      const value = pointData.cashFlowSurplus;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-64">
          <p className="font-medium">{`年龄: ${label}岁`}</p>
          <p className={value >= 0 ? "" : "text-red-600"} style={{ color: value >= 0 ? '#01BCD6' : undefined }}>
            {value >= 0 ? `现金流盈余: ${value}万元` : `现金流缺口: ${Math.abs(value)}万元`}
          </p>
          
          {/* 影响当年大事 - 只在现金流缺口时显示 */}
          {value < 0 && pointData.lifeEvents && pointData.lifeEvents.length > 0 && (
            <div className="border-t pt-2 mt-2">
              <h5 className="font-medium text-gray-700 mb-1 text-xs">当年大事：</h5>
              <div className="space-y-1">
                {pointData.lifeEvents.map((event: LifeEvent, index: number) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-gray-600">{event.name}：</span>
                    <span className="font-medium text-red-600">{event.amount}万元</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-red-50/80 to-pink-50/60 relative overflow-hidden rounded-lg p-4 mb-4 shadow-sm border">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <h3 className="text-lg font-bold text-red-800">提醒您关注，您的规划无法实现</h3>
        </div>
        
        <div className="space-y-3">
          {/* 数字展示区域 */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-600 mb-1">未来有现金流缺口年份</div>
              <div className="text-lg font-bold text-red-600">15年</div>
            </div>
            <div className="bg-white/50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-600 mb-1">未来现金流缺口总额</div>
              <div className="text-lg font-bold text-red-600">578万</div>
            </div>
          </div>

          {/* 现金流折线图 */}
          <div className="mt-4 space-y-4">
            {/* 图表说明 */}
            <div className="p-3 bg-white/50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2 text-sm">现金流缺口详情</h4>
              <div className="text-xs text-gray-600">
                <p className="flex items-center">
                  <span className="inline-block w-4 h-0.5 bg-[#ef4444] mr-2"></span>
                  未来年份现金流盈余/缺口预测
                </p>
              </div>
            </div>

            {/* 折线图 */}
            <div className="h-64 pl-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={cashFlowData}
                  margin={{ top: 10, right: 0, left: 0, bottom: 10 }}
                  onClick={handlePointClick}
                >
                  <defs>
                    <linearGradient id="cashFlowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="age" 
                    tick={{ fontSize: 10 }}
                    axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                    tickLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                  />
                  <YAxis 
                    tick={{ 
                      fontSize: 10, 
                      textAnchor: 'end', 
                      fill: '#000'
                    }}
                    tickFormatter={(value) => `${value}`}
                    axisLine={{ stroke: '#000', strokeWidth: 1 }}
                    tickLine={{ stroke: '#000', strokeWidth: 1 }}
                    width={26}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="2 2" />
                  <Area
                    type="monotone"
                    dataKey="cashFlowSurplus"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#cashFlowGradient)"
                    fillOpacity={0.6}
                    dot={false}
                    activeDot={{ r: 5, stroke: '#ef4444', strokeWidth: 2, fill: '#ffffff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 详细数据展示 */}
            {selectedPoint && (
              <div className="p-3 bg-white/50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2 text-sm">{selectedPoint.age}岁详细数据</h4>
                <div className="space-y-2 text-xs">
                  {/* 现金流信息 */}
                  <div className="flex justify-between">
                    <span>{selectedPoint.cashFlowSurplus >= 0 ? '现金流盈余：' : '现金流缺口：'}</span>
                    <span className="font-medium" style={{ color: selectedPoint.cashFlowSurplus >= 0 ? '#01BCD6' : '#ef4444' }}>
                      {selectedPoint.cashFlowSurplus >= 0 ? selectedPoint.cashFlowSurplus : Math.abs(selectedPoint.cashFlowSurplus)}万元
                    </span>
                  </div>
                  
                  {/* 影响当年大事 - 只在有现金流缺口时显示 */}
                  {selectedPoint.cashFlowSurplus < 0 && selectedPoint.lifeEvents && selectedPoint.lifeEvents.length > 0 && (
                    <div className="border-t pt-2">
                      <h5 className="font-medium text-gray-700 mb-1">当年大事：</h5>
                      <div className="space-y-1">
                        {selectedPoint.lifeEvents.map((event, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-gray-600">{event.name}：</span>
                            <span className="font-medium text-red-600">{event.amount}万元</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!selectedPoint && (
              <div className="p-3 bg-white/50 rounded-lg text-center text-gray-500 text-xs">
                点击图表上的任意点查看详细数据
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};