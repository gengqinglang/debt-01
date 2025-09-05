
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const WhoAreYouPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const newSessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('flow_session_id', newSessionId);
    console.log('设置新的流程会话ID:', newSessionId);
  }, []);

  const goToPersonalInfo = () => {
    navigate('/personal-info');
  };

  return (
    <div className="h-screen max-h-screen flex flex-col w-full max-w-md mx-auto bg-white relative overflow-hidden">
      {/* 进度条 - 放在页面顶部 */}
      <div className="pt-12 pb-8 px-6">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                index < 1 
                  ? 'bg-[#01BCD6] text-white' 
                  : index === 1 
                    ? 'bg-[#01BCD6] text-white'
                    : 'bg-gray-300 text-gray-600'
              }`}>
                {step}
              </div>
              {index < 2 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  index < 1 ? 'bg-[#01BCD6]' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
          <span className="text-sm text-gray-600">
            第2步，共3步
          </span>
        </div>
      </div>

      {/* 内容区域 - 调整布局 */}
      <div className="flex-1 flex flex-col justify-between px-6">
        {/* 标题文案 - 居中区域 */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center space-y-8">
            <h1 className="text-4xl font-bold" style={{
              color: '#202020'
            }}>
              梳理其他家庭开支
            </h1>
            <p style={{
              color: '#6B7280'
            }} className="leading-relaxed px-4 text-sm">
              除了还债之外的日常生活开支，让我们一起梳理清楚，为您规划更好的财务未来。
            </p>
          </div>
        </div>

        {/* 开始按钮 - 固定在底部 */}
        <div className="pb-12 w-full max-w-xs mx-auto">
          <Button 
            onClick={goToPersonalInfo}
            className="w-full py-4 text-white font-bold rounded-xl text-xl shadow-lg transform transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: '#01BCD6' }}
          >
            开始填写
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhoAreYouPage;
