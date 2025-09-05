import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Target, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigationState } from '@/hooks/useNavigationState';
import { practicalCases } from '@/data/practicalCases';

const CaseDetailPage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const { navigateBack, navigateWithState } = useNavigationState();
  
  const case_ = practicalCases.find(c => c.id === caseId);
  
  if (!case_) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">案例未找到</h2>
          <Button onClick={() => navigateBack()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center px-4 py-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigateBack()}
            className="mr-3"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-800 truncate">案例详情</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* 案例头部 */}
        <div className="mb-6">
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#B3EBEF] to-[#9FE6EB] rounded-xl flex items-center justify-center flex-shrink-0">
              <img 
                src={case_.image} 
                alt={case_.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
                {case_.title}
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                {case_.description}
              </p>
            </div>
          </div>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline" className="bg-[#CAF4F7]/20 text-[#0891b2] border-[#CAF4F7]/50">
              <BookOpen className="w-3 h-3 mr-1" />
              {case_.category}
            </Badge>
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            {case_.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* 详细内容 */}
        <div className="space-y-6">
          {/* 案例详情 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                案例详情
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {case_.detailContent.split('\n').map((line, index) => {
                  // 检查是否为需要加粗的标题行
                  const boldTitles = [
                    '先明确：你买房是为了什么？',
                    '核心判断：你的财务能力能不能扛住？',
                    '第一步：算清总支出，心里有本明白账',
                    '第二步：短期支付能力够不够？',
                    '第三步：长期还款能力扛不扛得住？',
                    '为什么需要系统帮忙？这些测算你自己很难算清'
                  ];
                  
                  const shouldBold = boldTitles.some(title => line.trim() === title);
                  
                  return (
                    <div key={index}>
                      {/* 在蓝色标题前添加空行 */}
                      {shouldBold && index > 0 && <div className="mb-4"></div>}
                      {shouldBold ? (
                        <strong className="font-bold text-[#01BCD6]">{line}</strong>
                      ) : (
                        line
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 相关功能链接 */}
          {case_.functionLinks && case_.functionLinks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="w-5 h-5 mr-2 text-teal-500" />
                  相关功能
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {case_.functionLinks.map((link, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => navigateWithState(link.route, link.params || {})}
                      className="w-full justify-between text-left border-[#CAF4F7]/30 hover:bg-[#CAF4F7]/10 hover:border-[#CAF4F7]/50"
                    >
                      <span>{link.label}</span>
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 底部返回按钮 */}
        <div className="mt-8 pb-6">
          <Button 
            onClick={() => navigateBack()} 
            className="w-full bg-gradient-to-r from-[#B3EBEF] to-[#9FE6EB] text-gray-800 hover:from-[#9FE6EB] hover:to-[#8BE5EA]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回案例列表
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailPage;