
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import SegmentedControl from '@/components/optional-life/SegmentedControl';
import CountSelector from '@/components/optional-life/CountSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CarConfigProps {
  carLevels: any[];
  carCount: number;
  setCarCount: (count: number) => void;
  selectedCarLevel: string;
  setSelectedCarLevel: (level: string) => void;
  carLevelConfigs: string[];
  updateCarLevel: (carIndex: number, level: string) => void;
  customAmounts: {[key: string]: string};
  onEditAmount: (option: any) => void;
  isConfirmed: boolean;
  currentCarCount: number;
  setCurrentCarCount: (count: number) => void;
  carPurchaseTimes?: string[];
  updateCarPurchaseTime: (carIndex: number, time: string) => void;
}

const CarConfig: React.FC<CarConfigProps> = ({
  carLevels,
  carCount,
  setCarCount,
  selectedCarLevel,
  setSelectedCarLevel,
  carLevelConfigs,
  updateCarLevel,
  customAmounts,
  onEditAmount,
  isConfirmed,
  currentCarCount,
  setCurrentCarCount,
  carPurchaseTimes = [],
  updateCarPurchaseTime
}) => {
  // State for managing 2-car selection flow
  const [currentCarStep, setCurrentCarStep] = useState(1);
  const [carStepConfirmed, setCarStepConfirmed] = useState<{[key: number]: boolean}>({});

  // Reset car step states when car count changes
  React.useEffect(() => {
    if (carCount === 1) {
      setCurrentCarStep(1);
      setCarStepConfirmed({});
    } else if (carCount === 2) {
      setCurrentCarStep(1);
      setCarStepConfirmed({});
    }
  }, [carCount]);

  const handleCarStepConfirm = () => {
    setCarStepConfirmed({
      ...carStepConfirmed,
      [currentCarStep]: true
    });

    if (currentCarStep === 1 && carCount === 2) {
      setCurrentCarStep(2);
    }
  };

  const canProceedToFinalConfirm = () => {
    if (carCount === 1) {
      return true; // Single car doesn't need step confirmation
    } else {
      return carStepConfirmed[1] && carStepConfirmed[2];
    }
  };

  // Generate age options from 18 to 80
  const ageOptions = Array.from({length: 63}, (_, i) => `${i + 18}岁`);

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8 animate-fade-in">
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        <CountSelector
          label="您目前有几辆车"
          value={currentCarCount}
          onChange={setCurrentCarCount}
          min={0}
          max={10}
          unit="辆"
        />
        
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-700">我认为：</h4>
          <div className="bg-gray-50 rounded-2xl p-2">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCarCount(1)}
                className={`relative p-3 sm:p-4 rounded-xl text-center transition-all duration-300 transform hover:scale-[1.01] shadow-sm ${
                  carCount === 1
                    ? 'bg-white shadow-xl shadow-black/5 text-gray-900 border-2 border-gray-100'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-transparent hover:border-gray-100 hover:shadow-md'
                }`}
              >
                <div className={`font-semibold text-sm ${carCount === 1 ? 'text-gray-900' : 'text-gray-700'}`}>
                  家庭始终需要1辆车
                </div>
                {carCount === 1 && (
                  <div className="absolute inset-0 rounded-xl ring-2 ring-[#B3EBEF]/40 ring-opacity-60 pointer-events-none"></div>
                )}
              </button>
              <button
                onClick={() => setCarCount(2)}
                className={`relative p-3 sm:p-4 rounded-xl text-center transition-all duration-300 transform hover:scale-[1.01] shadow-sm ${
                  carCount === 2
                    ? 'bg-white shadow-xl shadow-black/5 text-gray-900 border-2 border-gray-100'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-transparent hover:border-gray-100 hover:shadow-md'
                }`}
              >
                <div className={`font-semibold text-sm ${carCount === 2 ? 'text-gray-900' : 'text-gray-700'}`}>
                  家庭始终需要2辆车
                </div>
                {carCount === 2 && (
                  <div className="absolute inset-0 rounded-xl ring-2 ring-[#B3EBEF]/40 ring-opacity-60 pointer-events-none"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Purchase Time Section - Moved to top */}
        <div className="space-y-4">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-700">购车时间：</h4>
          <div className="space-y-3">
            {Array.from({ length: carCount }).map((_, carIndex) => {
              const carNames = ['第一辆', '第二辆', '第三辆'];
              const defaultAges = ['30岁', '35岁', '55岁'];
              return (
                <div key={carIndex} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{carNames[carIndex]}：</span>
                    <Select
                      value={carPurchaseTimes[carIndex] || defaultAges[carIndex]}
                      onValueChange={(value) => updateCarPurchaseTime(carIndex, value)}
                    >
                      <SelectTrigger className="w-[120px] bg-white border-gray-200 focus:ring-2 focus:ring-[#B3EBEF] focus:border-transparent">
                        <SelectValue placeholder={defaultAges[carIndex]} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50 max-h-[200px] overflow-y-auto">
                        {ageOptions.map((age) => (
                          <SelectItem key={age} value={age} className="hover:bg-gray-50 focus:bg-gray-50">
                            {age}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {carCount === 1 ? (
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700">选择车辆档次：</h4>
            <SegmentedControl
              options={carLevels}
              value={selectedCarLevel}
              onChange={setSelectedCarLevel}
              customAmounts={customAmounts}
              activeTab="购车"
              onEditAmount={onEditAmount}
              isConfirmed={isConfirmed}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Step 1: First car */}
            {currentCarStep === 1 && (
              <div className="space-y-4">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-700">选择第1辆车的档次：</h4>
                <SegmentedControl
                  options={carLevels}
                  value={carLevelConfigs[0]}
                  onChange={(level) => updateCarLevel(0, level)}
                  customAmounts={customAmounts}
                  activeTab="购车-0"
                  onEditAmount={onEditAmount}
                  isConfirmed={carStepConfirmed[1]}
                />
                {!carStepConfirmed[1] && (
                  <Button
                    onClick={handleCarStepConfirm}
                    className="w-full py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:from-[#A0E4E9] hover:to-[#7DD3D7] text-gray-900 shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      确认第1辆车档次
                      <Check className="w-4 h-4" />
                    </span>
                  </Button>
                )}
                {carStepConfirmed[1] && (
                  <div className="flex items-center justify-center bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" strokeWidth={2} />
                      </div>
                      <span className="text-green-800 font-medium text-sm">第1辆车档次已确认</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Second car */}
            {currentCarStep === 2 && (
              <div className="space-y-4">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-700">选择第2辆车的档次：</h4>
                <SegmentedControl
                  options={carLevels}
                  value={carLevelConfigs[1]}
                  onChange={(level) => updateCarLevel(1, level)}
                  customAmounts={customAmounts}
                  activeTab="购车-1"
                  onEditAmount={onEditAmount}
                  isConfirmed={carStepConfirmed[2]}
                />
                {!carStepConfirmed[2] && (
                  <Button
                    onClick={handleCarStepConfirm}
                    className="w-full py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:from-[#A0E4E9] hover:to-[#7DD3D7] text-gray-900 shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      确认第2辆车档次
                      <Check className="w-4 h-4" />
                    </span>
                  </Button>
                )}
                {carStepConfirmed[2] && (
                  <div className="flex items-center justify-center bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" strokeWidth={2} />
                      </div>
                      <span className="text-green-800 font-medium text-sm">第2辆车档次已确认</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Summary when both cars are confirmed */}
            {canProceedToFinalConfirm() && carCount === 2 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">车辆配置总结：</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">第1辆车：</span>
                    <span className="font-medium">{carLevels.find(l => l.value === carLevelConfigs[0])?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">第2辆车：</span>
                    <span className="font-medium">{carLevels.find(l => l.value === carLevelConfigs[1])?.label}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CarConfig;
