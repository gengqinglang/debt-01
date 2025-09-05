import React, { useState } from 'react';
import { Play, Clock, Users, BookOpen, Star, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import familyFinanceImg from '@/assets/course-family-finance.jpg';
import investmentStrategyImg from '@/assets/course-investment-strategy.jpg';
import insurancePlanningImg from '@/assets/course-insurance-planning.jpg';
import retirementPlanningImg from '@/assets/course-retirement-planning.jpg';

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

const coursesData: Course[] = [
  {
    id: '1',
    title: '家庭财富管理入门课',
    description: '从零开始学习家庭财务规划，掌握收支管理、储蓄投资的基本方法',
    instructor: '张财务老师',
    duration: '6小时',
    students: 1580,
    rating: 4.8,
    price: '¥199',
    originalPrice: '¥299',
    thumbnail: familyFinanceImg,
    level: 'beginner',
    tags: ['财务基础', '理财入门'],
    lessons: 12,
    preview: '5分钟试听'
  },
  {
    id: '2',
    title: '资产配置与投资策略',
    description: '学习如何进行资产配置，降低投资风险，实现财富稳健增长',
    instructor: '李投资专家',
    duration: '8小时',
    students: 920,
    rating: 4.9,
    price: '¥399',
    originalPrice: '¥599',
    thumbnail: investmentStrategyImg,
    level: 'intermediate',
    tags: ['资产配置', '投资策略'],
    lessons: 16,
    preview: '10分钟试听'
  },
  {
    id: '3',
    title: '保险规划与风险管理',
    description: '全面了解家庭保险需求，制定完善的风险保障体系',
    instructor: '王保险顾问',
    duration: '4小时',
    students: 1200,
    rating: 4.7,
    price: '¥299',
    thumbnail: insurancePlanningImg,
    level: 'beginner',
    tags: ['保险规划', '风险管理'],
    lessons: 8,
    preview: '免费试听'
  },
  {
    id: '4',
    title: '退休规划与养老金管理',
    description: '提前规划退休生活，了解养老金制度，确保晚年财务安全',
    instructor: '陈规划师',
    duration: '5小时',
    students: 760,
    rating: 4.6,
    price: '¥349',
    thumbnail: retirementPlanningImg,
    level: 'intermediate',
    tags: ['退休规划', '养老投资'],
    lessons: 10,
    preview: '免费试听'
  }
];

interface CourseSectionProps {
  onCourseSelect?: (course: Course) => void;
}

const CourseSection: React.FC<CourseSectionProps> = ({ onCourseSelect }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    onCourseSelect?.(course);
  };

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

  return (
    <div className="p-4 space-y-6">
      {/* 推荐课程 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">推荐课程</h3>
          <Button variant="ghost" size="sm" className="text-[#01BCD6] hover:text-[#01BCD6]/80">
            查看全部
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {coursesData.map((course) => (
            <Card 
              key={course.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleCourseClick(course)}
            >
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  {/* 课程缩略图 */}
                  <div className="relative flex-shrink-0">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-20 h-16 rounded-lg object-fill"
                    />
                  </div>
                  
                  {/* 课程信息 */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-gray-800 text-sm leading-tight">
                        {course.title}
                      </h4>
                      <Badge className={`text-xs px-2 py-1 ${getLevelColor(course.level)}`}>
                        {getLevelText(course.level)}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {course.description}
                    </p>
                    
                    {/* 课程标签 */}
                    <div className="flex flex-wrap gap-1">
                      {course.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* 课程元信息 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{course.lessons}节</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{course.students}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <span className="text-lg font-bold text-[#01BCD6]">{course.price}</span>
                          {course.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">{course.originalPrice}</span>
                          )}
                        </div>
                        {course.preview && (
                          <div className="text-xs text-gray-500">{course.preview}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* 学习路径 */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">学习路径</h3>
        <Card className="bg-gradient-to-r from-[#CAF4F7]/20 to-[#B3EBEF]/20 border-[#CAF4F7]/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-[#01BCD6] to-[#00A3C4] rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">家庭财富管理进阶之路</h4>
                <p className="text-sm text-gray-600">从基础到进阶，系统学习财富管理知识</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseSection;