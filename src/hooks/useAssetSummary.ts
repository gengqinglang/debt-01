import { useMemo } from 'react';

interface AssetItem {
  label: string;
  amount: number;
  icon: string;
}

export const useAssetSummary = () => {
  const assetData = useMemo(() => {
    try {
      const currentAssets = JSON.parse(localStorage.getItem('currentAssets') || '{}');
      
      const assetItems: AssetItem[] = [
        { label: '现金及银行存款', amount: currentAssets.cash || 0, icon: '💰' },
        { label: '房产', amount: currentAssets.property || 0, icon: '🏠' },
        { label: '投资理财', amount: currentAssets.investment || 0, icon: '📈' },
        { label: '保险', amount: currentAssets.insurance || 0, icon: '🛡️' },
        { label: '其他资产', amount: currentAssets.other || 0, icon: '📦' }
      ].filter(item => item.amount > 0);

      const totalAssets = assetItems.reduce((sum, item) => sum + item.amount, 0);

      return {
        totalAssets,
        assetItems,
        hasData: assetItems.length > 0
      };
    } catch (error) {
      return {
        totalAssets: 0,
        assetItems: [],
        hasData: false
      };
    }
  }, []);

  return assetData;
};