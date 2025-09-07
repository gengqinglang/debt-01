import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CreditCardInfo } from '@/hooks/useCreditCardData';

interface CreditCardCardProps {
  creditCard: CreditCardInfo;
  index: number;
  updateCreditCard: (id: string, field: keyof CreditCardInfo, value: string) => void;
  removeCreditCard: (id: string) => void;
  resetCreditCard: (id: string) => void;
  creditCardsLength: number;
}

const CreditCardCard: React.FC<CreditCardCardProps> = ({
  creditCard,
  index,
  updateCreditCard,
  removeCreditCard,
  resetCreditCard,
  creditCardsLength,
}) => {
  return (
    <div className="rounded-lg py-6 px-3 bg-white" style={{ border: '2px solid #CAF4F7' }}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-900">
          信用卡 {index + 1}
        </h4>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button 
              className="p-1 hover:bg-red-50 rounded text-red-500 hover:text-red-700"
              title={creditCardsLength > 1 ? "删除此信用卡" : "清空此信用卡"}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {creditCardsLength > 1 ? '确认删除' : '确认清空'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {creditCardsLength > 1 
                  ? '您确定要删除这张信用卡吗？此操作不可撤销。'
                  : '您确定要清空这张信用卡信息吗？将恢复至默认值。'
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                if (creditCardsLength > 1) {
                  removeCreditCard(creditCard.id);
                } else {
                  resetCreditCard(creditCard.id);
                }
              }}>
                {creditCardsLength > 1 ? '确定删除' : '确定清空'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="space-y-4">
        {/* 信用卡名称 */}
        <div>
          <Label className="text-xs font-medium">
            信用卡名称
          </Label>
          <Input
            type="text"
            placeholder="如：招商银行信用卡"
            value={creditCard.name || ''}
            onChange={(e) => updateCreditCard(creditCard.id, 'name', e.target.value)}
            className="h-9 text-sm mt-1"
          />
        </div>

        {/* 本期待还金额 + 未出账单金额 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium">
              本期待还金额（元）
            </Label>
            <Input
              type="number"
              inputMode="decimal"
              pattern="[0-9]*"
              step="0.01"
              min="0"
              placeholder="如：5000"
              value={creditCard.currentAmount}
              onChange={(e) => updateCreditCard(creditCard.id, 'currentAmount', e.target.value)}
              className="h-9 text-sm mt-1"
            />
          </div>
          <div>
            <Label className="text-xs font-medium">
              未出账单金额（元）
            </Label>
            <Input
              type="number"
              inputMode="decimal"
              pattern="[0-9]*"
              step="0.01"
              min="0"
              placeholder="如：2000"
              value={creditCard.unbilledAmount}
              onChange={(e) => updateCreditCard(creditCard.id, 'unbilledAmount', e.target.value)}
              className="h-9 text-sm mt-1"
            />
          </div>
        </div>

        {/* 总欠款显示 */}
        {(creditCard.currentAmount || creditCard.unbilledAmount) && (
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              总欠款：
              <span className="font-semibold text-gray-900">
                {((parseFloat(creditCard.currentAmount) || 0) + (parseFloat(creditCard.unbilledAmount) || 0)).toLocaleString()}元
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface SharedCreditCardModuleProps {
  children: React.ReactNode;
  existingData?: any;
  creditCards: CreditCardInfo[];
  addCreditCard: () => void;
  removeCreditCard: (id: string) => void;
  resetCreditCard: (id: string) => void;
  updateCreditCard: (id: string, field: keyof CreditCardInfo, value: string) => void;
  isCreditCardComplete: (creditCard: CreditCardInfo) => boolean;
}

export const SharedCreditCardModule: React.FC<SharedCreditCardModuleProps> = ({ 
  children, 
  existingData,
  creditCards,
  addCreditCard,
  removeCreditCard,
  resetCreditCard,
  updateCreditCard,
  isCreditCardComplete
}) => {
  return (
    <>
      {/* 信用卡列表 */}
      {creditCards.map((creditCard, index) => (
        <div key={creditCard.id} className="mb-4">
          <CreditCardCard
            creditCard={creditCard}
            index={index}
            updateCreditCard={updateCreditCard}
            removeCreditCard={removeCreditCard}
            resetCreditCard={resetCreditCard}
            creditCardsLength={creditCards.length}
          />
        </div>
      ))}

      {/* 按钮区域 - 左侧"再录一笔" + 右侧确认按钮 */}
      <div className="grid grid-cols-2 gap-3 mt-6 mb-3">
        {/* 左侧：再录一笔（虚线边框，青色） */}
        <Button
          onClick={addCreditCard}
          variant="outline"
          className="h-10 border-dashed text-sm"
          style={{ borderColor: '#01BCD6', color: '#01BCD6' }}
        >
          <Plus className="w-3 h-3 mr-2" />
          再录一笔
        </Button>

        {/* 右侧：确认信用卡信息（传入的children） */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </>
  );
};