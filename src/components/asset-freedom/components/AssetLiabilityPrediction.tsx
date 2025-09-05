
import React, { useState } from 'react';
import { AssetLiabilitySummaryCards, AssetLiabilityChart, AgeTimelineSlider, YearDetails } from '../charts/ChartComponents';
import { assetLiabilityData, detailedYearlyData } from '../data/financialData';

const AssetLiabilityPrediction = () => {
  const currentData = assetLiabilityData[0];
  const finalData = assetLiabilityData[assetLiabilityData.length - 1];
  const netWorthGrowth = ((finalData.assets - finalData.liabilities) - 
                         (currentData.assets - currentData.liabilities)) / 
                         (currentData.assets - currentData.liabilities) * 100;
  
  const breakEvenYear = assetLiabilityData.find(item => item.assets > item.liabilities)?.year || '未知';
  
  const minAge = detailedYearlyData[0].age;
  const maxAge = detailedYearlyData[detailedYearlyData.length - 1].age;
  
  const [selectedAge, setSelectedAge] = useState(31);
  
  const selectedYearData = detailedYearlyData.find(item => item.age === selectedAge) || detailedYearlyData[1];
  
  const handleSliderChange = (value: number[]) => {
    setSelectedAge(value[0]);
  };
  
  return (
    <div className="pb-4">
      <AssetLiabilitySummaryCards 
        breakEvenYear={breakEvenYear}
        netWorthGrowth={netWorthGrowth}
        finalYear={finalData.year}
      />
      
      <AssetLiabilityChart data={assetLiabilityData} />
      
      <div className="p-4 rounded-xl bg-[#CAF4F7]/10 mb-0 shadow-sm border-0 mt-8">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-800">年度资产负债详情</h3>
          </div>
          
          <AgeTimelineSlider
            minAge={minAge}
            maxAge={maxAge}
            selectedAge={selectedAge}
            onAgeChange={handleSliderChange}
          />
          
          <div className="flex justify-between items-center mt-2 mb-3">
            <span className="text-sm text-gray-600">
              {selectedYearData.year !== '现在' ? selectedYearData.year + '年' : selectedYearData.year}
            </span>
            <span className="text-sm text-gray-600">
              {selectedYearData.age}岁时的财务状况
            </span>
          </div>
        </div>
        
        <YearDetails
          netWorth={selectedYearData.netWorth}
          debtRatio={selectedYearData.debtRatio}
          assets={selectedYearData.assets}
          liabilities={selectedYearData.liabilities}
          yearsSustainable={selectedYearData.yearsSustainable}
          hideYearsSustainable={true}
        />
      </div>
    </div>
  );
};

export default AssetLiabilityPrediction;
