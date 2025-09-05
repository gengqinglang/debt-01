import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CashFlowData {
  age: number;
  normalInflow: number;
  normalOutflow: number;
  normalSurplus: number;
  riskInflow: number;
  riskOutflow: number;
  riskSurplus: number;
}

interface CashFlowDeficitChartProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CashFlowDeficitChart: React.FC<CashFlowDeficitChartProps> = ({ isOpen, onClose }) => {
  const [selectedPoint, setSelectedPoint] = useState<CashFlowData | null>(null);

  // 生成从28岁到85岁的现金流数据
  const generateCashFlowData = (): CashFlowData[] => {
    const data: CashFlowData[] = [];
    const riskStartAge = 28; // 风险开始年龄
    const riskDuration = 15; // 风险持续15年

    for (let age = 28; age <= 85; age++) {
      // 正常情况下的现金流
      const normalInflow = 45 + (age - 28) * 0.8; // 正常收入随年龄增长
      const normalOutflow = 35 + (age - 28) * 0.5; // 正常支出缓慢增长
      const normalSurplus = normalInflow - normalOutflow;

      // 出险后的现金流
      let riskInflow, riskOutflow, riskSurplus;
      
      if (age >= riskStartAge && age < riskStartAge + riskDuration) {
        // 风险期间：收入减少，支出增加
        riskInflow = normalInflow * 0.3; // 收入大幅减少至30%
        riskOutflow = normalOutflow + 30 + (age - riskStartAge) * 2; // 支出增加，包含治疗费用
        riskSurplus = riskInflow - riskOutflow; // 负值
      } else {
        // 风险期外：恢复正常
        riskInflow = normalInflow;
        riskOutflow = normalOutflow;
        riskSurplus = normalSurplus;
      }

      data.push({
        age,
        normalInflow: Math.round(normalInflow),
        normalOutflow: Math.round(normalOutflow),
        normalSurplus: Math.round(normalSurplus),
        riskInflow: Math.round(riskInflow),
        riskOutflow: Math.round(riskOutflow),
        riskSurplus: Math.round(riskSurplus),
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>现金流缺口详情</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 图表说明 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">图表说明</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• 蓝线：正常情况下每年的现金流盈余</p>
              <p>• 红线：出险后每年的现金流盈余</p>
              <p>• 点击图表上的点可查看详细数据</p>
            </div>
          </div>

          {/* 折线图 */}
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={cashFlowData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                onClick={handlePointClick}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="age" 
                  label={{ value: '年龄', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  label={{ value: '现金流盈余（万元）', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#000" strokeDasharray="2 2" />
                <Line 
                  type="monotone" 
                  dataKey="normalSurplus" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                  name="正常盈余"
                />
                <Line 
                  type="monotone" 
                  dataKey="riskSurplus" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
                  name="出险后盈余"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 详细数据展示 */}
          {selectedPoint && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-gray-800 mb-3">{selectedPoint.age}岁详细数据</h3>
              <div className="grid grid-cols-2 gap-6">
                {/* 正常情况 */}
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-600">正常情况</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>当年现金流入：</span>
                      <span className="font-medium">{selectedPoint.normalInflow}万元</span>
                    </div>
                    <div className="flex justify-between">
                      <span>当年现金流出：</span>
                      <span className="font-medium">{selectedPoint.normalOutflow}万元</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span>当年现金流盈余：</span>
                      <span className={`font-medium ${selectedPoint.normalSurplus >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedPoint.normalSurplus}万元
                      </span>
                    </div>
                  </div>
                </div>

                {/* 出险后情况 */}
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">出险后情况</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>当年现金流入：</span>
                      <span className="font-medium">{selectedPoint.riskInflow}万元</span>
                    </div>
                    <div className="flex justify-between">
                      <span>当年现金流出：</span>
                      <span className="font-medium">{selectedPoint.riskOutflow}万元</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span>当年现金流盈余：</span>
                      <span className={`font-medium ${selectedPoint.riskSurplus >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedPoint.riskSurplus}万元
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedPoint && (
            <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
              点击图表上的任意点查看详细数据
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};