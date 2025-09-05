import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface LongevityFlowData {
  age: number;
  year: number;
  normalInflow: number;
  normalOutflow: number;
  normalSurplus: number;
  riskInflow: number;
  riskOutflow: number;
  riskSurplus: number;
  spouseAge: number;
}

interface InlineLongevityChartProps {
  isExpanded: boolean;
}

export const InlineLongevityChart: React.FC<InlineLongevityChartProps> = ({ isExpanded }) => {
  const [selectedPoint, setSelectedPoint] = useState<LongevityFlowData | null>(null);

  // 生成从84岁到100岁的长寿风险现金流数据
  const generateLongevityFlowData = (): LongevityFlowData[] => {
    const data: LongevityFlowData[] = [];
    const startAge = 84; // 从84岁开始展示
    const deficitStartAge = 84; // 84岁开始出现缺口
    const startYear = 2079; // 84岁对应2079年
    const baseYear = startYear - startAge; // 计算出生年份基数

    for (let age = startAge; age <= 100; age++) {
      // 基础数据计算
      const yearsFromStart = age - startAge;
      const currentYear = baseYear + age; // 当前年份
      const spouseAge = age + 3; // 伴侣比本人大3岁
      
      // 添加波动效果
      const primaryWave = Math.sin((age - startAge) * 0.5) * 8; // 主要波动
      const secondaryWave = Math.cos((age - startAge) * 0.8) * 4; // 次要波动
      const randomVariation = (Math.random() - 0.5) * 6; // 随机波动
      const totalWave = primaryWave + secondaryWave + randomVariation;
      
      let riskSurplus;
      
      // 从84岁开始就是现金流缺口，逐年加大
      const yearsInDeficit = age - deficitStartAge;
      const baseDeficit = -8 - yearsInDeficit * 5; // 从-8逐渐降到更深的缺口
      riskSurplus = Math.min(-5, baseDeficit + totalWave * 0.5); // 确保至少有5万缺口

      // 计算收入和支出数据
      const baseIncome = Math.max(8, 20 - yearsFromStart * 0.8); // 收入逐年减少
      const baseExpense = 25 + yearsFromStart * 1.2; // 支出逐年增加
      
      const riskInflow = Math.max(5, baseIncome + totalWave * 0.2);
      const riskOutflow = riskInflow - riskSurplus;

      // 正常情况数据（保留原有逻辑但不显示）
      const normalInflow = riskInflow * 1.1;
      const normalOutflow = baseExpense;
      const normalSurplus = normalInflow - normalOutflow;

      data.push({
        age,
        year: currentYear,
        spouseAge,
        normalInflow: Math.round(normalInflow),
        normalOutflow: Math.round(normalOutflow),
        normalSurplus: Math.round(normalSurplus * 10) / 10,
        riskInflow: Math.round(riskInflow),
        riskOutflow: Math.round(riskOutflow),
        riskSurplus: Math.round(riskSurplus * 10) / 10,
      });
    }

    return data;
  };

  const longevityFlowData = generateLongevityFlowData();

  // 自定义X轴tick组件 - 只显示年份
  const CustomXAxisTick = (props: any) => {
    const { x, y, payload } = props;
    if (!payload) return null;
    
    const year = payload.value;
    
    return (
      <g transform={`translate(${x},${y})`}>
        {/* 只显示年份 */}
        <text 
          x={0} 
          y={0} 
          dy={16} 
          textAnchor="middle" 
          fill="#000" 
          fontSize="10"
        >
          {year}
        </text>
      </g>
    );
  };

  const handlePointClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const pointData = data.activePayload[0].payload;
      setSelectedPoint(pointData);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const isPositive = value >= 0;
      // 根据年份找到对应的数据点来获取年龄信息
      const dataPoint = longevityFlowData.find(d => d.year === label);
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`年份: ${label}年`}</p>
          {dataPoint && (
            <>
              <p className="text-sm text-gray-600">{`本人年龄: ${dataPoint.age}岁`}</p>
              <p className="text-sm text-gray-600">{`伴侣年龄: ${dataPoint.spouseAge}岁`}</p>
            </>
          )}
          <p className={isPositive ? "text-blue-600" : "text-red-600"}>
            {isPositive ? `现金流盈余: ${value}万元` : `现金流缺口: ${Math.abs(value)}万元`}
          </p>
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
        <h4 className="font-medium text-gray-800 mb-2 text-sm">长寿风险现金流预测</h4>
      </div>

      {/* 折线图 */}
      <div className="h-64 pl-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={longevityFlowData}
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
              dataKey="year" 
              tick={<CustomXAxisTick />}
              ticks={[2079, 2082, 2085, 2088, 2091, 2094, 2095]}
              axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
              tickLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
              height={30}
            />
            <YAxis 
              tick={{ 
                fontSize: 10, 
                textAnchor: 'end', 
                fill: '#000'
              }}
              tickFormatter={(value) => `${value}`}
              domain={[-80, 25]}
              ticks={[-80, -60, -40, -20, 0, 20]}
              axisLine={{ stroke: '#000', strokeWidth: 1 }}
              tickLine={{ stroke: '#000', strokeWidth: 1 }}
              width={26}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="2 2" />
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
          <h4 className="font-medium text-gray-800 mb-2 text-sm">{selectedPoint.year}年详细数据</h4>
          <div className="space-y-1">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>本人年龄：</span>
                <span className="font-medium">{selectedPoint.age}岁</span>
              </div>
              <div className="flex justify-between">
                <span>伴侣年龄：</span>
                <span className="font-medium">{selectedPoint.spouseAge}岁</span>
              </div>
              <div className="flex justify-between border-t pt-1">
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
      )}

      {!selectedPoint && (
        <div className="p-3 bg-gray-50 rounded-lg text-center text-gray-500 text-xs">
          点击图表上的任意点查看详细数据
        </div>
      )}
    </div>
  );
};