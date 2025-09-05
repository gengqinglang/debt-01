import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RedemptionTaskPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  // 赎回任务数据 - 近3年每年需要赎回的金额
  const redemptionTasks = [
    { age: 30, year: '2024', amount: 40000 },
    { age: 31, year: '2025', amount: 50000 },
    { age: 32, year: '2026', amount: 100000 },
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
              <FileText className="w-6 h-6 text-[#01BCD6]" />
              <h1 className="text-xl font-bold text-gray-800">资产赎回任务</h1>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              根据您的财务规划，以下是未来3年每年需要赎回的资产金额，请提前做好流动性准备。
            </p>
          </div>

          {/* 赎回任务表格 */}
          <div className="px-6">
            <Card className="border-[#CAF4F7] bg-gradient-to-br from-[#CAF4F7]/30 to-[#CAF4F7]/10">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-[#0891b2] flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>赎回计划明细</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">年龄</TableHead>
                      <TableHead className="text-center">年份</TableHead>
                      <TableHead className="text-center">需赎回金额</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {redemptionTasks.map((task) => (
                      <TableRow key={task.age}>
                        <TableCell className="text-center font-medium">
                          {task.age}岁
                        </TableCell>
                        <TableCell className="text-center">
                          {task.year}年
                        </TableCell>
                        <TableCell className="text-center font-semibold text-[#0891b2]">
                          {formatAmount(task.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* 温馨提示 */}
          <div className="px-6">
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-orange-800 mb-2">温馨提示</h3>
                <ul className="text-xs text-orange-700 space-y-1">
                  <li>• 请提前关注投资产品的到期时间，确保能够及时赎回</li>
                  <li>• 建议保持一定比例的流动性资产，以应对突发需求</li>
                  <li>• 如有疑问，请及时咨询专业理财顾问</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedemptionTaskPage;
