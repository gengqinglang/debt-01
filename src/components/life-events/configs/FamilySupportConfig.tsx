import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Info, TrendingUp, Plus, Trash2 } from 'lucide-react';
import HelpRelativeHeatmap from './HelpRelativeHeatmap';

interface TimeSegment {
  id: string;
  startAge: number;
  endAge: number;
  annualAmount: number;
}

interface FamilySupportConfigProps {
  initialData?: {
    timeSegments?: TimeSegment[];
  };
  onConfigChange: (timeSegments: TimeSegment[], totalAmount: number) => void;
  showHeatmap?: boolean;
}

const FamilySupportConfig: React.FC<FamilySupportConfigProps> = ({
  initialData,
  onConfigChange,
  showHeatmap = true
}) => {
  const [timeSegments, setTimeSegments] = useState<TimeSegment[]>(() => {
    if (initialData?.timeSegments && initialData.timeSegments.length > 0) {
      return initialData.timeSegments;
    }
    return [{
      id: '1',
      startAge: 35,
      endAge: 55,
      annualAmount: 5
    }];
  });

  const [overlapError, setOverlapError] = useState<string>('');

  // 生成年龄选项（25-85岁）
  const generateAgeOptions = () => {
    const options = [];
    for (let age = 25; age <= 85; age++) {
      options.push(age);
    }
    return options;
  };

  const ageOptions = generateAgeOptions();

  // 检查时间段重叠
  const checkOverlap = (segments: TimeSegment[]) => {
    for (let i = 0; i < segments.length; i++) {
      for (let j = i + 1; j < segments.length; j++) {
        const seg1 = segments[i];
        const seg2 = segments[j];
        
        if (seg1.startAge <= seg2.endAge && seg2.startAge <= seg1.endAge) {
          return `时间段 ${seg1.startAge}-${seg1.endAge}岁 与 ${seg2.startAge}-${seg2.endAge}岁 存在重叠`;
        }
      }
    }
    return '';
  };

  // 计算总金额
  const calculateTotalAmount = (segments: TimeSegment[]) => {
    return segments.reduce((total, segment) => {
      const years = Math.max(0, segment.endAge - segment.startAge + 1);
      return total + (years * segment.annualAmount);
    }, 0);
  };

  const totalAmount = calculateTotalAmount(timeSegments);
  const totalYears = timeSegments.reduce((total, segment) => {
    return total + Math.max(0, segment.endAge - segment.startAge + 1);
  }, 0);

  useEffect(() => {
    const error = checkOverlap(timeSegments);
    setOverlapError(error);
    
    if (!error) {
      onConfigChange(timeSegments, totalAmount);
    }
  }, [timeSegments, totalAmount, onConfigChange]);

  const handleAddTimeSegment = () => {
    const newId = (Math.max(0, ...timeSegments.map(s => parseInt(s.id))) + 1).toString();
    const newSegment: TimeSegment = {
      id: newId,
      startAge: 35,
      endAge: 55,
      annualAmount: 5
    };
    setTimeSegments([...timeSegments, newSegment]);
  };

  const handleDeleteTimeSegment = (id: string) => {
    setTimeSegments(timeSegments.filter(segment => segment.id !== id));
  };

  const handleSegmentChange = (id: string, field: keyof Omit<TimeSegment, 'id'>, value: number) => {
    setTimeSegments(timeSegments.map(segment => {
      if (segment.id === id) {
        const updatedSegment = { ...segment, [field]: value };
        
        // 确保结束年龄不小于开始年龄
        if (field === 'startAge' && updatedSegment.endAge < value) {
          updatedSegment.endAge = value;
        }
        
        return updatedSegment;
      }
      return segment;
    }));
  };

  return (
    <div className="space-y-8 max-w-md mx-auto">
      {/* 可支配资金热力图参考 */}
      {showHeatmap && (
        <div className="space-y-4">
          <div className="mb-3">
            <div className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              未来年份可支配资金参考
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
            <HelpRelativeHeatmap />
          </div>
        </div>
      )}

      {/* 资助计划配置 */}
      <div className="space-y-4">
        <div className="mb-3">
          <div className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-green-600" />
            资助亲人计划配置
          </div>
        </div>

        {/* 时间段重叠错误提示 */}
        {overlapError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs text-red-700">{overlapError}</p>
          </div>
        )}

        {/* 时间段列表 */}
        {timeSegments.length > 0 && (
          <div className="space-y-3">
            {timeSegments.map((segment, index) => (
              <div key={segment.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">时间段 {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTimeSegment(segment.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                {/* 时间段配置 */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="space-y-1">
                    <Label htmlFor={`startAge-${segment.id}`} className="text-xs font-medium text-gray-700">
                      开始年龄
                    </Label>
                    <Select
                      value={segment.startAge.toString()}
                      onValueChange={(value) => handleSegmentChange(segment.id, 'startAge', parseInt(value))}
                    >
                      <SelectTrigger className="text-xs h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {ageOptions.map(age => (
                          <SelectItem key={age} value={age.toString()}>
                            {age}岁
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`endAge-${segment.id}`} className="text-xs font-medium text-gray-700">
                      结束年龄
                    </Label>
                    <Select
                      value={segment.endAge.toString()}
                      onValueChange={(value) => handleSegmentChange(segment.id, 'endAge', parseInt(value))}
                    >
                      <SelectTrigger className="text-xs h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        {ageOptions.filter(age => age >= segment.startAge).map(age => (
                          <SelectItem key={age} value={age.toString()}>
                            {age}岁
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 年度资助金额 */}
                <div className="space-y-1">
                  <Label htmlFor={`annualAmount-${segment.id}`} className="text-xs font-medium text-gray-700">
                    年度资助金额（万元/年）
                  </Label>
                  <Input
                    id={`annualAmount-${segment.id}`}
                    type="number"
                    value={segment.annualAmount}
                    onChange={(e) => handleSegmentChange(segment.id, 'annualAmount', parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                    step="0.5"
                    className="text-xs h-8"
                  />
                </div>

                {/* 单个时间段小结 */}
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>小计：</span>
                    <span className="font-medium">
                      {(Math.max(0, segment.endAge - segment.startAge + 1) * segment.annualAmount).toFixed(1)}万元
                      ({Math.max(0, segment.endAge - segment.startAge + 1)}年)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 添加时间段按钮 */}
        <Button
          variant="outline"
          onClick={handleAddTimeSegment}
          className="w-full h-8 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          添加时间段
        </Button>

        {/* 资助计划总结 */}
        {timeSegments.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-800">资助计划总结</span>
              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                {totalYears}年
              </Badge>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>时间段数量：</span>
                <span className="font-medium">{timeSegments.length}个</span>
              </div>
              <div className="flex justify-between border-t border-green-200 pt-1 mt-2">
                <span className="font-medium">总计金额：</span>
                <span className="font-bold text-green-700">{totalAmount.toFixed(1)}万元</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilySupportConfig;
