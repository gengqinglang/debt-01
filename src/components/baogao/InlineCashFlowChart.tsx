import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, ReferenceDot } from 'recharts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Home } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CashFlowData {
  age: number;
  normalInflow: number;
  normalOutflow: number;
  normalSurplus: number;
  riskInflow: number;
  riskOutflow: number;
  riskSurplus: number;
  // 现金流入明细
  salaryIncome: number;
  bonusIncome: number;
  investmentIncome: number;
  otherIncome: number;
  // 现金流出明细
  mortgagePayment: number;
  carLoanPayment: number;
  livingExpenses: number;
  educationExpenses: number;
  insuranceFees: number;
  otherExpenses: number;
}

interface InlineCashFlowChartProps {
  isExpanded: boolean;
  debtStartAge?: number;
  debtEndAge?: number;
}

export const InlineCashFlowChart: React.FC<InlineCashFlowChartProps> = ({ 
  isExpanded, 
  debtStartAge = 28, 
  debtEndAge = 48 
}) => {
  const [selectedPoint, setSelectedPoint] = useState<CashFlowData | null>(null);
  const [showHousePlan, setShowHousePlan] = useState(false);
  const [isDetailExpanded, setIsDetailExpanded] = useState(true);

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

      // 按年龄段调整现金流数据
      let riskSurplus;
      
      if (age >= 28 && age <= 38) {
        // 28-38岁：数据大于0，逐渐增长
        const progress = (age - 28) / (38 - 28); // 0到1的进度
        riskSurplus = 5 + progress * 15; // 从5万逐渐增长到20万
      } else if (age > 38 && age <= 48) {
        // 38-48岁：数据小于0，先降后升
        const progress = (age - 38) / (48 - 38); // 0到1的进度
        if (progress <= 0.5) {
          // 前半段：从0降到最低点-30万
          riskSurplus = -progress * 60; // 从0降到-30
        } else {
          // 后半段：从-30万回升到-5万
          const recoveryProgress = (progress - 0.5) / 0.5;
          riskSurplus = -30 + recoveryProgress * 25; // 从-30回升到-5
        }
      } else if (age > 48) {
        // 48岁以后：数据大于0，逐渐恢复并增长
        const yearsAfter48 = age - 48;
        if (yearsAfter48 <= 5) {
          // 前5年快速恢复：从5万增长到15万
          riskSurplus = 5 + (yearsAfter48 / 5) * 10;
        } else {
          // 5年后稳定增长
          riskSurplus = 15 + (yearsAfter48 - 5) * 0.8;
        }
      } else {
        // 兜底情况
        riskSurplus = normalSurplus * 0.9;
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

      // 生成现金流入明细
      const baseSalary = 30 + (age - 28) * 0.5;
      const baseBonus = 8 + (age - 28) * 0.2;
      const baseInvestment = 5 + (age - 28) * 0.1;
      const baseOther = 2;

      const salaryIncome = Math.round(baseSalary + Math.sin((age - 28) * 0.2) * 2);
      const bonusIncome = Math.round(baseBonus + Math.cos((age - 28) * 0.3) * 1);
      const investmentIncome = Math.round(baseInvestment + Math.sin((age - 28) * 0.4) * 0.5);
      const otherIncome = Math.round(baseOther);

      // 生成现金流出明细
      const mortgagePayment = age <= 58 ? 15 : 0; // 假设58岁还完房贷
      const carLoanPayment = age <= 33 ? 8 : 0; // 假设33岁还完车贷
      const livingExpenses = Math.round(12 + (age - 28) * 0.2);
      const educationExpenses = age >= 35 && age <= 55 ? 6 : 0; // 子女教育期间
      const insuranceFees = 3;
      const otherExpenses = Math.round(5 + (age - 28) * 0.1);

      data.push({
        age,
        normalInflow: Math.round(normalInflow),
        normalOutflow: Math.round(normalOutflow),
        normalSurplus: Math.round(normalSurplus * 10) / 10, // 保留一位小数
        riskInflow: Math.round(riskInflow),
        riskOutflow: Math.round(riskOutflow),
        riskSurplus: Math.round(riskSurplus * 10) / 10, // 保留一位小数
        // 现金流入明细
        salaryIncome,
        bonusIncome,
        investmentIncome,
        otherIncome,
        // 现金流出明细
        mortgagePayment,
        carLoanPayment,
        livingExpenses,
        educationExpenses,
        insuranceFees,
        otherExpenses,
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
      const age = label;

      const getLoanPaymentDetails = (age: number) => {
        const loanDetails: { name: string; payment: number }[] = [];
        // 栖海云颂：28-58岁
        if (age >= 28 && age <= 58) {
          loanDetails.push({ name: "栖海云颂", payment: 12.3 });
        }
        // 幸福里：28-33岁
        if (age >= 28 && age <= 33) {
          loanDetails.push({ name: "幸福里", payment: 23.6 });
        }
        // 车贷：28-31岁
        if (age >= 28 && age <= 31) {
          loanDetails.push({ name: "车贷", payment: 8.5 });
        }
        return loanDetails;
      };

      const loanDetails = getLoanPaymentDetails(age);

      const cashFlowValue = payload[0].value;
      const cashText = cashFlowValue >= 0 ? `现金流盈余：${cashFlowValue}万元` : `现金流缺口：${Math.abs(cashFlowValue)}万元`;
      const cashColor = cashFlowValue >= 0 ? "#01BCD6" : "#ef4444";

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
          <p className={"font-medium"}>{`年龄: ${label}岁`}</p>
          <p className="mb-2 font-medium" style={{ color: cashColor }}>{cashText}</p>

          {loanDetails.length > 0 ? (
            <div>
              <p className="font-medium text-sm mb-1 text-gray-700">当年贷款还款：</p>
              <div className="space-y-1">
                {loanDetails.map((loan, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="text-gray-600">{loan.name}：</span>
                    <span className="font-medium text-red-600">{loan.payment}万元</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between text-xs font-medium">
                <span>合计还款：</span>
                <span className="text-red-600">{loanDetails.reduce((s, l) => s + l.payment, 0).toFixed(1)}万元</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500">当年无贷款还款</p>
          )}
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
        <h4 className="font-medium text-gray-800 mb-2 text-sm">家庭现金流分析</h4>
        <div className="text-xs text-gray-600 space-y-1">
            <p className="flex items-center">
              <span className="inline-block w-4 h-0.5 bg-[#ef4444] mr-2"></span>
              未来每年家庭现金流盈余/缺口
            </p>
          <p className="flex items-center">
            <span className="inline-block w-4 h-2 bg-red-100 border border-red-300 mr-2"></span>
            债务期（{debtStartAge}岁-{debtEndAge}岁）
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
            {/* 偿债期蒙层 */}
            <ReferenceArea x1={debtStartAge} x2={debtEndAge} fill="rgba(239, 68, 68, 0.1)" stroke="none" />
            {/* 购房计划图标 - 50岁 */}
            <ReferenceDot 
              x={50} 
              y={cashFlowData.find(d => d.age === 50)?.riskSurplus || 0}
              r={8}
              fill="#f59e0b"
              stroke="#fff"
              strokeWidth={2}
              onClick={() => setShowHousePlan(true)}
              style={{ cursor: 'pointer' }}
            />
            {/* 债务期背景区域 */}
            <ReferenceLine x={debtStartAge} stroke="#fca5a5" strokeDasharray="3 3" strokeWidth={1} />
            <ReferenceLine x={debtEndAge} stroke="#fca5a5" strokeDasharray="3 3" strokeWidth={1} />
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
        <Collapsible open={isDetailExpanded} onOpenChange={setIsDetailExpanded}>
          <div className="p-3 bg-gray-25 rounded-lg border border-gray-200" style={{ backgroundColor: 'rgba(249, 250, 251, 0.8)' }}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-800 text-sm">{selectedPoint.age}岁详细数据</h4>
                <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${isDetailExpanded ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="mt-3 space-y-4">
                {/* 现金流汇总 */}
                <div className="grid grid-cols-3 gap-4 pb-3 border-b border-gray-200">
                  <div className="text-center">
                    <div className="text-lg font-bold mb-1" style={{ color: '#01BCD6' }}>
                      {selectedPoint.riskInflow}万元
                    </div>
                    <p className="text-xs text-muted-foreground">现金流入</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600 mb-1">
                      {selectedPoint.riskOutflow}万元
                    </div>
                    <p className="text-xs text-muted-foreground">现金流出</p>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold mb-1" style={{ color: selectedPoint.riskSurplus >= 0 ? '#01BCD6' : '#ef4444' }}>
                      {selectedPoint.riskSurplus >= 0 ? selectedPoint.riskSurplus : Math.abs(selectedPoint.riskSurplus)}万元
                    </div>
                    <p className="text-xs text-muted-foreground">{selectedPoint.riskSurplus >= 0 ? '现金盈余' : '现金缺口'}</p>
                  </div>
                </div>

                {/* 现金流入明细 */}
                <div>
                  <h5 className="font-medium text-sm mb-2" style={{ color: '#01BCD6' }}>现金流入明细</h5>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>• 工资收入：</span>
                      <span className="font-medium">{selectedPoint.salaryIncome}万元</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 奖金收入：</span>
                      <span className="font-medium">{selectedPoint.bonusIncome}万元</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 投资收入：</span>
                      <span className="font-medium">{selectedPoint.investmentIncome}万元</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 其他收入：</span>
                      <span className="font-medium">{selectedPoint.otherIncome}万元</span>
                    </div>
                  </div>
                </div>

                {/* 现金流出明细 */}
                <div>
                  <h5 className="font-medium text-red-600 text-sm mb-2">现金流出明细</h5>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>• 房贷还款：</span>
                      <span className="font-medium">{selectedPoint.mortgagePayment}万元</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 车贷还款：</span>
                      <span className="font-medium">{selectedPoint.carLoanPayment}万元</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 生活支出：</span>
                      <span className="font-medium">{selectedPoint.livingExpenses}万元</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 教育支出：</span>
                      <span className="font-medium">{selectedPoint.educationExpenses}万元</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 保险费用：</span>
                      <span className="font-medium">{selectedPoint.insuranceFees}万元</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• 其他支出：</span>
                      <span className="font-medium">{selectedPoint.otherExpenses}万元</span>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      )}

      {/* 重要提醒卡片 - 只在点击50岁时显示且详细数据展开时显示 */}
      {selectedPoint && selectedPoint.age === 50 && isDetailExpanded && (
        <div className="p-4 rounded-lg border border-gray-200 mb-4" style={{ backgroundColor: 'rgba(202, 244, 247, 0.2)' }}>
          <div className="flex items-start space-x-3">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-sm" style={{ color: '#01BCD6' }}>重要提醒</span>
              </div>
              <p className="text-sm leading-relaxed mb-3 text-gray-600">
                根据您的家庭规划，未来存在购房需求。经系统分析，基于您的收入能力和现金流状况，
                <span className="font-medium">全款购房将对家庭现金流造成较大压力</span>。
                我们为您制定了合理的融资方案，确保在实现购房目标的同时维持家庭财务健康。
              </p>
              
              {/* 购房信息 */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-white p-3 rounded border border-orange-100">
                  <div className="text-xs mb-1" style={{ color: '#01BCD6' }}>计划购房时间</div>
                  <div className="text-sm font-medium text-black">50岁</div>
                </div>
                <div className="bg-white p-3 rounded border border-orange-100">
                  <div className="text-xs mb-1" style={{ color: '#01BCD6' }}>预计房价</div>
                  <div className="text-sm font-medium text-black">350万元</div>
                </div>
              </div>
              
              {/* 融资信息 */}
              <div className="bg-white p-3 rounded border border-orange-100">
                <div className="text-xs mb-2" style={{ color: '#01BCD6' }}>推荐融资方案</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">首付比例：</span>
                    <span className="font-medium text-black">30% (105万元)</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">贷款金额：</span>
                    <span className="font-medium text-black">245万元</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">贷款期限：</span>
                    <span className="font-medium text-black">20年</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">预计月供：</span>
                    <span className="font-medium text-black">约1.3万元</span>
                  </div>
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



      {/* 购房计划弹窗 */}
      <Dialog open={showHousePlan} onOpenChange={setShowHousePlan}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Home className="w-5 h-5 text-orange-600" />
              <span>50岁购房计划</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">预计房价：</span>
                  <span className="font-medium text-orange-800">450万元</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">贷款金额：</span>
                  <span className="font-medium text-orange-800">315万元</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">贷款期限：</span>
                  <span className="font-medium text-orange-800">20年</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">预计月供：</span>
                  <span className="font-medium text-orange-800">约2.1万元</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 text-center">
              💡 基于当前收入水平和现金流状况制定的融资方案
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};