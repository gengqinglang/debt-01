import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HousingRecommendationContent } from './HousingRecommendationContent';
import { MarriageRecommendationContent } from './MarriageRecommendationContent';
import { BirthRecommendationContent } from './BirthRecommendationContent';
import { MedicalRecommendationContent } from './MedicalRecommendationContent';
import { EducationRecommendationContent } from './EducationRecommendationContent';
import { PensionRecommendationContent } from './PensionRecommendationContent';
import { TravelRecommendationContent } from './TravelRecommendationContent';
import { SupportRecommendationContent } from './SupportRecommendationContent';
import { FamilyAssistanceRecommendationContent } from './FamilyAssistanceRecommendationContent';
import { BasicLifeRecommendationContent } from './BasicLifeRecommendationContent';
import { EducationSecondRecommendationContent } from './EducationSecondRecommendationContent';

interface PlanningItem {
  id: number;
  name: string;
  needsAdjustment: boolean;
  category: 'housing' | 'marriage' | 'birth' | 'basic-life' | 'medical' | 'education' | 'pension' | 'travel' | 'support' | 'family-assistance' | 'other' | 'reduce-budget' | 'delay-purchase' | 'cancel-purchase' | 'cancel-second-birth' | 'education-second' | 'reduce-rent' | 'delay-marriage';
  tagType: '降低' | '延迟' | '取消';
}

