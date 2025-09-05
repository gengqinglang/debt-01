import React from 'react';
import { X, Play, Clock, Users, BookOpen, Star, Download, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  price: string;
  originalPrice?: string;
  thumbnail: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  lessons: number;
  preview?: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  isPreview: boolean;
  completed?: boolean;
}

interface CourseDetailModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase?: (course: Course) => void;
  onPreview?: (course: Course) => void;
}

const lessonsData: Record<string, Lesson[]> = {
  '1': [
    { id: '1-1', title: '财务规划基础概念', duration: '15分钟', isPreview: true },
    { id: '1-2', title: '收入与支出分析', duration: '20分钟', isPreview: true },
    { id: '1-3', title: '建立家庭预算', duration: '25分钟', isPreview: false },
    { id: '1-4', title: '储蓄目标设定', duration: '18分钟', isPreview: false },
    { id: '1-5', title: '紧急基金规划', duration: '22分钟', isPreview: false },
  ],
  '2': [
    { id: '2-1', title: '投资基础知识', duration: '30分钟', isPreview: true },
    { id: '2-2', title: '风险评估与承受能力', duration: '25分钟', isPreview: false },
    { id: '2-3', title: '资产配置策略', duration: '35分钟', isPreview: false },
    { id: '2-4', title: '股票投资入门', duration: '40分钟', isPreview: false },
    { id: '2-5', title: '基金投资实战', duration: '45分钟', isPreview: false },
  ],
  '3': [
    { id: '3-1', title: '保险的基本概念', duration: '20分钟', isPreview: true },
    { id: '3-2', title: '人身保险规划', duration: '30分钟', isPreview: false },
    { id: '3-3', title: '财产保险选择', duration: '25分钟', isPreview: false },
    { id: '3-4', title: '保险组合配置', duration: '28分钟', isPreview: false },
  ],
  '4': [
    { id: '4-1', title: '退休规划的重要性', duration: '18分钟', isPreview: true },
    { id: '4-2', title: '养老金制度解析', duration: '32分钟', isPreview: false },
    { id: '4-3', title: '个人养老金投资', duration: '35分钟', isPreview: false },
    { id: '4-4', title: '退休后的财务管理', duration: '28分钟', isPreview: false },
  ]
};

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isOpen,
  onClose,
  onPurchase,
  onPreview
}) => {
  if (!course) return null;

  const lessons = lessonsData[course.id] || [];
  const previewLessons = lessons.filter(lesson => lesson.isPreview);
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-blue-100 text-blue-700';
      case 'advanced': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return '入门';
      case 'intermediate': return '进阶';
      case 'advanced': return '高级';
      default: return '未知';
    }
  };

  const handlePurchase = () => {
    onPurchase?.(course);
  };

  const handlePreview = () => {
    onPreview?.(course);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          {/* 课程头图 */}
          <div className="relative">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
              <Button 
                onClick={handlePreview}
                variant="secondary" 
                size="lg"
                className="bg-white/90 hover:bg-white text-gray-800"
              >
                <Play className="w-5 h-5 mr-2" />
                试听课程
              </Button>
            </div>
            <Badge className={`absolute top-3 right-3 ${getLevelColor(course.level)}`}>
              {getLevelText(course.level)}
            </Badge>
          </div>

          <DialogTitle className="text-xl font-bold text-gray-800 text-left">
            {course.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 课程信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-800">{course.duration}</div>
                <div className="text-xs text-gray-500">总时长</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-800">{course.lessons}节</div>
                <div className="text-xs text-gray-500">课程数</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <div>
                <div className="text-sm font-medium text-gray-800">{course.students}</div>
                <div className="text-xs text-gray-500">学员数</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <div>
                <div className="text-sm font-medium text-gray-800">{course.rating}</div>
                <div className="text-xs text-gray-500">评分</div>
              </div>
            </div>
          </div>

          {/* 课程描述 */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">课程介绍</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
          </div>

          {/* 讲师信息 */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">讲师</h4>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#01BCD6] to-[#00A3C4] rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">{course.instructor.charAt(0)}</span>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">{course.instructor}</div>
                <div className="text-xs text-gray-500">财务规划专家</div>
              </div>
            </div>
          </div>

          {/* 课程大纲 */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">课程大纲</h4>
            <div className="space-y-2">
              {lessons.map((lesson, index) => (
                <div 
                  key={lesson.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    lesson.isPreview ? 'bg-[#CAF4F7]/10 border-[#CAF4F7]/30' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{lesson.title}</div>
                      <div className="text-xs text-gray-500">{lesson.duration}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {lesson.isPreview && (
                      <Badge variant="secondary" className="text-xs">
                        试听
                      </Badge>
                    )}
                    <Play className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 购买区域 */}
          <div className="bg-gradient-to-r from-[#CAF4F7]/20 to-[#B3EBEF]/20 rounded-lg p-4 border border-[#CAF4F7]/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-[#01BCD6]">{course.price}</span>
                  {course.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">{course.originalPrice}</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">限时优惠价</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-800">永久观看</div>
                <div className="text-xs text-gray-500">支持离线下载</div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handlePreview}
                variant="outline" 
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                试听
              </Button>
              <Button 
                onClick={handlePurchase}
                className="flex-1 bg-gradient-to-r from-[#01BCD6] to-[#00A3C4] hover:from-[#01BCD6]/90 hover:to-[#00A3C4]/90 text-white"
              >
                立即购买
              </Button>
            </div>
          </div>

          {/* 课程特色 */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">课程特色</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-[#01BCD6]" />
                <span className="text-sm text-gray-700">支持下载</span>
              </div>
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-[#01BCD6]" />
                <span className="text-sm text-gray-700">在线学习</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#01BCD6]" />
                <span className="text-sm text-gray-700">学员交流</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-[#01BCD6]" />
                <span className="text-sm text-gray-700">配套资料</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDetailModal;