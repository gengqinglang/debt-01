import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Check, Edit, Apple, Stethoscope, Plane, GraduationCap, Home } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import AmountEditModal from '@/components/AmountEditModal';
import MultiItemEditor from './MultiItemEditor';

interface MultiItem {
  id: string;
  name: string;
  amount: number;
  marketValue: number; // 市值（万元）
}

interface RequiredLifeCardFlowProps {
  selectedSubjectLevels: {[key: string]: string};
  setSelectedSubjectLevels: (levels: {[key: string]: string}) => void;
  confirmedTabs: {[key: string]: boolean};
  setConfirmedTabs: (tabs: {[key: string]: boolean}) => void;
  customAmounts: {[key: string]: string};
  setCustomAmounts: (amounts: {[key: string]: string}) => void;
  educationStage: string;
  setEducationStage: (stage: string) => void;
  onComplete: () => void;
  onBack: () => void;
}

const RequiredLifeCardFlow: React.FC<RequiredLifeCardFlowProps> = ({
  selectedSubjectLevels,
  setSelectedSubjectLevels,
  confirmedTabs,
  setConfirmedTabs,
  customAmounts,
  setCustomAmounts,
  educationStage,
  setEducationStage,
  onComplete,
  onBack
}) => {
  const navigate = useNavigate();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<any>(null);
  
  // 多条目管理状态 - 预设数据
  const [houseItems, setHouseItems] = useState<MultiItem[]>([
    { id: '1', name: '幸福里', amount: 15000, marketValue: 280 },
    { id: '2', name: '栖海云颂', amount: 18000, marketValue: 350 }
  ]);
  const [carItems, setCarItems] = useState<MultiItem[]>([
    { id: '1', name: '丰田', amount: 12000, marketValue: 20 },
    { id: '2', name: '比亚迪', amount: 10000, marketValue: 25 }
  ]);
  
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  }, [currentCardIndex]);

  // 卡片配置，包含图标（移除旅游）
  const cardConfigs = [
    { name: '基础生活', icon: Apple, key: '基础生活规划' },
    { name: '子女教育', icon: GraduationCap, key: '子女教育规划' },
    { name: '医疗保健', icon: Stethoscope, key: '医疗保健规划' },
    { name: '养老', icon: Home, key: '养老规划' },
    { name: '养房', icon: Home, key: '养房规划' },
    { name: '养车', icon: Home, key: '养车规划' }
  ];

  const subjectOptions = {
    '基础生活规划': [
      { name: '荒野求生版', core: '泡面战神+拼夕夕常客+公交卡永动机', color: 'text-green-600', amount: '0.2', minAmount: 0.1, maxAmount: 0.5, emoji: '🏕️', bgGradient: 'from-green-50 to-emerald-50', borderColor: 'border-green-200' },
      { name: '精打细算版', core: '菜场砍价王者/外卖用券大师/优衣库年度VIP', color: 'text-blue-600', amount: '0.5', minAmount: 0.3, maxAmount: 0.8, emoji: '💰', bgGradient: 'from-blue-50 to-sky-50', borderColor: 'border-blue-200' },
      { name: '小康滋润版', core: '盒马自由+周末brunch+健身房年卡不心疼', color: 'text-orange-600', amount: '1', minAmount: 0.8, maxAmount: 1.5, emoji: '☕', bgGradient: 'from-orange-50 to-amber-50', borderColor: 'border-orange-200' },
      { name: '品质生活家', core: '有机超市随便拿/私教课约满/新款手机说换就换', color: 'text-purple-600', amount: '2', minAmount: 1.5, maxAmount: 3, emoji: '✨', bgGradient: 'from-purple-50 to-violet-50', borderColor: 'border-purple-200' },
      { name: '凡尔赛天花板', core: '米其林当食堂/爱马仕买菜包/"这季新品全包了"', color: 'text-yellow-600', amount: '5', minAmount: 4, maxAmount: 8, emoji: '👑', bgGradient: 'from-yellow-50 to-amber-50', borderColor: 'border-yellow-200' }
    ],
    '医疗保健规划': [
      { name: '基础防护', core: '社区健康管理，常备药箱，年度普检', color: 'text-green-600', amount: '0.3', minAmount: 0.2, maxAmount: 0.5, emoji: '🏥', bgGradient: 'from-green-50 to-emerald-50', borderColor: 'border-green-200' },
      { name: '全面守护', core: '百万医疗险配置，私立体检，营养补充', color: 'text-blue-600', amount: '1', minAmount: 0.8, maxAmount: 1.5, emoji: '🛡️', bgGradient: 'from-blue-50 to-sky-50', borderColor: 'border-blue-200' },
      { name: '臻选医疗', core: '专家预约通道，基因筛查，康复理疗', color: 'text-orange-600', amount: '3', minAmount: 2, maxAmount: 5, emoji: '🧬', bgGradient: 'from-orange-50 to-amber-50', borderColor: 'border-orange-200' },
      { name: '钻石服务', core: '全球二次诊疗，抗衰预防管理，私人健康管家', color: 'text-purple-600', amount: '10', minAmount: 8, maxAmount: 15, emoji: '💎', bgGradient: 'from-purple-50 to-violet-50', borderColor: 'border-purple-200' },
      { name: '生命银行', core: '细胞冷冻存储，纳米级监测，医疗专机待命', color: 'text-yellow-600', amount: '50', minAmount: 40, maxAmount: 80, emoji: '🏦', bgGradient: 'from-yellow-50 to-amber-50', borderColor: 'border-yellow-200' }
    ],
    '养老规划': [
      { name: '居家养老版', core: '子女轮流照料/社区卫生站定期检查/钟点工打扫卫生', color: 'text-green-600', amount: '2', minAmount: 1, maxAmount: 3, emoji: '🏠', bgGradient: 'from-green-50 to-emerald-50', borderColor: 'border-green-200' },
      { name: '普通养老院版', core: '公办养老院双人间/护工定时查房/医生每周巡诊', color: 'text-blue-600', amount: '5', minAmount: 3, maxAmount: 8, emoji: '🏥', bgGradient: 'from-blue-50 to-sky-50', borderColor: 'border-blue-200' },
      { name: '高端社区版', core: '私立养老社区单人套房/专业护理师24小时值班/康复理疗师一对一', color: 'text-orange-600', amount: '15', minAmount: 10, maxAmount: 20, emoji: '🏨', bgGradient: 'from-orange-50 to-amber-50', borderColor: 'border-orange-200' },
      { name: '顶级护理版', core: '五星级养老院豪华套房/医护团队贴身服务/营养师定制餐食', color: 'text-purple-600', amount: '50', minAmount: 40, maxAmount: 70, emoji: '👩‍⚕️', bgGradient: 'from-purple-50 to-violet-50', borderColor: 'border-purple-200' },
      { name: '私人定制版', core: '独栋养老别墅/私人医生常驻/专业护理团队全天候守护', color: 'text-yellow-600', amount: '200', minAmount: 150, maxAmount: 300, emoji: '🏰', bgGradient: 'from-yellow-50 to-amber-50', borderColor: 'border-yellow-200' }
    ],
    '子女教育规划': [
      { name: '基础保障型', core: '公立学费、基础教辅书、校服', color: 'text-green-600', amount: '0.5', minAmount: 0.3, maxAmount: 1, emoji: '📚', bgGradient: 'from-green-50 to-emerald-50', borderColor: 'border-green-200' },
      { name: '普惠提升型', core: '平价兴趣班（绘画/篮球）、线上课程、中档教辅', color: 'text-blue-600', amount: '2', minAmount: 1.5, maxAmount: 3, emoji: '🎨', bgGradient: 'from-blue-50 to-sky-50', borderColor: 'border-blue-200' },
      { name: '学科投资型', core: '重点学科补习（数英物）、竞赛培训、私立中学学费', color: 'text-orange-600', amount: '10', minAmount: 8, maxAmount: 15, emoji: '🧮', bgGradient: 'from-orange-50 to-amber-50', borderColor: 'border-orange-200' },
      { name: '全面发展型', core: '国际学校/双语学校、海外夏校、马术/编程等高端兴趣、留学顾问', color: 'text-purple-600', amount: '20', minAmount: 15, maxAmount: 30, emoji: '🌍', bgGradient: 'from-purple-50 to-violet-50', borderColor: 'border-purple-200' },
      { name: '资源冗余型', core: '顶级私校、1对1名师、海外升学全包、科研项目"镀金"', color: 'text-yellow-600', amount: '50', minAmount: 40, maxAmount: 80, emoji: '👑', bgGradient: 'from-yellow-50 to-amber-50', borderColor: 'border-yellow-200' }
    ],
    '养房规划': [
      { name: '标准养房开支', core: '物业费、水电费、维修费、装修更新等日常房屋维护开支', color: 'text-blue-600', amount: '1.5', minAmount: 1, maxAmount: 3, emoji: '🏠', bgGradient: 'from-blue-50 to-sky-50', borderColor: 'border-blue-200' }
    ],
    '养车规划': [
      { name: '标准养车开支', core: '保险费、保养费、油费、停车费等日常车辆维护开支', color: 'text-green-600', amount: '1.2', minAmount: 0.8, maxAmount: 2.5, emoji: '🚗', bgGradient: 'from-green-50 to-emerald-50', borderColor: 'border-green-200' }
    ]
  };

  const currentCard = cardConfigs[currentCardIndex];
  const options = subjectOptions[currentCard.key];

  const getDisplayAmount = (option: any) => {
    const key = `${currentCard.key}-${option.name}`;
    return customAmounts[key] || option.amount;
  };

  const openEditModal = (option: any) => {
    setEditingOption(option);
    setEditModalOpen(true);
  };

  const saveAmount = (newAmount: string) => {
    if (editingOption) {
      const key = `${currentCard.key}-${editingOption.name}`;
      setCustomAmounts({
        ...customAmounts,
        [key]: newAmount
      });
    }
  };

  const confirmCurrentCard = () => {
    setConfirmedTabs({
      ...confirmedTabs,
      [currentCard.name]: true
    });

    if (currentCardIndex === cardConfigs.length - 1) {
      saveRequiredLifeData();
      navigate('/expenditure-summary');
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const saveRequiredLifeData = () => {
    const breakdown: {[key: string]: number} = {};
    let totalAmount = 0;

    cardConfigs.forEach(card => {
      if (card.name === '养房') {
        // 计算养房总费用
        const totalHouseKeeping = houseItems.reduce((sum, item) => sum + item.amount, 0) * 30; // 30年
        if (totalHouseKeeping > 0) {
          breakdown[card.key] = totalHouseKeeping;
          totalAmount += totalHouseKeeping;
        }
      } else if (card.name === '养车') {
        // 计算养车总费用
        const totalCarKeeping = carItems.reduce((sum, item) => sum + item.amount, 0) * 30; // 30年
        if (totalCarKeeping > 0) {
          breakdown[card.key] = totalCarKeeping;
          totalAmount += totalCarKeeping;
        }
      } else {
        // 其他类型的计算逻辑保持不变
        const selectedLevel = selectedSubjectLevels[card.key];
        if (selectedLevel) {
          const options = subjectOptions[card.key];
          const option = options?.find(opt => opt.name === selectedLevel);
          if (option) {
            const customKey = `${card.key}-${option.name}`;
            const amount = parseFloat(customAmounts[customKey] || option.amount);
            
            let yearlyAmount = amount;
            if (card.key === '基础生活规划') {
              yearlyAmount = amount * 12;
            }
            
            let totalYears = 30;
            if (card.key === '子女教育规划') {
              totalYears = educationStage === '博士' ? 25 : educationStage === '研究生' ? 22 : 18;
            }
            
            const itemTotal = yearlyAmount * totalYears;
            breakdown[card.key] = itemTotal;
            totalAmount += itemTotal;
          }
        }
      }
    });

    const requiredLifeData = {
      totalAmount,
      breakdown,
      selectedSubjectLevels,
      customAmounts,
      educationStage,
      confirmedTabs,
      houseItems,
      carItems
    };

    console.log('Saving required life data:', requiredLifeData);
    localStorage.setItem('requiredLifeData', JSON.stringify(requiredLifeData));
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setConfirmedTabs({
        ...confirmedTabs,
        [cardConfigs[currentCardIndex].name]: false
      });
    } else {
      onBack();
    }
  };

  
  const isCurrentCardSelected = currentCard.name === '养房' ? houseItems.length > 0 : 
                               currentCard.name === '养车' ? carItems.length > 0 : 
                               selectedSubjectLevels[currentCard.key];

  return (
    <div className="flex-1 flex flex-col">
      {/* 进度指示器 */}
      <div ref={progressRef} className="px-4 py-4 bg-gradient-to-r from-[#CCE9B5]/10 to-[#B8E0A1]/10 border-b border-gray-100">
        <div className="flex items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-800">配置进度</h3>
          <span className="text-xs text-gray-600 ml-1">（{currentCardIndex + 1}/{cardConfigs.length}）</span>
        </div>
        
        <div className="mb-3">
          <div className="relative w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-[#CCE9B5] to-[#B8E0A1] h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentCardIndex + 1) / cardConfigs.length) * 100}%` }}
            />
            
            {cardConfigs.map((card, index) => {
              const isCompleted = confirmedTabs[card.name];
              const isCurrent = index === currentCardIndex;
              const position = ((index + 1) / cardConfigs.length) * 100;
              
              return (
                <div
                  key={index}
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                >
                  <div className={`w-3 h-3 rounded-full border-2 border-white flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-500' 
                      : isCurrent 
                      ? 'bg-[#CCE9B5]' 
                      : 'bg-gray-300'
                  }`}>
                    {isCompleted && (
                      <Check className="w-1.5 h-1.5 text-white" strokeWidth={3} />
                    )}
                  </div>
                  
                  <div className={`mt-1 text-xs font-medium whitespace-nowrap ${
                    isCurrent 
                      ? 'text-gray-900' 
                      : isCompleted 
                      ? 'text-green-700' 
                      : 'text-gray-500'
                  }`}>
                    {card.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 当前卡片内容 */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {currentCard.name === '养房' ? '养房支出' : currentCard.name}
            </h2>
          </div>

          {/* 教育阶段选择器 */}
          {currentCard.name === '子女教育' && (
            <div className="mb-6 p-4 bg-gradient-to-r from-[#CCE9B5]/10 to-[#B8E0A1]/10 rounded-xl border border-[#CCE9B5]/30">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">计划培养孩子到什么阶段：</h3>
              <RadioGroup value={educationStage} onValueChange={setEducationStage} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="大学" id="university" />
                  <Label htmlFor="university" className="text-sm font-medium text-gray-700">大学</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="研究生" id="graduate" />
                  <Label htmlFor="graduate" className="text-sm font-medium text-gray-700">研究生</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="博士" id="phd" />
                  <Label htmlFor="phd" className="text-sm font-medium text-gray-700">博士</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* 养房/养车多条目编辑器 */}
          {(currentCard.name === '养房' || currentCard.name === '养车') ? (
            <div className="mb-6">
              <MultiItemEditor
                title={currentCard.name === '养房' ? '房产维护费用' : '车辆维护费用'}
                itemType={currentCard.name === '养房' ? 'house' : 'car'}
                unit="年"
                defaultAmount={currentCard.name === '养房' ? 15000 : 12000}
                minAmount={currentCard.name === '养房' ? 5000 : 3000}
                maxAmount={currentCard.name === '养房' ? 50000 : 30000}
                items={currentCard.name === '养房' ? houseItems : carItems}
                onItemsChange={currentCard.name === '养房' ? setHouseItems : setCarItems}
                isPrePopulated={true}
                showInYuan={true}
              />
            </div>
          ) : (
            /* 选项列表 */
            <div className="space-y-3 mb-6">
              {options?.map((option) => {
                const isSelected = selectedSubjectLevels[currentCard.key] === option.name;
                const displayAmount = getDisplayAmount(option);
                
                return (
                  <Card 
                    key={option.name}
                    className={`p-3 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl relative overflow-hidden ${
                      isSelected 
                        ? `bg-gradient-to-br ${option.bgGradient} ${option.borderColor} shadow-xl ring-2 ring-opacity-60` 
                        : `bg-gradient-to-br ${option.bgGradient} ${option.borderColor} hover:shadow-lg border-2`
                    }`}
                    onClick={() => setSelectedSubjectLevels({
                      ...selectedSubjectLevels,
                      [currentCard.key]: option.name
                    })}
                  >
                    <div className="absolute top-1 right-1 opacity-20">
                      <span className="text-2xl">{option.emoji}</span>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-bold ${
                            isSelected ? 'text-gray-900' : 'text-gray-800'
                          }`}>
                            {option.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <div className={`text-right ${
                            isSelected ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            <div className="flex items-baseline gap-0.5">
                              <span className="text-sm font-bold">{displayAmount}</span>
                              <span className="text-xs text-gray-400 font-normal">
                                万/{currentCard.name === '基础生活' ? '人/月' : currentCard.name === '子女教育' ? '孩/年' : currentCard.name === '养老' ? '人/年' : currentCard.name === '医疗保健' ? '人/年' : currentCard.name === '养房' ? '家/年' : currentCard.name === '养车' ? '辆/年' : ''}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-6 h-6 p-0 hover:bg-white/60 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(option);
                            }}
                          >
                            <Edit className="w-2.5 h-2.5 text-gray-600" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className={`p-1.5 rounded-lg ${
                        isSelected 
                          ? 'bg-white/60 backdrop-blur-sm' 
                          : 'bg-white/40'
                      }`}>
                        <div className={`text-xs font-medium leading-relaxed ${
                          isSelected ? 'text-gray-800' : 'text-gray-700'
                        }`}>
                          {option.core}
                        </div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="absolute top-2 left-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-3">
          <Button 
            onClick={goToPreviousCard}
            className="flex-1 py-2 text-gray-700 font-bold rounded-2xl text-sm shadow-lg transform hover:scale-[1.02] transition-all duration-300 border border-gray-300 bg-white hover:bg-gray-50"
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentCardIndex === 0 ? '返回上一页' : '上一步'}
          </Button>
          
          <Button 
            onClick={confirmCurrentCard}
            disabled={!isCurrentCardSelected}
            className="flex-1 py-2 text-gray-900 font-bold rounded-2xl text-sm shadow-xl transform hover:scale-[1.02] transition-all duration-300 border-0 bg-gradient-to-r from-[#CCE9B5] to-[#B8E0A1] hover:from-[#BBE3A8] hover:to-[#A5D094] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentCardIndex === cardConfigs.length - 1 ? (
              <>
                完成配置
                <Check className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                确认选择
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 金额编辑模态框 */}
      <AmountEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={saveAmount}
        currentAmount={editingOption ? getDisplayAmount(editingOption) : ''}
        itemName={editingOption ? editingOption.name : ''}
        minAmount={editingOption ? editingOption.minAmount : 0}
        maxAmount={editingOption ? editingOption.maxAmount : 100}
        unit="万"
      />
    </div>
  );
};

export default RequiredLifeCardFlow;
