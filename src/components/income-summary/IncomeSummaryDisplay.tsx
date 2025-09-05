import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Home, HandHeart, ChevronDown, ChevronUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
const IncomeSummaryDisplay = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);

  // 缓存从localStorage读取的数据
  const {
    futureIncomeData,
    careerData,
    currentAssets
  } = useMemo(() => {
    const getFutureIncomeData = () => {
      try {
        const savedData = localStorage.getItem('futureIncomeData');
        return savedData ? JSON.parse(savedData) : {
          categoryData: {
            rental: [],
            pension_fund: [],
            enterprise_annuity: [],
            other: []
          },
          rentalIncome: 0,
          pensionFundIncome: 0,
          enterpriseAnnuityIncome: 0,
          otherIncome: 0,
          totalIncome: 0
        };
      } catch (error) {
        return {
          categoryData: {
            rental: [],
            pension_fund: [],
            enterprise_annuity: [],
            other: []
          },
          rentalIncome: 0,
          pensionFundIncome: 0,
          enterpriseAnnuityIncome: 0,
          otherIncome: 0,
          totalIncome: 0
        };
      }
    };
    const getCareerData = () => {
      try {
        // Read career data from SimplifiedCareerDataProvider localStorage keys
        const personalCurrentIncome = localStorage.getItem('career_personalCurrentIncome');
        const partnerCurrentIncome = localStorage.getItem('career_partnerCurrentIncome');
        const personalRetirementAge = localStorage.getItem('career_personalRetirementAge');
        const partnerRetirementAge = localStorage.getItem('career_partnerRetirementAge');
        const personalIncome = personalCurrentIncome ? JSON.parse(personalCurrentIncome) : '';
        const partnerIncome = partnerCurrentIncome ? JSON.parse(partnerCurrentIncome) : '';
        const personalRetirement = personalRetirementAge ? JSON.parse(personalRetirementAge) : '60';
        const partnerRetirement = partnerRetirementAge ? JSON.parse(partnerRetirementAge) : '60';

        // Calculate combined annual income (convert from 万元 to number)
        const personalAnnualIncome = personalIncome ? parseFloat(personalIncome) : 0;
        const partnerAnnualIncome = partnerIncome ? parseFloat(partnerIncome) : 0;
        const totalAnnualIncome = personalAnnualIncome + partnerAnnualIncome;
        return {
          personalAnnualIncome,
          partnerAnnualIncome,
          totalAnnualIncome,
          personalRetirementAge: parseInt(personalRetirement) || 60,
          partnerRetirementAge: parseInt(partnerRetirement) || 60
        };
      } catch (error) {
        return {
          personalAnnualIncome: 0,
          partnerAnnualIncome: 0,
          totalAnnualIncome: 0,
          personalRetirementAge: 60,
          partnerRetirementAge: 60
        };
      }
    };
    const getCurrentAssets = () => {
      try {
        // Read asset data from localStorage
        const assetData = localStorage.getItem('assetData');
        if (!assetData) return 0;
        const parsed = JSON.parse(assetData);
        // Sum all asset categories
        let total = 0;
        if (parsed.assets) {
          Object.values(parsed.assets).forEach((category: any) => {
            if (Array.isArray(category)) {
              total += category.reduce((sum: number, item: any) => sum + (parseFloat(item.amount) || 0), 0);
            }
          });
        }
        return total;
      } catch (error) {
        return 0;
      }
    };
    return {
      futureIncomeData: getFutureIncomeData(),
      careerData: getCareerData(),
      currentAssets: getCurrentAssets()
    };
  }, []);

  // 计算职业收入年收入
  const careerAnnualIncome = useMemo(() => {
    return careerData.totalAnnualIncome || 0;
  }, [careerData]);

  // 缓存收入项目配置
  const incomeItems = useMemo(() => [{
    key: 'personal',
    name: '本人工资收入',
    icon: HandHeart,
    amount: careerData.personalAnnualIncome,
    type: 'career'
  }, {
    key: 'partner',
    name: '伴侣工资收入',
    icon: HandHeart,
    amount: careerData.partnerAnnualIncome,
    type: 'career'
  }, {
    key: 'rental',
    name: '房租收入',
    icon: Home,
    amount: futureIncomeData.rentalIncome || 0,
    type: 'future'
  }, {
    key: 'pension_fund',
    name: '公积金',
    icon: HandHeart,
    amount: futureIncomeData.pensionFundIncome || 0,
    type: 'future'
  }, {
    key: 'enterprise_annuity',
    name: '企业年金',
    icon: HandHeart,
    amount: futureIncomeData.enterpriseAnnuityIncome || 0,
    type: 'future'
  }, {
    key: 'other',
    name: '其他收入',
    icon: HandHeart,
    amount: futureIncomeData.otherIncome || 0,
    type: 'future'
  }], [careerData, futureIncomeData]);

  // 过滤有金额的收入项目
  const activeIncomeItems = useMemo(() => {
    return incomeItems.filter(item => item.amount > 0);
  }, [incomeItems]);

  // 缓存计算的总金额
  const totalAnnualIncome = useMemo(() => {
    return activeIncomeItems.reduce((sum, item) => sum + item.amount, 0);
  }, [activeIncomeItems]);

  // 模拟数据加载过程
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 计算30岁到85岁的收入数据
  const lifetimeIncomeData = useMemo(() => {
    const data = [];
    for (let age = 30; age <= 85; age++) {
      // 基础年度收入
      let baseAmount = totalAnnualIncome;

      // 年龄相关的收入调整
      const retirementAge = Math.min(careerData.personalRetirementAge, careerData.partnerRetirementAge);
      if (age >= retirementAge) {
        // 退休后主要是被动收入
        baseAmount = (futureIncomeData.rentalIncome || 0) + (futureIncomeData.pensionFundIncome || 0) + (futureIncomeData.enterpriseAnnuityIncome || 0) + (futureIncomeData.otherIncome || 0);
      } else if (age >= 50 && age < retirementAge) {
        // 50岁到退休年龄收入稳定期
        baseAmount = baseAmount * 1.1;
      } else if (age >= 35 && age < 50) {
        // 35-50岁收入高峰期
        baseAmount = baseAmount * 1.3;
      }

      // 通胀调整（假设每年2%通胀）
      const inflationFactor = Math.pow(1.02, age - 30);
      const yearlyAmount = baseAmount * inflationFactor;
      data.push({
        age,
        amount: Math.round(yearlyAmount * 10) / 10,
        // 保留1位小数
        year: new Date().getFullYear() + (age - 30)
      });
    }
    return data;
  }, [totalAnnualIncome, futureIncomeData]);

  // 计算未来收入汇总（30年）
  const futureIncomeTotal = useMemo(() => {
    return lifetimeIncomeData.slice(0, 30).reduce((sum, item) => sum + item.amount, 0);
  }, [lifetimeIncomeData]);

  // 处理图表点击事件
  const handleChartClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const clickedData = data.activePayload[0].payload;
      setSelectedYear(clickedData.age);
      setIsDetailExpanded(true);
    }
  };

  // 自定义Tooltip组件
  const CustomTooltip = ({
    active,
    payload,
    label
  }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{`${label}岁 (${data.year}年)`}</p>
          <p className="text-sm" style={{
          color: '#01BCD6'
        }}>
            年度收入：{`${data.amount}万元`}
          </p>
          <p className="text-xs text-gray-500 mt-1">点击查看详情</p>
        </div>;
    }
    return null;
  };

  // 获取选中年份的收入详情
  const getYearDetail = (age: number) => {
    if (!age) return null;
    const yearData = lifetimeIncomeData.find(item => item.age === age);
    if (!yearData) return null;

    // 计算各项收入在该年的金额
    const yearTotal = yearData.amount;
    let itemDetails = [];
    if (age < Math.min(careerData.personalRetirementAge, careerData.partnerRetirementAge)) {
      // 退休前包含职业收入
      itemDetails = activeIncomeItems.map(item => ({
        ...item,
        yearAmount: Math.round(item.amount / totalAnnualIncome * yearTotal * 10) / 10
      }));
    } else {
      // 退休后只有被动收入
      itemDetails = activeIncomeItems.filter(item => item.type === 'future').map(item => ({
        ...item,
        yearAmount: Math.round(item.amount * Math.pow(1.02, age - 30) * 10) / 10
      }));
    }
    return {
      age,
      year: yearData.year,
      total: yearTotal,
      items: itemDetails.filter(item => item.yearAmount > 0)
    };
  };
  const IncomeItem = React.memo(({
    item,
    yearAmount
  }: {
    item: any;
    yearAmount?: number;
  }) => {
    const IconComponent = item.icon;
    return <div className="flex items-center gap-3 py-3 px-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 bg-white border" style={{
        borderColor: '#01BCD6'
      }}>
          <IconComponent className="w-4 h-4" style={{
          color: '#01BCD6'
        }} strokeWidth={1.5} />
        </div>
        
        <div className="flex-1 min-w-0 flex justify-between items-center">
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-900 mb-1">{item.name}</div>
            {item.config && <div className="text-xs text-gray-600">{item.config}</div>}
          </div>
          
          <div className="text-right flex-shrink-0 ml-3">
            <div className="text-base font-bold text-gray-900">
              {(yearAmount || item.amount).toFixed(1)}万
            </div>
          </div>
        </div>
      </div>;
  });
  if (isLoading) {
    return <div className="p-3 pb-8">
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-8 w-full" />
          <Card className="p-3">
            <Skeleton className="h-16 w-full" />
          </Card>
          <Card className="p-4">
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
          </Card>
        </div>
      </div>;
  }
  const yearDetail = selectedYear ? getYearDetail(selectedYear) : null;
  return <div className="p-3 pb-8">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* 页面标题 */}
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">请确认家庭资产实力</h1>
        </div>

        {/* 财务汇总模块 */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 bg-gradient-to-br from-[#B3EBEF]/10 to-[#8FD8DC]/10 border-[#B3EBEF]/30">
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">当年总资产</div>
              <div className="text-lg font-bold text-gray-900">
                {currentAssets.toFixed(1)}万元
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-[#B3EBEF]/10 to-[#8FD8DC]/10 border-[#B3EBEF]/30">
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">当年净资产</div>
              <div className="text-lg font-bold text-gray-900">
                {currentAssets.toFixed(1)}万元
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-[#B3EBEF]/10 to-[#8FD8DC]/10 border-[#B3EBEF]/30">
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">未来总收入</div>
              <div className="text-lg font-bold text-gray-900">
                {Math.round(futureIncomeTotal)}万元
              </div>
            </div>
          </Card>
        </div>

        {/* 收入明细模块 */}
        <Card className="p-4">
          <div className="space-y-1">
            {activeIncomeItems.map(item => <IncomeItem key={item.key} item={item} />)}
          </div>
        </Card>

        {/* 一生收入趋势图模块 */}
        <Card className="p-4">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900 mb-2">未来收入曲线</h3>
            
          </div>
          
          {/* 图表说明 */}
          <div className="p-3 bg-gray-50 rounded-lg mb-4">
            <h4 className="font-medium text-gray-800 mb-2 text-sm">收入趋势分析</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p className="text-xs text-gray-500">💡 点击图表上的任意点查看该年详细收入</p>
            </div>
          </div>
          
          <div className="h-64 pl-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lifetimeIncomeData} margin={{
              top: 10,
              right: 0,
              left: 0,
              bottom: 10
            }} onClick={handleChartClick}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#01BCD6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#01BCD6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="age" tick={{
                fontSize: 10
              }} axisLine={{
                stroke: '#e5e7eb',
                strokeWidth: 1
              }} tickLine={{
                stroke: '#e5e7eb',
                strokeWidth: 1
              }} />
                <YAxis tick={{
                fontSize: 10,
                textAnchor: 'end',
                fill: '#000'
              }} tickFormatter={value => `${value}万`} axisLine={{
                stroke: '#000',
                strokeWidth: 1
              }} tickLine={{
                stroke: '#000',
                strokeWidth: 1
              }} width={30} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="amount" stroke="#01BCD6" fill="url(#incomeGradient)" strokeWidth={2} dot={false} activeDot={{
                r: 4,
                stroke: '#01BCD6',
                strokeWidth: 2,
                fill: '#01BCD6'
              }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 年度收入详情展开区域 */}
        {yearDetail && <Collapsible open={isDetailExpanded} onOpenChange={setIsDetailExpanded}>
            <CollapsibleTrigger asChild>
              <Card className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      {yearDetail.age}岁时收入详情 ({yearDetail.year}年)
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      年度收入：{yearDetail.total}万元
                    </p>
                  </div>
                  {isDetailExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </Card>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <Card className="p-4 mt-2">
                <div className="space-y-1">
                  {yearDetail.items.map(item => <IncomeItem key={item.key} item={item} yearAmount={item.yearAmount} />)}
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">当年收入合计</span>
                    <span className="text-lg font-bold text-gray-900">
                      {yearDetail.total}万元
                    </span>
                  </div>
                </div>
              </Card>
            </CollapsibleContent>
          </Collapsible>}
      </div>
    </div>;
};
export default IncomeSummaryDisplay;