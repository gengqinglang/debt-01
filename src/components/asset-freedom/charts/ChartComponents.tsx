import React, { useState, useRef } from 'react';
import { Link } from "react-router-dom";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Settings, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, Tooltip, Legend } from 'recharts';
import { FinancialDataItem, WorstShortage } from '../data/financialData';

// 自定义工具提示组件
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border shadow-lg rounded-lg text-xs min-w-40">
        <p className="text-sm font-semibold text-gray-800 border-b pb-1 mb-2">{`${label}岁`}</p>
        {payload[0] && (
          <div className="flex justify-between gap-4 py-0.5">
            <span className="text-purple-600 font-medium">收入:</span>
            <span className="font-medium">¥{payload[0].payload.income.toLocaleString()}</span>
          </div>
        )}
        {payload[0] && payload[0].payload.beginningBalance > 0 && (
          <div className="flex justify-between gap-4 py-0.5">
            <span className="text-purple-400 font-medium">年初盈余:</span>
            <span className="font-medium">¥{payload[0].payload.beginningBalance.toLocaleString()}</span>
          </div>
        )}
        {payload[2] && (
          <div className="flex justify-between gap-4 py-0.5">
            <span className="text-blue-500 font-medium">支出:</span>
            <span className="font-medium">¥{payload[2].payload.expenses.toLocaleString()}</span>
          </div>
        )}
        <div className="border-t mt-1 pt-1 flex justify-between gap-4">
          <span className={`font-medium ${payload[0] && payload[0].payload.cashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
            现金流:
          </span>
          <span className={`font-semibold ${payload[0] && payload[0].payload.cashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
            {payload[0] && payload[0].payload.cashFlow >= 0 ? "+" : ""}
            ¥{payload[0] && payload[0].payload.cashFlow.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// 图表图例组件
export const ChartLegend = () => {
  return (
    <div className="flex justify-center gap-6 py-1">
      <div className="flex items-center">
        <span className="inline-block h-3 w-3 rounded-sm bg-[#7DD3DA] mr-2" style={{ opacity: 0.8 }}></span>
        <span className="text-[11px] text-gray-700 font-medium">收入</span>
      </div>
      <div className="flex items-center">
        <span className="inline-block h-3 w-3 rounded-sm bg-[#9EE5EA] mr-2" style={{ opacity: 0.6 }}></span>
        <span className="text-[11px] text-gray-700 font-medium">期初现金</span>
      </div>
      <div className="flex items-center">
        <span className="inline-block h-3 w-3 rounded-sm bg-gray-300 mr-2"></span>
        <span className="text-[11px] text-gray-700 font-medium">支出</span>
      </div>
    </div>
  );
};

// 汇总卡片组件
interface SummaryCardsProps {
  worstShortage: WorstShortage;
  shortageYears: number;
  totalYears: number;
  hideShortageInfo?: boolean; // 新增：是否隐藏缺口信息
}

export const SummaryCards = ({ worstShortage, shortageYears, totalYears, hideShortageInfo = false }: SummaryCardsProps) => {
  // 如果需要隐藏缺口信息且没有缺口，则不渲染组件
  if (hideShortageInfo && worstShortage.age === 'N/A') {
    return null;
  }
  
  return (
    <div className="mb-2">
      <Card className="bg-white border-gray-100 shadow-sm">
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {worstShortage.age !== 'N/A' ? (
                <>
                  未来最大现金缺口会发生在
                  <span className="text-lg font-bold mx-1" style={{ color: '#01BCD6' }}>
                    {worstShortage.age}岁
                  </span>
                  ，缺口
                  <span className="text-lg font-bold mx-1" style={{ color: '#01BCD6' }}>
                    ¥{Math.abs(worstShortage.cashFlow).toLocaleString()}
                  </span>
                  元
                </>
              ) : (
                '未来现金流状况良好，无明显缺口风险'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// 线性插值函数
const linearInterpolate = (x1: number, y1: number, x2: number, y2: number, x: number): number => {
  if (x1 === x2) return y1;
  return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
};

// 自定义收入柱子形状组件
const CustomIncomeBar = (props: any) => {
  const { payload, x, y, width, height } = props;
  
  // 检查是否有年初盈余
  const hasBeginningBalance = payload && payload.beginningBalance > 0;
  
  // 如果没有年初盈余，添加顶部圆角
  const radius = hasBeginningBalance ? 0 : 3;
  
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="url(#incomeGradient)"
      rx={0}
      ry={0}
      style={{
        borderTopLeftRadius: radius,
        borderTopRightRadius: radius,
      }}
    />
  );
};

// 财富图表组件
interface WealthChartProps {
  displayData: FinancialDataItem[];
}

export const WealthChart: React.FC<WealthChartProps> = ({ displayData }) => {
  const [ageRange, setAgeRange] = useState<[number, number]>([30, 39]); // 默认显示10年范围 30-39岁
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // 生成完整的年龄数据（30-85岁）
  const generateFullAgeData = () => {
    const fullData: FinancialDataItem[] = [];
    
    // 对原始数据按年龄排序
    const sortedData = [...displayData].sort((a, b) => a.age - b.age);
    
    for (let age = 30; age <= 85; age++) {
      const existingData = sortedData.find(item => item.age === age);
      
      if (existingData) {
        // 如果有原始数据，直接使用
        fullData.push(existingData);
      } else {
        // 如果没有原始数据，使用插值法估算
        // 找到前后最近的两个数据点
        let prevData = null;
        let nextData = null;
        
        for (let i = 0; i < sortedData.length - 1; i++) {
          if (sortedData[i].age < age && sortedData[i + 1].age > age) {
            prevData = sortedData[i];
            nextData = sortedData[i + 1];
            break;
          }
        }
        
        // 如果找不到前后数据点，使用边界数据
        if (!prevData && !nextData) {
          if (age < sortedData[0].age) {
            prevData = nextData = sortedData[0];
          } else {
            prevData = nextData = sortedData[sortedData.length - 1];
          }
        } else if (!prevData) {
          prevData = sortedData[0];
          nextData = sortedData[1];
        } else if (!nextData) {
          prevData = sortedData[sortedData.length - 2];
          nextData = sortedData[sortedData.length - 1];
        }
        
        // 使用线性插值计算各项数值
        const income = Math.round(linearInterpolate(prevData.age, prevData.income, nextData.age, nextData.income, age));
        const expenses = Math.round(linearInterpolate(prevData.age, prevData.expenses, nextData.age, nextData.expenses, age));
        const beginningBalance = Math.round(linearInterpolate(prevData.age, prevData.beginningBalance, nextData.age, nextData.beginningBalance, age));
        const totalInflow = income + beginningBalance;
        const cashFlow = totalInflow - expenses;
        
        fullData.push({
          age,
          income,
          expenses,
          beginningBalance,
          totalInflow,
          cashFlow
        });
      }
    }
    
    return fullData;
  };

  const fullAgeData = generateFullAgeData();
  
  // 根据当前年龄范围过滤数据
  const filteredData = fullAgeData.filter(
    item => item.age >= ageRange[0] && item.age <= ageRange[1]
  );

  // 处理左右滑动 - 按10年为单位滑动
  const handlePrevious = () => {
    const newStart = Math.max(30, ageRange[0] - 10);
    const newEnd = newStart + 9; // 10年范围
    setAgeRange([newStart, newEnd]);
  };

  const handleNext = () => {
    const newStart = Math.min(76, ageRange[0] + 10); // 确保不超过85岁
    const newEnd = Math.min(85, newStart + 9); // 10年范围，但不超过85岁
    setAgeRange([newStart, newEnd]);
  };

  const canGoPrevious = ageRange[0] > 30;
  const canGoNext = ageRange[1] < 85;

  return (
    <div className="flex flex-col">
      <div className="relative">
        {/* 年龄范围控制栏 - 调整为全宽布局 */}
        <div className="flex items-center justify-between mb-2 -mx-6 px-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-sm text-gray-600 font-medium">
            {ageRange[0]}岁 - {ageRange[1]}岁
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!canGoNext}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-64 w-full rounded-lg bg-white p-2 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 16, right: 10, left: 0, bottom: 10 }}
              barGap={2}
              barSize={12}
            >
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7DD3DA" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#7DD3DA" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9EE5EA" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#9EE5EA" stopOpacity={0.4} />
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d1d5db" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#d1d5db" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="age" 
                tick={{ fontSize: 10 }} 
                tickFormatter={(value) => `${value}岁`}
                axisLine={{ stroke: '#f0f0f0' }}
                tickLine={false}
                dy={8}
                interval={0}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0.1 }} />
              <Bar 
                dataKey="income" 
                stackId="a" 
                name="收入" 
                fill="url(#incomeGradient)" 
                shape={(props: any) => {
                  const { payload, x, y, width, height } = props;
                  const hasBeginningBalance = payload && payload.beginningBalance > 0;
                  
                  if (hasBeginningBalance) {
                    // 有年初盈余时，收入柱子不需要圆角
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill="url(#incomeGradient)"
                      />
                    );
                  } else {
                    // 没有年初盈余时，收入柱子需要顶部圆角
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill="url(#incomeGradient)"
                        rx={3}
                        ry={3}
                      />
                    );
                  }
                }}
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-out"
              />
              <Bar 
                dataKey="beginningBalance" 
                stackId="a" 
                name="年初盈余" 
                fill="url(#balanceGradient)"
                radius={[3, 3, 0, 0]}
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-out"
                animationBegin={200}
              />
              <Bar 
                dataKey="expenses" 
                name="支出" 
                fill="url(#expensesGradient)" 
                radius={[3, 3, 0, 0]}
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-out"
                animationBegin={400}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-2">
        <ChartLegend />
      </div>
    </div>
  );
};

// 资产负债汇总卡片
interface AssetLiabilitySummaryCardsProps {
  breakEvenYear: string;
  netWorthGrowth: number;
  finalYear: string;
}

export const AssetLiabilitySummaryCards: React.FC<AssetLiabilitySummaryCardsProps> = ({ 
  breakEvenYear, 
  netWorthGrowth,
  finalYear
}) => {
  return (
    <div className="mb-2">
      {/* 维持生活年数卡片已删除 */}
    </div>
  );
};

// 资产负债图表
interface AssetLiabilityItem {
  year: string;
  assets: number;
  liabilities: number;
  age?: number;
}

interface AssetLiabilityChartProps {
  data: AssetLiabilityItem[];
}

export const AssetLiabilityChart: React.FC<AssetLiabilityChartProps> = ({ data }) => {
  // 确保数据包含完整的年龄范围（30-85岁）
  const fullRangeData = [];
  
  for (let age = 30; age <= 85; age++) {
    const existingData = data.find(item => item.age === age);
    if (existingData) {
      fullRangeData.push(existingData);
    } else {
      // 如果缺少某个年龄的数据，使用插值或默认值
      const prevData = data.find(item => item.age && item.age < age);
      const nextData = data.find(item => item.age && item.age > age);
      
      if (prevData && nextData) {
        // 线性插值
        const ratio = (age - prevData.age!) / (nextData.age! - prevData.age!);
        fullRangeData.push({
          year: `${2024 - 30 + age}`,
          age: age,
          assets: Math.round(prevData.assets + (nextData.assets - prevData.assets) * ratio),
          liabilities: Math.round(prevData.liabilities + (nextData.liabilities - prevData.liabilities) * ratio)
        });
      } else if (prevData) {
        // 使用前一个数据点
        fullRangeData.push({
          year: `${2024 - 30 + age}`,
          age: age,
          assets: prevData.assets,
          liabilities: prevData.liabilities
        });
      } else if (nextData) {
        // 使用后一个数据点
        fullRangeData.push({
          year: `${2024 - 30 + age}`,
          age: age,
          assets: nextData.assets,
          liabilities: nextData.liabilities
        });
      } else {
        // 默认值
        fullRangeData.push({
          year: `${2024 - 30 + age}`,
          age: age,
          assets: 0,
          liabilities: 0
        });
      }
    }
  }
  
  // 过滤出有负债的数据点用于负债线条渲染
  const liabilityData = fullRangeData.filter(item => item.liabilities > 0);
  const hasLiabilities = liabilityData.length > 0;
  
  return (
    <div className="h-64 w-full bg-white mb-2 rounded-lg shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={fullRangeData}
          margin={{
            top: 16,
            right: 16,
            left: 16,
            bottom: 20,
          }}
        >
          <defs>
            {/* 优化的渐变定义 */}
            <linearGradient id="assetsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7DD3DA" stopOpacity={0.8} />
              <stop offset="50%" stopColor="#7DD3DA" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#7DD3DA" stopOpacity={0.1} />
            </linearGradient>
            {hasLiabilities && (
              <linearGradient id="liabilitiesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9ca3af" stopOpacity={0.7} />
                <stop offset="50%" stopColor="#9ca3af" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.05} />
              </linearGradient>
            )}
            
            {/* 线条渐变 - 增强视觉效果 */}
            <linearGradient id="assetsLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5CBDC6" stopOpacity={0.9} />
              <stop offset="25%" stopColor="#7DD3DA" stopOpacity={1} />
              <stop offset="75%" stopColor="#7DD3DA" stopOpacity={1} />
              <stop offset="100%" stopColor="#5CBDC6" stopOpacity={0.9} />
            </linearGradient>
            {hasLiabilities && (
              <linearGradient id="liabilitiesLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6b7280" stopOpacity={0.9} />
                <stop offset="25%" stopColor="#9ca3af" stopOpacity={1} />
                <stop offset="75%" stopColor="#9ca3af" stopOpacity={1} />
                <stop offset="100%" stopColor="#6b7280" stopOpacity={0.9} />
              </linearGradient>
            )}
            
            {/* 增强的光晕效果 */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            {/* 阴影效果 */}
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.08"/>
            </filter>
          </defs>
          
          <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#f0f0f0" strokeOpacity={0.6} />
          <XAxis 
            dataKey="age" 
            tick={{ fontSize: 10, fill: '#6b7280' }}
            domain={[30, 85]}
            type="number"
            scale="linear"
            tickFormatter={(value) => `${value}岁`}
            axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
            tickLine={false}
            dy={8}
            interval={4}
            tickCount={12}
            textAnchor="start"
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                const netWorth = data.assets - data.liabilities;
                return (
                  <div style={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(8px)',
                    padding: '12px'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      本人{label}岁
                    </div>
                    <div style={{ fontSize: '13px', color: '#374151' }}>
                      <div style={{ marginBottom: '4px' }}>
                        家庭净资产：¥{netWorth.toLocaleString()}
                      </div>
                      <div style={{ marginBottom: '4px' }}>
                        家庭总资产：¥{data.assets.toLocaleString()}
                      </div>
                      <div>
                        家庭总负债：¥{data.liabilities.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            wrapperStyle={{ 
              fontSize: '11px',
              paddingTop: '12px'
            }}
            iconType="circle"
            iconSize={10}
          />
          
          {/* 资产线 - 使用basis类型获得平滑曲线，线条变细 */}
          <Area 
            type="basis"
            dataKey="assets" 
            stroke="url(#assetsLineGradient)" 
            fill="url(#assetsGradient)"
            name="资产" 
            strokeWidth={2.5}
            activeDot={{ 
              r: 8, 
              strokeWidth: 2, 
              stroke: '#7DD3DA',
              fill: '#ffffff',
              filter: 'url(#glow)',
              style: { filter: 'drop-shadow(0 1px 3px rgba(125, 211, 218, 0.3))' }
            }}
            dot={false}
            isAnimationActive={true}
            animationDuration={2000}
            animationEasing="ease-in-out"
            filter="url(#shadow)"
            connectNulls={true}
          />
          
          {/* 负债线 - 只渲染有负债数据的部分 */}
          {hasLiabilities && (
            <Area 
              type="basis"
              dataKey="liabilities" 
              stroke="url(#liabilitiesLineGradient)" 
              fill="url(#liabilitiesGradient)"
              name="负债"
              strokeWidth={2.5}
              activeDot={{ 
                r: 8, 
                strokeWidth: 2, 
                stroke: '#9ca3af',
                fill: '#ffffff',
                filter: 'url(#glow)',
                style: { filter: 'drop-shadow(0 1px 3px rgba(156, 163, 175, 0.3))' }
              }}
              dot={false}
              isAnimationActive={true}
              animationDuration={2000}
              animationEasing="ease-in-out"
              animationBegin={300}
              filter="url(#shadow)"
              connectNulls={false}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// 年龄时间轴滑块
interface AgeTimelineSliderProps {
  minAge: number;
  maxAge: number;
  selectedAge: number;
  onAgeChange: (value: number[]) => void;
}

export const AgeTimelineSlider: React.FC<AgeTimelineSliderProps> = ({
  minAge,
  maxAge,
  selectedAge,
  onAgeChange
}) => {
  return (
    <div className="px-1">
      <Slider
        value={[selectedAge]}
        onValueChange={onAgeChange}
        max={maxAge}
        min={minAge}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-500">{minAge}岁</span>
        <span className="text-[10px] text-gray-500">{maxAge}岁</span>
      </div>
    </div>
  );
};

// 年度详情
interface YearDetailProps {
  netWorth: number;
  debtRatio: number;
  assets: number;
  liabilities: number;
  yearsSustainable: number;
  hideYearsSustainable?: boolean;
}

export const YearDetails: React.FC<YearDetailProps> = ({
  netWorth,
  debtRatio,
  assets,
  liabilities,
  yearsSustainable,
  hideYearsSustainable = false
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Card className="bg-[#CAF4F7]/30 shadow-sm border-0">
          <CardContent className="p-3">
            <p className="text-xs text-gray-600 mb-1">净资产</p>
            <p className={`text-lg font-semibold ${netWorth < 0 ? 'text-red-700' : 'text-[#4A9BA8]'}`}>
              {netWorth < 0 ? '-' : ''}¥{Math.abs(netWorth).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#CAF4F7]/30 shadow-sm border-0">
          <CardContent className="p-3">
            <p className="text-xs text-gray-600 mb-1">负债率</p>
            <p className="text-lg font-semibold text-[#4A9BA8]">
              {debtRatio}%
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Card className="bg-[#CAF4F7]/30 shadow-sm border-0">
          <CardContent className="p-3">
            <p className="text-xs text-gray-600 mb-1">总资产</p>
            <p className="text-lg font-semibold text-[#4A9BA8]">
              ¥{assets.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#CAF4F7]/30 shadow-sm border-0">
          <CardContent className="p-3">
            <p className="text-xs text-gray-600 mb-1">总负债</p>
            <p className="text-lg font-semibold text-[#4A9BA8]">
              ¥{liabilities.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {!hideYearsSustainable && (
        <div className="py-3 px-4 rounded-lg bg-[#CAF4F7]/50 border-2 border-[#4A9BA8]/30">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-600">资产支撑年数</p>
            <p className={`text-base font-semibold ${yearsSustainable === 0 ? 'text-red-700' : 'text-[#4A9BA8]'}`}>
              {yearsSustainable === 0 ? '资产不足' : `${yearsSustainable}年`}
            </p>
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            若停止收入，当前资产可维持的生活年数
          </p>
        </div>
      )}
    </>
  );
};

// 洞察文本组件 - 已删除
// InsightText component has been removed

// 现有资产支撑生活年份组件
interface AssetSustainabilityProps {
  currentAssets: number;
  annualExpenditure: number;
}

export const AssetSustainability: React.FC<AssetSustainabilityProps> = ({
  currentAssets = 1000000,
  annualExpenditure = 300000
}) => {
  const sustainableYears = currentAssets > 0 ? Math.floor(currentAssets / annualExpenditure) : 0;
  const sustainableMonths = currentAssets > 0 ? Math.floor((currentAssets % annualExpenditure) / (annualExpenditure / 12)) : 0;

  return (
    <div className="p-3">
      <Card className="bg-white border-gray-100 shadow-sm">
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-2">现有资产能够支撑生活年份</p>
              <div className="flex items-baseline justify-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">{sustainableYears}</span>
                <span className="text-sm text-gray-500">年</span>
                {sustainableMonths > 0 && (
                  <>
                    <span className="text-lg font-semibold text-blue-500">{sustainableMonths}</span>
                    <span className="text-sm text-gray-500">个月</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="pt-3 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="text-center">
                  <p className="text-gray-500 mb-1">现有资产</p>
                  <p className="font-semibold text-gray-700">¥{currentAssets.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 mb-1">年支出</p>
                  <p className="font-semibold text-gray-700">¥{annualExpenditure.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 leading-relaxed">
              基于当前资产水平和年度支出计算，如果完全停止收入来源，现有资产可维持目前生活水平的时间
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
