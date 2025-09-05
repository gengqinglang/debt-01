import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = [{
    title: "梳理家庭债务全貌",
    subtitle: "梳理家庭债务全貌",
    content: "请您思考下，家庭成员都有哪些债务，根据系统提示，全部梳理下来，一定要对家庭债务全貌有个透彻的了解。",
    image: "/lovable-uploads/4d0013d6-6a39-4fb0-9375-7cd5086316fa.png"
  }, {
    title: "精准债务分析",
    subtitle: "让数据说话",
    content: "通过科学分析，为您的每一笔债务找到最优解决方案",
    image: "/lovable-uploads/4d0013d6-6a39-4fb0-9375-7cd5086316fa.png"
  }, {
    title: "开启债务梳理",
    subtitle: "准备好了吗？",
    content: "让我们一起梳理您的债务全貌，迈向财务自由第一步",
    image: "/lovable-uploads/4d0013d6-6a39-4fb0-9375-7cd5086316fa.png"
  }];

  useEffect(() => {
    const preloadImages = () => {
      pages.forEach(page => {
        const img = new Image();
        img.src = page.image;
      });
    };
    preloadImages();
  }, []);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFinancialStatus = () => {
    navigate('/financial-status', { 
      state: location.state 
    });
  };

  return (
    <div className="h-screen max-h-screen flex flex-col w-full max-w-md mx-auto bg-white relative overflow-hidden">
      {/* 进度条 - 放在页面顶部 */}
      <div className="pt-12 pb-8 px-6">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                index < currentPage + 1 
                  ? 'bg-[#01BCD6] text-white' 
                  : index === currentPage 
                    ? 'bg-[#01BCD6] text-white'
                    : 'bg-gray-300 text-gray-600'
              }`}>
                {step}
              </div>
              {index < 2 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  index < currentPage ? 'bg-[#01BCD6]' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
          <span className="text-sm text-gray-600">
            第{currentPage + 1}步，共3步
          </span>
        </div>
      </div>

      {/* 内容区域 - 调整布局 */}
      <div className="flex-1 flex flex-col justify-between px-6">
        {/* 标题文案 - 居中区域 */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center space-y-8">
            <h1 className="text-4xl font-bold text-[#2E4E5F] leading-tight tracking-wide">
              {pages[currentPage].subtitle}
            </h1>
            <p style={{
              color: '#6B7280'
            }} className="leading-relaxed px-4 text-sm">
              {pages[currentPage].content}
            </p>
          </div>
        </div>

        {/* 开始按钮 - 固定在底部 */}
        <div className="pb-12 w-full max-w-xs mx-auto">
          <Button 
            onClick={goToFinancialStatus}
            className="w-full py-4 text-white font-bold rounded-xl text-xl shadow-lg transform transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: '#01BCD6' }}
          >
            开启
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
