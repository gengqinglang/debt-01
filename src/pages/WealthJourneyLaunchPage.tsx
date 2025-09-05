import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Map, Compass, FileText, ChevronDown } from 'lucide-react';
import PhoneLoginModal from '@/components/auth/PhoneLoginModal';
const WealthJourneyLaunchPage = () => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const processCards = [{
    icon: MapPin,
    title: "第1步 梳理家庭债务",
    description: "全面了解您的债务情况，包括房贷、车贷、信贷等",
    bgColor: "#CAF4F7"
  }, {
    icon: Map,
    title: "第2步 梳理其他支出",
    description: "盘点除债务外家庭其他开支，如基础生活、子女教育、医疗等",
    bgColor: "#CAF4F7"
  }, {
    icon: Compass,
    title: "第3步 盘点家庭资产实力",
    description: "梳理家庭现有资产，预估未来收入能力",
    bgColor: "#CAF4F7"
  }];
  const handleStartJourney = () => {
    console.log('开始财富快照流程');
    setShowLoginModal(true);
  };
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    console.log('登录成功，跳转到 onboarding 页面');
    navigate('/onboarding');
  };
  return <div className="h-screen max-h-screen flex flex-col w-full max-w-md mx-auto bg-white relative overflow-hidden">
      {/* Header Section - 与第二页保持一致的高度 */}
      <div className="pt-12 pb-8 px-6 text-center flex-shrink-0">
        <h1 className="text-3xl font-bold text-[#2E4E5F] leading-tight tracking-wide">三步诊断偿债风险</h1>
      </div>

      {/* 主内容区 */}
      {/* 三步流程卡片 */}
      <div className="mb-8 px-4">
        <div className="bg-[#CAF4F7]/40 backdrop-blur-xl rounded-3xl p-0 border border-[#CAF4F7]/30 shadow-2xl shadow-[#CAF4F7]/20">
          <div className="space-y-6 bg-white">
            {processCards.map((card, index) => {
            const IconComponent = card.icon;
            return <div key={index} className="bg-[#CAF4F7]/40 backdrop-blur-sm rounded-2xl p-4 border border-white/80 hover:bg-[#CAF4F7]/60 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#CAF4F7]/40 rounded-xl">
                      <IconComponent className="w-5 h-5 text-[#2E4E5F]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2E4E5F] mb-1 text-xl">
                        {card.title}
                      </h3>
                      <p className="text-sm text-[#5A7D9A] leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>;
          })}
          </div>
        </div>
      </div>

      {/* 连接箭头和过渡文案 */}
      <div className="flex flex-col items-center mb-8 px-4">
        <div className="text-2xl animate-bounce">
          <ChevronDown className="w-8 h-8" color="#01BCD6" />
        </div>
        <p className="text-sm text-[#5A7D9A] font-medium mt-3 animate-fade-in">完成后您将获得</p>
      </div>

      {/* 获得的诊断结果 */}
      <div className="mb-8 px-4">
        <div className="bg-[#FEF3C7]/40 backdrop-blur-xl rounded-3xl p-6 border border-[#FEF3C7]/80 shadow-2xl shadow-[#FEF3C7]/20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <h2 className="text-xl font-bold text-[#2E4E5F]">
                专属债务诊断报告
              </h2>
            </div>
            <p className="text-base text-[#5A7D9A]">深度诊断偿债风险，精准定位问题债务</p>
          </div>
        </div>
      </div>

      {/* 行动按钮 - 居中显示，与上方卡片宽度一致 */}
      <div className="px-4 mb-6">
        <Button 
          className="w-full mt-2 bg-[#CAF4F7] hover:bg-[#A8E6E9] text-[#2E4E5F] px-12 py-7 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          onClick={handleStartJourney}
        >
          开始
        </Button>
      </div>


      {/* 登录弹窗 */}
      <PhoneLoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />

      <style dangerouslySetInnerHTML={{
      __html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          .font-pingfang {
            font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          
          .font-pingfang-bold {
            font-family: "PingFang SC", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-weight: 700;
          }

          .backdrop-blur-md {
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          @media (max-width: 375px) {
            h1 {
              font-size: 28px !important;
            }
          }

          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `
    }} />
    </div>;
};
export default WealthJourneyLaunchPage;