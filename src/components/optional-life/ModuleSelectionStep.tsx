
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Baby, Home, Car, Users, Plane, ArrowRight } from 'lucide-react';

interface ModuleOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface ModuleSelectionStepProps {
  selectedModules: string[];
  onModuleToggle: (moduleId: string) => void;
  onContinue: () => void;
  availableModules?: any[];
}

const defaultModuleOptions: ModuleOption[] = [
  {
    id: '结婚',
    name: '结婚',
    description: '结婚/蜜月/彩礼等支出',
    icon: Heart,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200'
  },
  {
    id: '生育',
    name: '生育',
    description: '产检/生产/月子/育儿等支出',
    icon: Baby,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: '购房',
    name: '购房',
    description: '房款/中介费/税费/装修费/养房等支出',
    icon: Home,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: '购车',
    name: '购车',
    description: '车款/税费/养车等支出',
    icon: Car,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    id: '旅游',
    name: '旅游',
    description: '旅游度假/购买奢侈品等支出',
    icon: Plane,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200'
  },
  {
    id: '赡养',
    name: '赡养',
    description: '养老院/生活费/医疗费/看护费等支出',
    icon: Users,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  }
];

const ModuleSelectionStep: React.FC<ModuleSelectionStepProps> = ({
  selectedModules,
  onModuleToggle,
  onContinue,
  availableModules
}) => {
  // Create module options based on available modules
  const moduleOptions = availableModules 
    ? defaultModuleOptions.filter(option => 
        availableModules.some(module => module.id === option.id)
      )
    : defaultModuleOptions;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {moduleOptions.map((module) => {
          const IconComponent = module.icon;
          const isSelected = selectedModules.includes(module.id);
          
          return (
            <div
              key={module.id}
              onClick={() => onModuleToggle(module.id)}
              className={`p-3 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                isSelected
                  ? `${module.bgColor} ${module.borderColor} shadow-lg`
                  : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
              }`}
              style={{ height: '90%' }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-white shadow-sm' : module.bgColor}`}>
                  <IconComponent 
                    className={`w-5 h-5 ${isSelected ? module.color : 'text-gray-400'}`}
                    strokeWidth={1.5}
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-0.5">{module.name}</h3>
                  <p className="text-sm text-gray-600">{module.description}</p>
                </div>
                
                <Checkbox
                  checked={isSelected}
                  onChange={() => onModuleToggle(module.id)}
                  className="w-5 h-5"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <Button
          onClick={onContinue}
          className="w-full py-3 text-sm font-bold rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:from-[#A0E4E9] hover:to-[#7DD3D7] text-gray-900"
        >
          <span className="flex items-center justify-center gap-2">
            {selectedModules.length > 0 ? '继续配置支出水平' : '都不选，进入下一步'}
            <ArrowRight className="w-4 h-4" />
          </span>
        </Button>
        
        {selectedModules.length > 0 && (
          <p className="text-xs text-gray-600 text-center mt-2">
            已选择 {selectedModules.length} 项人生大事
          </p>
        )}
      </div>
    </div>
  );
};

export default ModuleSelectionStep;
