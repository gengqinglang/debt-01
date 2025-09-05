import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface CashFlowData {
  age: number;
  normalInflow: number;
  normalOutflow: number;
  normalSurplus: number;
  riskInflow: number;
  riskOutflow: number;
  riskSurplus: number;
}

interface InlineCashFlowChartProps {
  isExpanded: boolean;
}

export const InlineCashFlowChart: React.FC<InlineCashFlowChartProps> = ({ isExpanded }) => {
  const [selectedPoint, setSelectedPoint] = useState<CashFlowData | null>(null);

  // 生成从28岁到85岁的现金流数据
  const generateCashFlowData = (): CashFlowData[] => {
    const data: CashFlowData[] = [];
    const riskStartAge = 28; // 风险开始年龄
    const riskDuration = 15; // 风险持续15年

    for (let age = 28; age <= 85; age++) {
      // 正常情况下的现金流（增加波动效果）
      const baseInflow = 45 + (age - 28) * 0.8;
      const baseOutflow = 25 + (age - 28) * 0.3;
      
      // 添加周期性波动，让曲线更自然
      const waveEffect1 = Math.sin((age - 28) * 0.3) * 3; // 主要波动
      const waveEffect2 = Math.cos((age - 28) * 0.5) * 1.5; // 次要波动
      const randomVariation = (Math.random() - 0.5) * 2; // 小幅随机波动
      
      const normalInflow = baseInflow + waveEffect1 + randomVariation;
      const normalOutflow = baseOutflow + waveEffect2 * 0.5;
      const normalSurplus = normalInflow - normalOutflow;

      // 出险后的现金流（确保整体低于正常情况且平滑过渡）
      let riskSurplus;
      
      if (age >= riskStartAge && age < riskStartAge + riskDuration) {
        // 风险期间（28-43岁）：逐渐从-40万降到-25万
        const riskProgress = (age - riskStartAge) / (riskDuration - 1); // 0到1的进度
        riskSurplus = -40 + riskProgress * 15; // 从-40逐渐上升到-25
      } else if (age < riskStartAge) {
        // 风险前：稍微低于正常情况
        riskSurplus = normalSurplus * 0.9;
      } else {
        // 风险后（43岁以后）：平滑恢复但始终低于正常情况
        const yearsAfterRisk = age - (riskStartAge + riskDuration);
        if (yearsAfterRisk <= 10) {
          // 前10年缓慢恢复：从-25万逐渐恢复到正值
          const recoveryProgress = yearsAfterRisk / 10;
          riskSurplus = -25 + recoveryProgress * (normalSurplus * 0.6 + 25); // 逐渐恢复到正常情况的60%
        } else {
          // 10年后：稳定在正常情况的60-70%
          const stabilizationFactor = Math.min(0.7, 0.6 + (yearsAfterRisk - 10) / 100);
          riskSurplus = normalSurplus * stabilizationFactor;
        }
      }

      // 计算对应的收入和支出（为了显示详细数据）
      let riskInflow, riskOutflow;
      if (age >= riskStartAge && age < riskStartAge + riskDuration) {
        riskInflow = normalInflow * 0.4;
        riskOutflow = riskInflow - riskSurplus;
      } else if (age < riskStartAge) {
        riskInflow = normalInflow * 0.95;
        riskOutflow = normalOutflow * 1.05;
      } else {
        riskInflow = normalInflow * 0.8;
        riskOutflow = riskInflow - riskSurplus;
      }

      data.push({
        age,
        normalInflow: Math.round(normalInflow),
        normalOutflow: Math.round(normalOutflow),
        normalSurplus: Math.round(normalSurplus * 10) / 10, // 保留一位小数
        riskInflow: Math.round(riskInflow),
        riskOutflow: Math.round(riskOutflow),
        riskSurplus: Math.round(riskSurplus * 10) / 10, // 保留一位小数
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
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`年龄: ${label}岁`}</p>
          <p className="text-blue-600">{`正常盈余: ${payload[0].value}万元`}</p>
          <p className="text-red-600">{`出险后盈余: ${payload[1].value}万元`}</p>
        </div>
      );
    }
    return null;
  };

  if (!isExpanded) return null;

  return (
    <div className="mt-4 space-y-4">
      {/* 图表说明 */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2 text-sm">正常情况VS出险后现金流对比</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p className="flex items-center">
            <span className="inline-block w-4 h-0.5 bg-[#01BCD6] mr-2"></span>
            正常情况下每年现金流盈余
          </p>
          <p className="flex items-center">
            <span className="inline-block w-4 h-0.5 bg-[#ef4444] mr-2"></span>
            出险后每年现金流盈余/缺口
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
              <linearGradient id="normalSurplusGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#01BCD6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#01BCD6" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="riskSurplusGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="age" 
              tick={{ fontSize: 10 }}
              ticks={[28, 33, 38, 43, 48, 53, 58, 63, 68, 73, 78, 83]}
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
              domain={[-50, 50]}
              ticks={[-50, -25, 0, 25, 50]}
              axisLine={{ stroke: '#000', strokeWidth: 1 }}
              tickLine={{ stroke: '#000', strokeWidth: 1 }}
              width={26}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="2 2" />
            <Area
              type="monotone"
              dataKey="normalSurplus"
              stroke="#01BCD6"
              strokeWidth={2}
              fill="url(#normalSurplusGradient)"
              fillOpacity={0.6}
              dot={false}
              activeDot={{ r: 5, stroke: '#01BCD6', strokeWidth: 2, fill: '#ffffff' }}
            />
            <Area
              type="monotone"
              dataKey="riskSurplus"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#riskSurplusGradient)"
              fillOpacity={0.6}
              dot={false}
              activeDot={{ r: 5, stroke: '#ef4444', strokeWidth: 2, fill: '#ffffff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 详细数据展示 */}
      {selectedPoint && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2 text-sm">{selectedPoint.age}岁详细数据</h4>
          <div className="grid grid-cols-2 gap-4">
            {/* 正常情况 */}
            <div className="space-y-1">
              <h5 className="font-medium text-xs" style={{ color: '#01BCD6' }}>正常情况</h5>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>现金流入：</span>
                  <span className="font-medium">{selectedPoint.normalInflow}万元</span>
                </div>
                <div className="flex justify-between">
                  <span>现金流出：</span>
                  <span className="font-medium">{selectedPoint.normalOutflow}万元</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span>现金流盈余：</span>
                  <span className={`font-medium ${selectedPoint.normalSurplus >= 0 ? 'text-red-600' : 'text-red-600'}`} style={{ color: selectedPoint.normalSurplus >= 0 ? '#01BCD6' : '#ef4444' }}>
                    {selectedPoint.normalSurplus}万元
                  </span>
                </div>
              </div>
            </div>

            {/* 出险后情况 */}
            <div className="space-y-1">
              <h5 className="font-medium text-red-600 text-xs">出险后情况</h5>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>现金流入：</span>
                  <span className="font-medium">{selectedPoint.riskInflow}万元</span>
                </div>
                <div className="flex justify-between">
                  <span>现金流出：</span>
                  <span className="font-medium">{selectedPoint.riskOutflow}万元</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span>{selectedPoint.riskSurplus >= 0 ? '现金流盈余：' : '现金流缺口：'}</span>
                  <span className="font-medium" style={{ color: selectedPoint.riskSurplus >= 0 ? '#01BCD6' : '#ef4444' }}>
                    {selectedPoint.riskSurplus >= 0 ? selectedPoint.riskSurplus : Math.abs(selectedPoint.riskSurplus)}万元
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedPoint && (
        <div className="p-3 bg-gray-50 rounded-lg text-center text-gray-500 text-xs">
          点击图表上的任意点查看详细数据
        </div>
      )}
    </div>
  );
};