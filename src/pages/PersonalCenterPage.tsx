import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, User, Crown, TrendingUp, Wallet, PieChart, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExpenditureDataSummary from '@/components/personal-center/ExpenditureDataSummary';
import IncomeDataSummary from '@/components/personal-center/IncomeDataSummary';
import AssetDataSummary from '@/components/personal-center/AssetDataSummary';

const PersonalCenterPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const goToMemberCenter = () => {
    navigate('/member-center');
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-[#F8FDF8] relative">
      <div className="relative min-h-screen flex flex-col bg-white/90 backdrop-blur-xl">
        {/* 页面头部 */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回</span>
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">个人中心</h1>
            <div className="w-16"></div>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-6">
          {/* 用户信息卡片 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <span>用户信息</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {/* 基本用户信息 */}
              <div className="text-sm text-gray-600 space-y-1">
                <div>手机号：138****8888</div>
                <div>注册时间：2024-01-15</div>
              </div>

              <Separator />

              {/* 会员中心入口 */}
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={goToMemberCenter}
              >
                <div className="flex items-center space-x-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span>会员中心</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* 数据汇总展示 */}
          <div className="space-y-6">
            {/* 支出汇总 */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <PieChart className="w-4 h-4 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">支出汇总</h2>
              </div>
              <ExpenditureDataSummary />
            </div>

            <Separator />

            {/* 收入汇总 */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-4 h-4 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">收入汇总</h2>
              </div>
              <IncomeDataSummary />
            </div>

            <Separator />

            {/* 资产汇总 */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Wallet className="w-4 h-4 text-gray-600" />
                <h2 className="text-base font-semibold text-gray-900">资产汇总</h2>
              </div>
              <AssetDataSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalCenterPage;
