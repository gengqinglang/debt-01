import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Target, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SavingsTaskPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  // 存钱任务数据 - 近3年每年需要存钱的金额和投资期限
  const savingsTasks = [
    { 
      age: 30, 
      year: '2024', 
      totalAmount: 100000,
      plans: [
        { amount: 30000, useAge: 45, duration: 15 },
        { amount: 40000, useAge: 50, duration: 20 },
        { amount: 30000, useAge: 55, duration: 25 }
      ]
    },
    { 
      age: 31, 
      year: '2025', 
      totalAmount: 120000,
      plans: [
        { amount: 40000, useAge: 46, duration: 15 },
        { amount: 50000, useAge: 51, duration: 20 },
        { amount: 30000, useAge: 56, duration: 25 }
      ]
    },
    { 
      age: 32, 
      year: '2026', 
      totalAmount: 150000,
      plans: [
        { amount: 50000, useAge: 47, duration: 15 },
        { amount: 60000, useAge: 52, duration: 20 },
        { amount: 40000, useAge: 57, duration: 25 }
      ]
    },
  ];

  const formatAmount = (amount: number) => {
    return (amount / 10000).toFixed(0) + '万';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen">
        <div className="space-y-4">
          {/* 返回按钮 */}
          <div className="px-6 pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-0 h-auto text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </div>

          {/* 页面标题 */}
          <div className="px-6">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-6 h-6 text-[#01BCD6]" />
              <h1 className="text-xl font-bold text-gray-800">存钱任务</h1>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              根据您的财务规划，以下是未来3年每年需要储蓄的金额及相应的期限安排。
            </p>
          </div>

          {/* 存钱任务详情 */}
          <div className="px-6 space-y-4">
            {savingsTasks.map((task) => (
              <Card key={task.age} className="border-[#CAF4F7] bg-gradient-to-br from-[#CAF4F7]/30 to-[#CAF4F7]/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-[#0891b2] flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>{task.age}岁 ({task.year}年)</span>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold">总计 {formatAmount(task.totalAmount)}</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {task.plans.map((plan, index) => (
                      <div key={index} className="p-3 bg-white/60 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-[#B3EBEF] rounded-full"></div>
                            <span className="text-sm text-gray-700">{formatAmount(plan.amount)}</span>
                          </div>
                          <span className="text-sm text-gray-600">{plan.useAge}岁用</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 温馨提示 */}
          <div className="px-6">
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-orange-800 mb-2 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>储蓄建议</span>
                </h3>
                <ul className="text-xs text-orange-700 space-y-1">
                  <li>• 可根据不同期限选择合适的储蓄产品</li>
                  <li>• 建议每月定期储蓄，养成良好的理财习惯</li>
                  <li>• 如需调整计划，请及时咨询专业理财顾问</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsTaskPage;
