
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ProtectionPlanPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col w-full max-w-md mx-auto bg-white relative">
      {/* 返回按钮 */}
      <button
        className="absolute top-4 left-4 z-10 bg-white/70 rounded-full p-2 shadow"
        onClick={handleBack}
        aria-label="返回"
      >
        <ArrowLeft className="w-6 h-6 text-gray-600" />
      </button>
      
      {/* 居中展示图片 */}
      <div className="flex flex-1 items-center justify-center">
        <img
          src="/lovable-uploads/bb4bada8-8a45-4b4c-b872-6abcc560dad9.png"
          alt="保障方案页面"
          className="w-full h-auto"
          draggable={false}
        />
      </div>
    </div>
  );
}
