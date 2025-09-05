import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RiskAssessmentFinancialGrid } from '@/components/asset-freedom/components/RiskAssessmentFinancialGrid';
import { CriticalIllnessRiskCard } from '@/components/asset-freedom/components/CriticalIllnessRiskCard';

interface RiskSelection {
  who: string;
  age: string;
  type: string;
}

const RiskAssessmentProcessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [riskSelection, setRiskSelection] = useState<RiskSelection>({
    who: '',
    age: '',
    type: ''
  });
  const [showResults, setShowResults] = useState(false);

  const handleBack = () => {
    const { fromRisk, returnToRiskDetail, returnPath, activeTab, pageMode } = location.state || {};
    
    if (returnPath && activeTab && pageMode) {
      navigate(returnPath, {
        state: {
          activeTab,
          pageMode
        }
      });
    } else if (returnToRiskDetail && fromRisk) {
      navigate(`/risk-detail/${fromRisk}`);
    } else {
      navigate(-1);
    }
  };

  const handleAssessment = () => {
    setShowResults(true);
  };

  const getRiskLevel = () => {
    // 根据选择条件返回风险等级
    if (riskSelection.who === '本人' && riskSelection.type.includes('失能')) {
      return 'high';
    }
    if (riskSelection.type.includes('康复')) {
      return 'none';
    }
    return 'moderate';
  };

  const getRiskText = () => {
    const level = getRiskLevel();
    switch (level) {
      case 'high':
        return '有风险';
      case 'moderate':
        return '无风险，但保障方式有优化空间';
      case 'none':
        return '无风险';
      default:
        return '无风险';
    }
  };

  const getRiskDescription = () => {
    const level = getRiskLevel();
    switch (level) {
      case 'high':
        return '一旦您不幸发生风险，家庭财务将面临严重危机——所有资产都难以维持正常生活，甚至可能出现负债。建议尽早配置保险，为家庭筑起财务安全网。';
      case 'moderate':
        return '一旦发生风险，虽然家庭总资产足够维持生活，但会面临资金周转困难，可能需要卖房变现才能度过难关。建议适当配置保险，避免被迫变卖资产。';
      case 'none':
        return '一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。';
      default:
        return '一旦发生风险，家庭财务状况稳定，不会出现现金流缺口。';
    }
  };

  const getDeficitAmount = () => {
    const level = getRiskLevel();
    const age = parseInt(riskSelection.age) || 30;
    
    switch (level) {
      case 'high':
        // 高风险情况：根据年龄计算缺口金额
        if (age <= 35) return '1200';
        if (age <= 45) return '800';
        if (age <= 55) return '600';
        return '400';
      case 'moderate':
        // 中等风险情况
        if (age <= 35) return '300';
        if (age <= 45) return '200';
        return '150';
      case 'none':
        return '0';
      default:
        return '0';
    }
  };

  const getDeficitYears = () => {
    const level = getRiskLevel();
    const type = riskSelection.type;
    
    switch (level) {
      case 'high':
        // 失能类风险影响时间更长
        if (type.includes('失能')) return '15';
        if (type.includes('死亡')) return '8';
        return '5';
      case 'moderate':
        if (type.includes('失能')) return '5';
        if (type.includes('死亡')) return '3';
        return '2';
      case 'none':
        return '0';
      default:
        return '0';
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#B3EBEF]/15 via-[#CCE9B5]/10 to-[#FFEA96]/15">
      <div className="w-full">
        <div className="flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
          <button onClick={handleBack} className="p-2" aria-label="返回">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">重疾/意外风险测评</h1>
          <div className="w-10 h-10"></div>
        </div>

        <div className="p-4 space-y-6 pb-8">
          {/* 重疾/意外风险测评结果展示 */}
          <div className="bg-white rounded-lg p-4">
            <CriticalIllnessRiskCard pageMode="member-balanced" expandedMode={true} />
          </div>

          {/* 自定义风险测评 */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">自定义风险测评</h2>
              <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: '#CAF4F7' + '4D' }}>
                <p className="text-sm font-medium" style={{ color: '#01BCD6' }}>
                  💡 想了解特定情况下的风险影响？选择具体的出险人、年龄和风险类型，立即获得精准的财务影响分析！
                </p>
              </div>
              
              <div className="space-y-4">
                {/* 谁出险 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">谁出险</label>
                  <Select value={riskSelection.who} onValueChange={(value) => setRiskSelection({...riskSelection, who: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="本人">本人</SelectItem>
                      <SelectItem value="伴侣">伴侣</SelectItem>
                      <SelectItem value="老大">老大</SelectItem>
                      <SelectItem value="老二">老二</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 出险时间 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">出险时间</label>
                  <Select value={riskSelection.age} onValueChange={(value) => setRiskSelection({...riskSelection, age: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择年龄" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 50}, (_, i) => 30 + i).map(age => (
                        <SelectItem key={age} value={age.toString()}>{age}岁</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 类型 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">类型</label>
                  <Select value={riskSelection.type} onValueChange={(value) => setRiskSelection({...riskSelection, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="请选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="重疾失能">重疾失能</SelectItem>
                      <SelectItem value="重疾死亡">重疾死亡</SelectItem>
                      <SelectItem value="重疾康复">重疾康复</SelectItem>
                      <SelectItem value="意外失能">意外失能</SelectItem>
                      <SelectItem value="意外死亡">意外死亡</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleAssessment}
                  className="w-full mt-6"
                  disabled={!riskSelection.who || !riskSelection.age || !riskSelection.type}
                >
                  查看自定义测评结果
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 风险测评结果 */}
          {showResults && (
            <>
              <Card>
                <CardContent className="p-4">
                  <h2 className="text-base font-semibold text-gray-800 mb-4">测评结果</h2>
                  
                  {/* 风险等级 */}
                  <div className="mb-4">
                    <div className="bg-[#FF7F7F]/20 text-gray-700 border border-[#FF7F7F]/20 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                      有风险，处置实物资产可解决现金流缺口
                    </div>
                  </div>

                  {/* 风险描述文案 */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      经过系统测评，一旦发生所选风险事件，家庭财务将面临严重冲击。建议您及时完善风险保障，通过合理的保险配置来转移风险，确保家庭在面临突发情况时仍能维持正常生活。
                    </p>
                  </div>

                  {/* 财务影响分析 */}
                  <div className="mt-6">
                    <h3 className="text-base font-semibold text-gray-800 mb-4">财务影响分析</h3>
                    
                    {/* 风险影响汇总数据 */}
                    <div className="mb-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <div className="text-sm text-gray-600 mb-2">风险导致现金流缺口</div>
                        <div className="flex items-center justify-center gap-6">
                          <div className="text-xl font-bold text-red-600">{getDeficitAmount()}万</div>
                          <div className="text-xl font-bold text-orange-600">{getDeficitYears()}年</div>
                        </div>
                      </div>
                    </div>
                    <RiskAssessmentFinancialGrid 
                      riskSelection={riskSelection}
                      riskLevel={getRiskLevel()}
                    />
                  </div>

                </CardContent>
              </Card>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentProcessPage;