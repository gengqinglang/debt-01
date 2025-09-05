
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const RiskAssessmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const { fromRisk, returnToRiskDetail, returnPath, activeTab, pageMode } = location.state || {};
    
    if (returnPath && activeTab && pageMode) {
      // 使用传递的返回路径和状态
      navigate(returnPath, {
        state: {
          activeTab,
          pageMode
        }
      });
    } else if (returnToRiskDetail && fromRisk) {
      // 如果是从风险详情页面来的，返回到对应的风险详情页面
      navigate(`/risk-detail/${fromRisk}`);
    } else {
      // 其他情况返回上一页
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B3EBEF]/15 via-[#CCE9B5]/10 to-[#FFEA96]/15">
      <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen flex flex-col">
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <button onClick={handleBack} className="p-2" aria-label="返回">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">风险测评</h1>
          <div className="w-10 h-10"></div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-white">
          <img
            src="/lovable-uploads/e39bce78-d549-4882-a76a-47c6f1b876ec.png"
            alt="风险测评内容"
            className="max-w-full max-h-full object-contain"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentPage;
