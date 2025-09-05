import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Calculator, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ShangzhuanGongjijinPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold">商贷转公积金测算</h1>
        </div>

        {/* Hero Section */}
        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-blue-900">商转公测算工具</h2>
                <p className="text-sm text-blue-700">精准评估转贷收益</p>
              </div>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              专业测算商业贷款转公积金贷款的利息节省、手续费成本，帮您判断是否值得转贷。
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="space-y-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                测算内容
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-sm">利率差异分析</p>
                  <p className="text-xs text-gray-600">计算商贷与公积金贷款的利率差异</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-sm">总利息节省</p>
                  <p className="text-xs text-gray-600">计算转贷后能节省的总利息金额</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-sm">手续费评估</p>
                  <p className="text-xs text-gray-600">评估转贷产生的各项手续费成本</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-sm">净收益计算</p>
                  <p className="text-xs text-gray-600">综合计算转贷的实际净收益</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Percent className="w-4 h-4 text-green-600" />
                适用条件
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm space-y-2">
                <p>• 有公积金贷款额度可用</p>
                <p>• 商贷利率高于公积金利率</p>
                <p>• 剩余贷款期限较长</p>
                <p>• 转贷手续费在可接受范围内</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Button 
            className="w-full" 
            onClick={() => {
              // TODO: Navigate to calculation form
              console.log('开始测算');
            }}
          >
            开始测算
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/baogao')}
          >
            返回报告
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShangzhuanGongjijinPage;