
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigationState } from '@/hooks/useNavigationState';

const ChangshouCepingPage: React.FC = () => {
  const { navigateBack } = useNavigationState();
  const [selectedAge, setSelectedAge] = useState([100]);
  const [assessmentResult, setAssessmentResult] = useState<{
    feasible: boolean;
    message: string;
  } | null>(null);

  const handleBack = () => {
    console.log('[ChangshouCeping] Navigating back');
    navigateBack();
  };

  const handleAssessment = () => {
    const age = selectedAge[0];
    console.log(`[ChangshouCeping] Assessing longevity risk for age: ${age}`);
    
    // 模拟测评逻辑
    let feasible = false;
    let message = '';
    
    if (age <= 90) {
      feasible = true;
      message = `根据您目前的资产状况和未来收支预测，您的资产可以支撑到${age}岁的生活开支。`;
    } else if (age <= 105) {
      feasible = false;
      message = `根据分析，您的资产可能无法完全支撑到${age}岁的生活开支，建议提前做好长寿风险规划。`;
    } else {
      feasible = false;
      message = `活到${age}岁对您的资产状况是巨大挑战，强烈建议通过年金保险等方式转移长寿风险。`;
    }
    
    setAssessmentResult({ feasible, message });
  };

  const handleViewBasis = () => {
    console.log('[ChangshouCeping] Viewing assessment basis - no navigation for now');
    // 暂时不做导航处理
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen">
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

        <div className="px-6 pb-6">
          {/* 页面标题 */}
          <div className="flex items-center space-x-2 mb-6 mt-4">
            <Clock className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">长寿风险测评</h1>
          </div>

          {/* 风险说明卡片 */}
          <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-50/80 to-blue-100/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-800 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>长寿风险说明</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed">
                根据您未来的收入、支出、资产负债情况分析，假设您能活到100岁，
                您的资产可能无法支撑长期的生活支出。长寿虽然是福气，
                但也意味着需要更多的资金来维持生活品质。
              </p>
            </CardContent>
          </Card>

          {/* 年龄选择卡片 */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-gray-800">选择测评年龄</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {selectedAge[0]}岁
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  请选择您希望测评的预期寿命
                </p>
              </div>
              
              <div className="px-2">
                <Slider
                  value={selectedAge}
                  onValueChange={setSelectedAge}
                  max={120}
                  min={85}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>85岁</span>
                  <span>120岁</span>
                </div>
              </div>

              <Button 
                onClick={handleAssessment}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                开始测评
              </Button>
            </CardContent>
          </Card>

          {/* 测评结果卡片 */}
          {assessmentResult && (
            <Card className={`mb-6 ${
              assessmentResult.feasible 
                ? 'border-green-200 bg-gradient-to-br from-green-50/80 to-green-100/60'
                : 'border-red-200 bg-gradient-to-br from-red-50/80 to-red-100/60'
            }`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-lg flex items-center space-x-2 ${
                  assessmentResult.feasible ? 'text-green-800' : 'text-red-800'
                }`}>
                  {assessmentResult.feasible ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  <span>测评结果</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {assessmentResult.message}
                </p>
                
                <Button 
                  onClick={handleViewBasis}
                  variant="outline"
                  className="w-full"
                >
                  查看测评依据
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangshouCepingPage;
