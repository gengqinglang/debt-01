
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface ExpenditureData {
  age: number;
  stage?: string; // 教育节点名称
  originalAmount: number;
  adjustedAmount: number;
  familyMembers: number;
  totalFamilyExpenditure: number;
}

interface ExpenditureComparisonChartProps {
  data: ExpenditureData[];
  title: string;
  unit: string;
  onPointClick: (data: ExpenditureData) => void;
  useEducationStages?: boolean;
}

export const ExpenditureComparisonChart: React.FC<ExpenditureComparisonChartProps> = ({
  data,
  title,
  unit,
  onPointClick,
  useEducationStages = false
}) => {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const displayLabel = useEducationStages && data.stage ? data.stage : `${label}岁`;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-800">{displayLabel}</p>
          <p className="text-sm text-blue-600">
            {`原规划: ${payload[0].value.toLocaleString()}${unit}`}
          </p>
          <p className="text-sm text-green-600">
            {`调整后: ${payload[1].value.toLocaleString()}${unit}`}
          </p>
          <p className="text-xs text-gray-500 mt-1">点击查看详情</p>
        </div>
      );
    }
    return null;
  };

  const handlePointClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const pointData = data.activePayload[0].payload;
      setActivePoint(pointData.age);
      onPointClick(pointData);
    }
  };

  return (
    <div className="w-full h-48">
      <div className="mb-2">
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-0.5 bg-blue-500"></div>
            <span className="text-gray-600">原规划</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-0.5 bg-green-500"></div>
            <span className="text-gray-600">调整后</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 35, left: -15, bottom: 5 }}
          onClick={handlePointClick}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="age" 
            type={useEducationStages ? "category" : "number"}
            scale={useEducationStages ? undefined : "linear"}
            domain={useEducationStages ? undefined : ['dataMin', 'dataMax']}
            tick={{ fontSize: 10 }}
            tickFormatter={(value, index) => {
              if (useEducationStages && data[index]?.stage) {
                return data[index].stage;
              }
              return `${value}岁`;
            }}
            allowDataOverflow={false}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="originalAmount"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, stroke: '#3B82F6', strokeWidth: 2, fill: '#ffffff' }}
          />
          <Line
            type="monotone"
            dataKey="adjustedAmount"
            stroke="#10B981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, stroke: '#10B981', strokeWidth: 2, fill: '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
