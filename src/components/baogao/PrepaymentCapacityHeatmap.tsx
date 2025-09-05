import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface HeatmapData {
  year: number;
  age: number;
  surplus: number;
  intensity: number; // 0-4 强度级别
}

interface PrepaymentCapacityHeatmapProps {
  onCellClick?: (data: HeatmapData) => void;
}

const PrepaymentCapacityHeatmap: React.FC<PrepaymentCapacityHeatmapProps> = ({ onCellClick }) => {
  // 生成热力图数据
  const generateHeatmapData = (): HeatmapData[] => {
    const data: HeatmapData[] = [];
    const startAge = 30;
    const endAge = 85;
    const yearsCount = endAge - startAge + 1;
    
    for (let i = 0; i < yearsCount; i++) {
      const age = startAge + i;
      const year = 2024 + i;
      
      // 模拟结余数据，考虑职业发展和支出变化
      let baseSurplus = 15; // 基础结余
      
      // 职业发展期（30-45岁）：结余逐步增加
      if (age <= 45) {
        baseSurplus += (age - 30) * 1.2;
      }
      // 职业高峰期（45-55岁）：结余最高
      else if (age <= 55) {
        baseSurplus += 18 + (age - 45) * 0.8;
      }
      // 职业后期（55-65岁）：结余逐步减少
      else if (age <= 65) {
        baseSurplus += 26 - (age - 55) * 1.5;
      }
      // 退休期（65+）：结余较低
      else {
        baseSurplus = 8 - (age - 65) * 0.3;
      }
      
      // 添加一些随机波动
      const randomFactor = (Math.sin(i * 0.3) + Math.cos(i * 0.5)) * 3;
      const surplus = Math.max(0, baseSurplus + randomFactor);
      
      // 计算强度级别 (0-4)
      let intensity = 0;
      if (surplus >= 35) intensity = 4;
      else if (surplus >= 25) intensity = 3;
      else if (surplus >= 15) intensity = 2;
      else if (surplus >= 8) intensity = 1;
      
      data.push({
        year,
        age,
        surplus: Math.round(surplus * 10) / 10,
        intensity
      });
    }
    
    return data;
  };

  const heatmapData = generateHeatmapData();
  
  // 获取颜色强度
  const getColorIntensity = (intensity: number): string => {
    if (intensity === 0) return 'bg-white border-gray-200';
    
    if (intensity <= 1) return 'bg-[#CAF4F7]/20 border-[#CAF4F7]/30';
    if (intensity <= 2) return 'bg-[#CAF4F7]/40 border-[#CAF4F7]/50';
    if (intensity <= 3) return 'bg-[#CAF4F7]/60 border-[#CAF4F7]/70';
    if (intensity <= 4) return 'bg-[#CAF4F7]/80 border-[#CAF4F7]/90';
    return 'bg-[#4A90A4] border-[#4A90A4]';
  };

  // 将数据按行排列
  const cols = 12; // 每行12个格子
  const heatmapRows: HeatmapData[][] = [];
  for (let i = 0; i < heatmapData.length; i += cols) {
    heatmapRows.push(heatmapData.slice(i, i + cols));
  }

  // 处理格子点击
  const handleCellClick = (data: HeatmapData) => {
    onCellClick?.(data);
  };

  // 渲染单个热力图单元格
  const renderCellWithAgeLabel = (data: HeatmapData, isFirst: boolean = false, isLast: boolean = false) => {
    const colorIntensity = getColorIntensity(data.intensity);
    
    return (
      <div
        key={data.age}
        className={`
          w-7 h-7 border cursor-pointer transition-all duration-200 hover:scale-110 relative flex items-center justify-center
          ${colorIntensity}
        `}
        onClick={() => handleCellClick(data)}
        title={`${data.age}岁: ${data.surplus}万元`}
      >
        {isFirst && (
          <span className="text-xs text-gray-800 font-bold z-10">30</span>
        )}
        {isLast && (
          <span className="text-xs text-gray-800 font-bold z-10">85</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 图例样式 */}
      <div className="flex items-center space-x-2 text-xs text-gray-600 mb-4">
        <span>金额:</span>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-white border border-gray-200"></div>
          <span>0万</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-[#CAF4F7]/40"></div>
          <span>较少</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-[#4A90A4]"></div>
          <span>较多</span>
        </div>
      </div>

      {/* 热力图网格容器样式 */}
      <div className="space-y-1 mb-4 flex flex-col items-center">
        {heatmapRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex space-x-1">
            {row.map((data, cellIndex) => {
              const isFirst = rowIndex === 0 && cellIndex === 0;
              const isLast = rowIndex === heatmapRows.length - 1 && cellIndex === row.length - 1;
              return renderCellWithAgeLabel(data, isFirst, isLast);
            })}
            {/* 为不完整的行添加占位格子 */}
            {row.length < cols && Array.from({ length: cols - row.length }).map((_, index) => (
              <div key={`empty-${rowIndex}-${index}`} className="w-7 h-7 opacity-0" />
            ))}
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        点击任意格子查看该年结余详情
      </p>
    </div>
  );
};

export default PrepaymentCapacityHeatmap;