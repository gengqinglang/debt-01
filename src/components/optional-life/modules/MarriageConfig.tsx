import React from 'react';
import SegmentedControl from '@/components/optional-life/SegmentedControl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus } from 'lucide-react';
interface MarriageConfigProps {
  marriageStandards: any[];
  selectedMarriageStandard: string;
  setSelectedMarriageStandard: (value: string) => void;
  customAmounts: {
    [key: string]: string;
  };
  onEditAmount: (option: any) => void;
  isConfirmed: boolean;
  hasMarriagePartner?: boolean | null;
  setHasMarriagePartner?: (value: boolean | null) => void;
  partnerBirthYear?: string;
  setPartnerBirthYear?: (value: string) => void;
  marriageAge?: string;
  setMarriageAge?: (value: string) => void;
  idealPartnerAge?: string;
  setIdealPartnerAge?: (value: string) => void;
}
const MarriageConfig: React.FC<MarriageConfigProps> = ({
  marriageStandards,
  selectedMarriageStandard,
  setSelectedMarriageStandard,
  customAmounts,
  onEditAmount,
  isConfirmed,
  hasMarriagePartner,
  setHasMarriagePartner,
  partnerBirthYear,
  setPartnerBirthYear,
  marriageAge,
  setMarriageAge,
  idealPartnerAge,
  setIdealPartnerAge
}) => {
  // 设置合理的默认出生年份
  React.useEffect(() => {
    if (hasMarriagePartner === true && setPartnerBirthYear && !partnerBirthYear) {
      const defaultYear = (new Date().getFullYear() - 25).toString();
      setPartnerBirthYear(defaultYear);
    }
  }, [hasMarriagePartner, setPartnerBirthYear, partnerBirthYear]);

  // 设置默认结婚年龄
  React.useEffect(() => {
    if (setMarriageAge && !marriageAge) {
      setMarriageAge('32');
    }
  }, [setMarriageAge, marriageAge]);

  // 设置默认理想结婚对象年龄
  React.useEffect(() => {
    if (setIdealPartnerAge && !idealPartnerAge) {
      setIdealPartnerAge('30');
    }
  }, [setIdealPartnerAge, idealPartnerAge]);
  return <div className="space-y-4 sm:space-y-5 md:space-y-6 animate-fade-in">
      {/* 如果有结婚对象，显示出生年份录入 */}
      {hasMarriagePartner === true && setPartnerBirthYear && <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-3">请输入结婚对象的出生年份</h3>
          <Input type="number" value={partnerBirthYear} onChange={e => setPartnerBirthYear(e.target.value)} placeholder={`例如: ${new Date().getFullYear() - 25}`} className="w-full rounded-xl border-gray-200 focus:border-[#B3EBEF] focus:ring-[#B3EBEF]/20" disabled={isConfirmed} min="1950" max="2010" />
          <p className="text-xs text-gray-500 mt-2">请输入1950-2010年之间的年份</p>
        </div>}

      {/* 解释文案 */}
      <div className="rounded-lg p-3" style={{ backgroundColor: '#CAF4F7CC' }}>
        <p className="text-sm leading-relaxed text-gray-600">
          为了帮您更准确地规划单身阶段以及成家之后的支出，我们需要了解您对结婚对象年龄和结婚时间的期望。
        </p>
      </div>

      {/* 理想结婚对象年龄设置 */}
      {setIdealPartnerAge && <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-3">结婚对象的理想年龄：</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setIdealPartnerAge(Math.max(18, parseInt(idealPartnerAge || '30') - 1).toString())} disabled={parseInt(idealPartnerAge || '30') <= 18 || isConfirmed} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B3EBEF] to-[#8FD8DC] text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center justify-center">
              <Minus className="w-4 h-4" strokeWidth={2} />
            </button>
            
            <div className="px-6 py-2 rounded-xl bg-white shadow-sm border border-gray-200 min-w-[100px] text-center cursor-text">
              <div className="flex items-baseline justify-center gap-1">
                <input type="number" value={idealPartnerAge} onChange={e => setIdealPartnerAge(e.target.value)} min={18} max={60} disabled={isConfirmed} className="text-lg font-bold text-gray-900 bg-transparent text-center w-auto outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:outline-none cursor-text" style={{
              width: `${(idealPartnerAge || '30').toString().length + 1}ch`
            }} />
                <span className="text-lg font-bold text-gray-500">岁</span>
              </div>
            </div>
            
            <button onClick={() => setIdealPartnerAge(Math.min(60, parseInt(idealPartnerAge || '30') + 1).toString())} disabled={parseInt(idealPartnerAge || '30') >= 60 || isConfirmed} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B3EBEF] to-[#8FD8DC] text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center justify-center">
              <Plus className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>}

      {/* 结婚时间设置 */}
      {setMarriageAge && <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-semibold text-gray-700 mb-3">理想的结婚时间</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setMarriageAge(Math.max(18, parseInt(marriageAge || '34') - 1).toString())} disabled={parseInt(marriageAge || '34') <= 18 || isConfirmed} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B3EBEF] to-[#8FD8DC] text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center justify-center">
              <Minus className="w-4 h-4" strokeWidth={2} />
            </button>
            
            <div className="px-6 py-2 rounded-xl bg-white shadow-sm border border-gray-200 min-w-[100px] text-center cursor-text">
              <div className="flex items-baseline justify-center gap-1">
                <input type="number" value={marriageAge} onChange={e => setMarriageAge(e.target.value)} min={18} max={60} disabled={isConfirmed} className="text-lg font-bold text-gray-900 bg-transparent text-center w-auto outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:ring-0 focus:outline-none cursor-text" style={{
              width: `${(marriageAge || '34').toString().length + 1}ch`
            }} />
                <span className="text-lg font-bold text-gray-500">岁</span>
              </div>
            </div>
            
            <button onClick={() => setMarriageAge(Math.min(60, parseInt(marriageAge || '34') + 1).toString())} disabled={parseInt(marriageAge || '34') >= 60 || isConfirmed} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#B3EBEF] to-[#8FD8DC] text-white font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center justify-center">
              <Plus className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>}

      <SegmentedControl options={marriageStandards} value={selectedMarriageStandard} onChange={setSelectedMarriageStandard} customAmounts={customAmounts} activeTab="结婚" onEditAmount={onEditAmount} isConfirmed={isConfirmed} />
    </div>;
};
export default MarriageConfig;