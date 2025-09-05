
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AdjustmentAdvicePage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#F6FDF7] flex flex-col w-full">
      {/* Header */}
      <div className="max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-3 mt-2 p-2">
          <button
            type="button"
            aria-label="返回"
            className="flex items-center px-2 py-1 rounded-md hover:bg-gray-100 transition"
            onClick={handleBack}
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <span className="flex-1 text-center text-[#222] text-[18px] font-bold leading-tight -ml-5">
            调整建议
          </span>
          <span className="w-10" />
        </div>
      </div>
      {/* Main content - Just use the image */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src="/lovable-uploads/34b7b8b6-9b6d-4b3e-bd06-b490735a5d2c.png"
          alt="调整建议"
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default AdjustmentAdvicePage;
