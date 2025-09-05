import React, { useState } from 'react';
import { Search, Filter, BookOpen, Users, Home, GraduationCap, Briefcase, Shield, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CaseCard from './components/CaseCard';
import { practicalCases, casesByCategory, categories } from '@/data/practicalCases';

interface CasesTabProps {
  userContext?: {
    age?: number;
    wealthType?: string;
    hasFinancialGap?: boolean;
  };
}

const CasesTab: React.FC<CasesTabProps> = ({ userContext }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 类别图标映射
  const categoryIcons = {
    '结婚规划': Users,
    '买房置业': Home,
    '育儿教育': GraduationCap,
    '职业发展': Briefcase,
    '退休规划': Clock,
    '风险应对': Shield
  };

  // 过滤案例
  const filteredCases = practicalCases.filter(case_ => {
    const matchesCategory = selectedCategory === 'all' || case_.category === selectedCategory;
    const matchesSearch = case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const renderCategoryTab = (category: string) => {
    const cases = selectedCategory === 'all' ? filteredCases : casesByCategory[category] || [];
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || BookOpen;
    
    return (
      <div className="space-y-6">
        {/* 类别介绍 */}
        {selectedCategory !== 'all' && (
          <div className="bg-gradient-to-r from-[#B3EBEF]/10 to-[#9FE6EB]/10 rounded-lg p-6 border border-[#B3EBEF]/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#B3EBEF] to-[#9FE6EB] rounded-lg flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{category}</h2>
              <Badge variant="outline" className="bg-[#CAF4F7]/20 text-[#0891b2] border-[#CAF4F7]/50">
                {cases.length} 个案例
              </Badge>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              为您提供 {category} 相关的实用指导案例，帮助您更好地运用系统功能解决实际问题。
            </p>
          </div>
        )}
        
        {/* 单列上下布局 */}
        <div className="space-y-4">
          {cases.map((case_) => (
            <CaseCard
              key={case_.id}
              case_={case_}
              compact={false}
            />
          ))}
        </div>
        
        {/* 无结果提示 */}
        {cases.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">暂无相关案例</h3>
            <p className="text-gray-500">
              {searchTerm ? '尝试调整搜索关键词' : '敬请期待更多实用案例'}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 页面头部 */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="px-4 py-4">
          
          {/* 搜索栏 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索案例、标签或关键词..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 border-[#CAF4F7]/30 focus:border-[#CAF4F7]/50"
            />
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="px-4 py-6">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          {/* 类别选择器 */}
          <TabsList className="flex w-full overflow-x-auto mb-6 bg-gray-50 p-1 h-auto scrollbar-hide">
            <TabsTrigger value="all" className="text-xs px-3 py-2 data-[state=active]:bg-white whitespace-nowrap flex-shrink-0">
              全部
            </TabsTrigger>
            {categories.map((category) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || BookOpen;
              return (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="text-xs px-3 py-2 data-[state=active]:bg-white flex items-center space-x-1 whitespace-nowrap flex-shrink-0"
                >
                  <IconComponent className="w-3 h-3 flex-shrink-0" />
                  <span>{category}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* 统计信息 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                共找到 <strong className="text-gray-800">{filteredCases.length}</strong> 个案例
              </span>
              {searchTerm && (
                <Badge variant="outline" className="text-xs">
                  搜索: "{searchTerm}"
                </Badge>
              )}
            </div>
          </div>

          {/* 内容区域 */}
          <TabsContent value="all" className="mt-0">
            {renderCategoryTab('全部案例')}
          </TabsContent>
          
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              {renderCategoryTab(category)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default CasesTab;