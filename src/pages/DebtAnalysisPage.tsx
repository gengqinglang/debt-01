import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { DebtInfo } from '@/pages/FinancialStatusPage';
import RepaymentSummary from '@/components/debt/RepaymentSummary';
import LoanOverviewList from '@/components/debt/LoanOverviewList';
import RepaymentCalendar from '@/components/debt/RepaymentCalendar';
import { setMockDebts } from '@/data/mockDebts';

const DebtAnalysisPage = () => {
  const navigate = useNavigate();
  const [debts, setDebts] = useState<DebtInfo[]>([]);

  useEffect(() => {
    // 从本地存储加载债务数据，如果没有则使用模拟数据
    try {
      const savedDebts = localStorage.getItem('confirmed_debts');
      if (savedDebts) {
        const parsedDebts = JSON.parse(savedDebts);
        if (parsedDebts.length === 0) {
          setMockDebts();
          const mockData = localStorage.getItem('confirmed_debts');
          if (mockData) {
            setDebts(JSON.parse(mockData));
          }
        } else {
          setDebts(parsedDebts);
        }
      } else {
        setMockDebts();
        const mockData = localStorage.getItem('confirmed_debts');
        if (mockData) {
          setDebts(JSON.parse(mockData));
        }
      }
    } catch (error) {
      console.error('加载债务数据失败:', error);
      setMockDebts();
      const mockData = localStorage.getItem('confirmed_debts');
      if (mockData) {
        try {
          setDebts(JSON.parse(mockData));
        } catch (err) {
          console.error('解析模拟数据失败:', err);
          setDebts([]);
        }
      }
    }
  }, []);

  const goBack = () => {
    navigate('/');
  };

  // 如果没有债务数据
  if (debts.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4FDFD] flex flex-col">
        <div className="relative flex flex-col bg-white/90 backdrop-blur-xl flex-1">
          {/* 标题区域 */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#B3EBEF]/20 via-white/60 to-[#B3EBEF]/20 -mx-2">
            <div className="relative py-6 px-3 flex items-center">
              <Button
                onClick={goBack}
                variant="ghost"
                size="icon"
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900 text-center flex-1">债务分析</h1>
            </div>
          </div>

          {/* 空状态 */}
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无债务数据</h3>
              <p className="text-gray-500 mb-6">请先录入您的债务信息</p>
              <Button
                onClick={goBack}
                className="bg-gradient-to-r from-[#B3EBEF] to-[#8FD8DC] hover:from-[#A0E2E6] hover:to-[#7BC9CE] text-gray-900 font-medium"
              >
                去录入债务信息
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4FDFD] flex flex-col">
      <div className="relative flex flex-col bg-white/90 backdrop-blur-xl flex-1">
        {/* 标题区域 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#B3EBEF]/20 via-white/60 to-[#B3EBEF]/20 -mx-2">
          <div className="relative py-6 px-3 flex items-center">
            <Button
              onClick={goBack}
              variant="ghost"
              size="icon"
              className="absolute left-3 top-1/2 -translate-y-1/2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900 text-center flex-1">债务分析</h1>
          </div>
        </div>

        {/* 内容区域 - 可滚动 */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-6">
          <div className="space-y-6">
            {/* 模块1: 汇总数据 */}
            <RepaymentSummary debts={debts} />

            {/* 模块2: 每笔债务概览 */}
            <LoanOverviewList debts={debts} />

            {/* 模块3: 还款日历 */}
            <RepaymentCalendar debts={debts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtAnalysisPage;