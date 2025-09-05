import React from 'react';
import { User, Heart, PiggyBank } from 'lucide-react';

interface CareerSummaryStatsProps {
  personalTotalIncome: number;
  partnerTotalIncome: number;
  combinedTotalIncome: number;
  personalProgressiveIncome: number;
  partnerProgressiveIncome: number;
  combinedProgressiveIncome: number;
  personalCompleteness: number;
  partnerCompleteness: number;
  formatToWan: (amount: number) => string;
}

const CareerSummaryStats: React.FC<CareerSummaryStatsProps> = ({
  personalTotalIncome,
  partnerTotalIncome,
  combinedTotalIncome,
  personalProgressiveIncome,
  partnerProgressiveIncome,
  combinedProgressiveIncome,
  personalCompleteness,
  partnerCompleteness,
  formatToWan
}) => {
  // Use progressive income for immediate feedback, fall back to complete calculation
  const displayPersonalIncome = personalTotalIncome > 0 ? personalTotalIncome : personalProgressiveIncome;
  const displayPartnerIncome = partnerTotalIncome > 0 ? partnerTotalIncome : partnerProgressiveIncome;
  const displayCombinedIncome = combinedTotalIncome > 0 ? combinedTotalIncome : combinedProgressiveIncome;

  // Determine if values are estimated
  const isPersonalEstimated = personalTotalIncome === 0 && personalProgressiveIncome > 0;
  const isPartnerEstimated = partnerTotalIncome === 0 && partnerProgressiveIncome > 0;
  const isCombinedEstimated = combinedTotalIncome === 0 && combinedProgressiveIncome > 0;

  // Calculate income percentages
  const personalPercentage = displayCombinedIncome > 0 ? Math.round((displayPersonalIncome / displayCombinedIncome) * 100) : 0;
  const partnerPercentage = displayCombinedIncome > 0 ? Math.round((displayPartnerIncome / displayCombinedIncome) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-2 text-center">
      <div className="bg-[#CAF4F7]/30 rounded-lg p-3 border border-[#CAF4F7]">
        <div className="mb-1 text-center">
          <div className="text-base font-bold text-[#01BCD6]">
            {displayPersonalIncome > 0 ? formatToWan(displayPersonalIncome) : '0'}万
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {displayCombinedIncome > 0 && displayPersonalIncome > 0 ? personalPercentage : 0}%
          </div>
        </div>
        <p className="text-xs text-gray-700">本人工资收入</p>
      </div>
      <div className="bg-[#CAF4F7]/30 rounded-lg p-3 border border-[#CAF4F7]">
        <div className="mb-1 text-center">
          <div className="text-base font-bold text-[#01BCD6]">
            {displayPartnerIncome > 0 ? formatToWan(displayPartnerIncome) : '0'}万
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {displayCombinedIncome > 0 && displayPartnerIncome > 0 ? partnerPercentage : 0}%
          </div>
        </div>
        <p className="text-xs text-gray-700">伴侣工资收入</p>
      </div>
      <div className="bg-[#CAF4F7]/30 rounded-lg p-3 border border-[#CAF4F7]">
        <div className="mb-1 text-center">
          <div className="text-base font-bold text-[#01BCD6]">
            {displayCombinedIncome > 0 ? formatToWan(displayCombinedIncome) : '0'}万
          </div>
          <div className="text-xs text-gray-500 mt-1">
            100%
          </div>
        </div>
        <p className="text-xs text-gray-700">总工资收入</p>
      </div>
    </div>
  );
};

export default CareerSummaryStats;