export const PlanningOverview: React.FC = () => {
  const [showDelayMarriageTooltip, setShowDelayMarriageTooltip] = useState(false);

  const planningItems: PlanningItem[] = [
    { id: 13, name: '降低购房预算（刚需购房）', needsAdjustment: true, category: 'reduce-budget', tagType: '降低' },
    { id: 14, name: '延迟购房（改善购房）', needsAdjustment: true, category: 'delay-purchase', tagType: '延迟' },
    { id: 15, name: '取消购房计划（投资购房）', needsAdjustment: true, category: 'cancel-purchase', tagType: '取消' },
    { id: 18, name: '降低租房支出', needsAdjustment: true, category: 'reduce-rent', tagType: '降低' },
    { id: 3, name: '降低基础生活支出', needsAdjustment: true, category: 'basic-life', tagType: '降低' },
    { id: 4, name: '降低结婚支出', needsAdjustment: true, category: 'marriage', tagType: '降低' },
    { id: 19, name: '延迟结婚支出', needsAdjustment: true, category: 'delay-marriage', tagType: '延迟' },
    { id: 5, name: '降低一胎生育支出', needsAdjustment: true, category: 'birth', tagType: '降低' },
    { id: 16, name: '取消二胎生育计划', needsAdjustment: true, category: 'cancel-second-birth', tagType: '取消' },
    { id: 6, name: '降低老大教育支出', needsAdjustment: true, category: 'education', tagType: '降低' },
    { id: 17, name: '降低老二教育支出', needsAdjustment: true, category: 'education-second', tagType: '降低' },
    { id: 7, name: '降低医疗支出', needsAdjustment: true, category: 'medical', tagType: '降低' },
    { id: 8, name: '降低养老支出', needsAdjustment: true, category: 'pension', tagType: '降低' },
    { id: 9, name: '降低旅行支出', needsAdjustment: true, category: 'travel', tagType: '降低' },
    { id: 10, name: '降低赡养支出', needsAdjustment: true, category: 'support', tagType: '降低' },
    { id: 11, name: '降低资助亲人支出', needsAdjustment: true, category: 'family-assistance', tagType: '降低' },
  ];

  return (
    <>
      <div className="space-y-4">
        {planningItems.map((item) => {
          return (
            <div
              key={item.id}
              className={`rounded-xl p-4 shadow-sm border ${
                item.needsAdjustment 
                  ? 'bg-orange-50/50 border-orange-200/50' 
                  : 'bg-[#CAF4F7]/20 border-[#CAF4F7]/30'
              }`}
            >
              <div className="flex items-center justify-between min-h-[44px] mb-3 relative">
                <h4 className="text-base font-medium text-gray-800">
                  {item.name.length === 2 ? `${item.name}规划` : item.name}
                </h4>
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  item.tagType === '降低' ? 'bg-[#CAF4F7] text-gray-800' :
                  item.tagType === '延迟' ? 'bg-orange-200 text-gray-800' :
                  'bg-red-100 text-gray-800'
                }`}>
                  {item.tagType}
                </span>
              </div>

              {/* 直接展示的详情内容 - 移除白色框，直接在橙色卡片中显示 */}
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                {item.category === 'housing' ? (
                  <HousingRecommendationContent />
                ) : item.category === 'marriage' ? (
                  <MarriageRecommendationContent />
                ) : item.category === 'birth' ? (
                  <BirthRecommendationContent />
                ) : item.category === 'basic-life' ? (
                  <BasicLifeRecommendationContent />
                ) : item.category === 'medical' ? (
                  <MedicalRecommendationContent />
                ) : item.category === 'education' ? (
                  <EducationRecommendationContent />
                ) : item.category === 'education-second' ? (
                  <EducationSecondRecommendationContent />
                ) : item.category === 'pension' ? (
                  <PensionRecommendationContent />
                ) : item.category === 'travel' ? (
                  <TravelRecommendationContent />
                ) : item.category === 'support' ? (
                  <SupportRecommendationContent />
                ) : item.category === 'family-assistance' ? (
                  <FamilyAssistanceRecommendationContent />
                ) : item.category === 'cancel-second-birth' ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-800">原计划：35岁</span>
                      <span className="text-gray-800">生育标准</span>
                      <span className="text-gray-800">30万/娃</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium text-[#01BCD6]">建议：取消二胎生育计划</span>
                    </div>
                  </div>
                ) : item.category === 'reduce-budget' ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-800">原计划：</span>
                      <span className="text-gray-800">38岁</span>
                      <span className="text-gray-800">2居室</span>
                      <span className="text-gray-800">380万</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium text-[#01BCD6]">建议：降低购房预算至320万</span>
                    </div>
                  </div>
                ) : item.category === 'delay-purchase' ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-800">原计划：</span>
                      <span className="text-gray-800">42岁</span>
                      <span className="text-gray-800">3居室</span>
                      <span className="text-gray-800">580万</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium text-[#01BCD6]">建议：延迟购房时间到48岁</span>
                    </div>
                  </div>
                ) : item.category === 'cancel-purchase' ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-800">原计划：</span>
                      <span className="text-gray-800">45岁</span>
                      <span className="text-gray-800">4居室</span>
                      <span className="text-gray-800">680万</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium text-[#01BCD6]">建议：取消购房计划</span>
                    </div>
                  </div>
                ) : item.category === 'reduce-rent' ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-800">原计划：租期32岁-39岁</span>
                      <span className="text-gray-800">原租金8000元/月</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium text-[#01BCD6]">建议：降低租房支出至6000元/月</span>
                    </div>
                  </div>
                ) : item.category === 'delay-marriage' ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-800">原计划：32岁</span>
                    </div>
                    <div className="mt-2 flex items-center">
                      <span className="font-medium text-[#01BCD6]">建议：延迟至36岁</span>
                      <button
                        onClick={() => setShowDelayMarriageTooltip(true)}
                        className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        type="button"
                      >
                        <HelpCircle className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="font-medium text-gray-800">{item.name}调整建议：</span>
                    <p className="mt-1">具体的{item.name}调整方案正在完善中...</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 延迟结婚支出说明弹窗 */}
      <Dialog open={showDelayMarriageTooltip} onOpenChange={setShowDelayMarriageTooltip}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-800">延迟结婚支出说明</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-gray-700">
            <p>此建议是延迟结婚相关支出，包括：</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>蜜月旅行费用</li>
              <li>彩礼支出</li>
              <li>婚礼仪式费用</li>
              <li>其他婚庆相关开销</li>
            </ul>
            <p className="text-orange-600 font-medium">
              注意：这并不是建议延迟结婚时间，而是合理安排结婚支出的时机。
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};