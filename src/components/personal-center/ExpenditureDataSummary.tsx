
import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Home, Apple, Stethoscope, Plane, GraduationCap, Heart, Baby, Car, HandHeart, ChevronDown, ChevronUp } from 'lucide-react';

const ExpenditureDataSummary = () => {
  const [showBreakdown, setShowBreakdown] = useState(false);

  // 配置详情描述映射
  const configDescriptions = useMemo(() => ({
    // 基础生活规划
    '经济实用版': '满足基本生活需求，注重性价比',
    '小康滋润版': '舒适生活品质，适度享受',
    '品质生活版': '高品质生活体验，注重细节',
    
    // 医疗保健规划
    '基础保障': '基本医疗保险，应急保障',
    '全面守护': '全面医疗保障，预防为主',
    '至尊呵护': '顶级医疗服务，全方位健康管理',
    
    // 旅游规划
    '经济出行版': '国内游为主，经济实惠',
    '人间清醒版': '国内外平衡，性价比出游',
    '诗和远方版': '高端旅游体验，享受生活',
    
    // 子女教育规划
    '公立教育型': '公立学校教育，基础素质培养',
    '学科投资型': '重点学科补习，提升学习成绩',
    '全面发展型': '综合素质培养，多元化教育',
    
    // 养老规划
    '基础养老版': '基本生活保障，简朴养老',
    '舒适体验版': '舒适养老生活，适度享受',
    '尊享生活版': '高端养老服务，品质生活',

    // 可选大事档位描述
    '轻简甜蜜版': '精致登记照+亲友小宴+蜜月周边游',
    '温馨记忆版': '主题婚纱拍摄+三星宴请+轻奢对戒',
    '悦己臻选版': '旅拍婚纱照+设计师礼服+珠宝纪念',
    '梦幻绽放版': '海外婚礼+高定主纱+定制婚宴',
    '名流盛典版': '明星策划团队+私人海岛仪式',

    '简约温馨版': '公立全流程 家人月子 基础育儿',
    '精算优选版': '私立产检 月嫂助力 早教启蒙',
    '品质护航版': '高端产检套餐 LDR产房 月子会所',
    '尊享定制版': '海外胎教 明星医院 蒙氏早教',
    '星际臻享版': '顶尖产科团队 科技分娩 医护月子',

    '基础关怀版': '定期探望+基础生活费+社区医疗',
    '舒心照料版': '专属营养餐+家庭医生+适老改造',
    '品质陪伴版': '旅居疗养+健康管家+文娱课程',
    '尊享颐养版': '高端养老社区+专属护理+全球疗养',
    '殿堂级守护版': '私人医疗团队+抗衰管理+环球旅居'
  }), []);

  // 读取支出数据
  const { requiredLifeData, optionalLifeData } = useMemo(() => {
    const getRequiredLifeData = () => {
      try {
        const savedData = localStorage.getItem('requiredLifeData');
        return savedData ? JSON.parse(savedData) : { totalAmount: 0, breakdown: {}, selectedSubjectLevels: {} };
      } catch (error) {
        return { totalAmount: 0, breakdown: {}, selectedSubjectLevels: {} };
      }
    };

    const getOptionalLifeData = () => {
      try {
        const savedData = localStorage.getItem('optionalLifeData');
        return savedData ? JSON.parse(savedData) : { totalAmount: 0, breakdown: {}, selectedModules: [], detailedConfigs: {} };
      } catch (error) {
        return { totalAmount: 0, breakdown: {}, selectedModules: [], detailedConfigs: {} };
      }
    };

    return {
      requiredLifeData: getRequiredLifeData(),
      optionalLifeData: getOptionalLifeData()
    };
  }, []);

  // 计算总金额
  const totalAmount = useMemo(() => {
    return (requiredLifeData.totalAmount || 0) + (optionalLifeData.totalAmount || 0);
  }, [requiredLifeData.totalAmount, optionalLifeData.totalAmount]);

  // 构建人生必须大事配置
  const requiredItems = useMemo(() => [
    { 
      key: '基础生活规划', 
      name: '基础生活', 
      icon: Apple, 
      amount: requiredLifeData.breakdown?.['基础生活规划'] || 0,
      config: requiredLifeData.selectedSubjectLevels?.['基础生活规划'],
      type: 'required'
    },
    { 
      key: '医疗保健规划', 
      name: '医疗保健', 
      icon: Stethoscope, 
      amount: requiredLifeData.breakdown?.['医疗保健规划'] || 0,
      config: requiredLifeData.selectedSubjectLevels?.['医疗保健规划'],
      type: 'required'
    },
    { 
      key: '旅游规划', 
      name: '旅游', 
      icon: Plane, 
      amount: requiredLifeData.breakdown?.['旅游规划'] || 0,
      config: requiredLifeData.selectedSubjectLevels?.['旅游规划'],
      type: 'required'
    },
    { 
      key: '子女教育规划', 
      name: '子女教育', 
      icon: GraduationCap, 
      amount: requiredLifeData.breakdown?.['子女教育规划'] || 0,
      config: requiredLifeData.selectedSubjectLevels?.['子女教育规划'],
      type: 'required'
    },
    { 
      key: '养老规划', 
      name: '养老', 
      icon: Home, 
      amount: requiredLifeData.breakdown?.['养老规划'] || 0,
      config: requiredLifeData.selectedSubjectLevels?.['养老规划'],
      type: 'required'
    }
  ], [requiredLifeData.breakdown, requiredLifeData.selectedSubjectLevels]);

  // 构建人生可选大事配置
  const optionalItems = useMemo(() => {
    const breakdown = optionalLifeData.breakdown || {};
    const detailedConfigs = optionalLifeData.detailedConfigs || {};
    const selectedModules = optionalLifeData.selectedModules || [];

    const careAmount = breakdown.care || breakdown['赡养'] || detailedConfigs.care?.amount || detailedConfigs['赡养']?.amount || 0;
    const careConfig = detailedConfigs.care?.standard || detailedConfigs['赡养']?.standard;

    return [
      { 
        key: 'marriage', 
        name: '结婚', 
        icon: Heart, 
        amount: breakdown.marriage || 0,
        selected: selectedModules.includes('结婚'),
        config: detailedConfigs.marriage?.standard,
        type: 'optional'
      },
      { 
        key: 'birth', 
        name: '生娃', 
        icon: Baby, 
        amount: breakdown.birth || 0,
        selected: selectedModules.includes('生育'),
        config: detailedConfigs.birth?.standard,
        type: 'optional'
      },
      { 
        key: 'housing', 
        name: '买房', 
        icon: Home, 
        amount: breakdown.housing || 0,
        selected: selectedModules.includes('购房'),
        motives: detailedConfigs.housing?.motives || [],
        type: 'optional'
      },
      { 
        key: 'car', 
        name: '买车', 
        icon: Car, 
        amount: breakdown.car || 0,
        selected: selectedModules.includes('购车'),
        carLevels: detailedConfigs.car?.levels || [],
        type: 'optional'
      },
      { 
        key: 'care', 
        name: '赡养', 
        icon: HandHeart, 
        amount: careAmount,
        selected: selectedModules.includes('赡养'),
        config: careConfig,
        type: 'optional'
      }
    ];
  }, [optionalLifeData]);

  // 筛选已选择的可选项目
  const selectedOptionalItems = useMemo(() => {
    return optionalItems.filter(item => item.selected && item.amount > 0);
  }, [optionalItems]);

  // 所有支出项目
  const allItems = useMemo(() => {
    return [...requiredItems, ...selectedOptionalItems];
  }, [requiredItems, selectedOptionalItems]);

  const getConfigDescription = (item: any) => {
    if (item.type === 'required' && item.config) {
      return configDescriptions[item.config as keyof typeof configDescriptions];
    }
    
    if (item.type === 'optional') {
      if (item.key === 'housing' && item.motives?.length > 0) {
        return item.motives.join(' / ');
      }
      if (item.key === 'car' && item.carLevels?.length > 0) {
        return item.carLevels.join(' / ');
      }
      if (item.config) {
        return configDescriptions[item.config as keyof typeof configDescriptions];
      }
    }
    
    return null;
  };

  const ExpenditureItem = ({ item }: { item: any }) => {
    const IconComponent = item.icon;
    const configDescription = getConfigDescription(item);
    
    return (
      <div className="flex items-center gap-3 py-2 px-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 bg-white border" style={{ borderColor: '#01BCD6' }}>
          <IconComponent className="w-4 h-4" style={{ color: '#01BCD6' }} strokeWidth={1.5} />
        </div>
        
        <div className="flex-1 min-w-0 flex justify-between items-center">
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-900 mb-1">{item.name}</div>
            {configDescription && (
              <div className="text-xs text-gray-600 leading-relaxed">{configDescription}</div>
            )}
          </div>
          
          <div className="text-right flex-shrink-0 ml-3">
            {item.config && (
              <div className="text-xs font-medium mb-1" style={{ color: '#01BCD6' }}>
                {item.config}
              </div>
            )}
            <div className="text-sm font-bold text-gray-900">
              {item.amount.toFixed(0)}万
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (totalAmount === 0) {
    return (
      <Card className="p-4 text-center">
        <div className="text-gray-500">
          <Apple className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">暂无支出规划数据</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* 支出合计模块 */}
      <Card className="p-3 bg-gradient-to-br from-[#CCE9B5]/10 to-[#B8E0A1]/10 border-[#CCE9B5]/30">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowBreakdown(!showBreakdown)}
        >
          <div>
            <div className="text-base font-semibold text-gray-900">
              支出合计：{totalAmount.toFixed(0)}万元
            </div>
            <div className="text-xs text-gray-600 mt-1">点击查看详细分类</div>
          </div>
          {showBreakdown ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </div>
      </Card>

      {/* 支出明细模块 */}
      {showBreakdown && (
        <Card className="p-3">
          <div className="space-y-1">
            {allItems.map((item) => (
              <ExpenditureItem key={item.key} item={item} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ExpenditureDataSummary;
