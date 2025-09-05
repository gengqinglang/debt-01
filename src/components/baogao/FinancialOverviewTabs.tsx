import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DebtOverviewCard from './cards/DebtOverviewCard';
import AssetOverviewCard from './cards/AssetOverviewCard';
import ExpenditureSummaryCard from './cards/ExpenditureSummaryCard';
import IncomeSummaryCard from './cards/IncomeSummaryCard';

const FinancialOverviewTabs: React.FC = () => {
  return (
    <div className="mb-2">
      <div className="mb-2">
        <h2 className="text-base font-semibold text-foreground mb-2">财务总览</h2>
        
      </div>
      
      <Tabs defaultValue="debt" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-3 bg-transparent">
          <TabsTrigger 
            value="debt" 
            className="text-xs font-medium focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:font-bold data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:shadow-none"
          >
            负债总览
          </TabsTrigger>
          <TabsTrigger 
            value="assets" 
            className="text-xs font-medium focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:font-bold data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:shadow-none"
          >
            资产总览
          </TabsTrigger>
          <TabsTrigger 
            value="expenditure" 
            className="text-xs font-medium focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:font-bold data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:shadow-none"
          >
            未来支出总览
          </TabsTrigger>
          <TabsTrigger 
            value="income" 
            className="text-xs font-medium focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=active]:font-bold data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:rounded-md data-[state=active]:shadow-none"
          >
            未来收入总览
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="debt" className="mt-0">
          <DebtOverviewCard />
        </TabsContent>
        
        <TabsContent value="assets" className="mt-0">
          <AssetOverviewCard />
        </TabsContent>
        
        <TabsContent value="expenditure" className="mt-0">
          <ExpenditureSummaryCard />
        </TabsContent>
        
        <TabsContent value="income" className="mt-0">
          <IncomeSummaryCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialOverviewTabs;