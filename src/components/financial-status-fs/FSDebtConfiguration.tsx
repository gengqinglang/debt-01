import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  EditorMortgage, EditorCarLoan, EditorConsumerLoan, 
  EditorBusinessLoan, EditorPrivateLoan, EditorCreditCard 
} from '@/modules/debt';
import { NormalizedDebtData } from '@/loan-core/types';

interface DebtConfigurationProps {
  category: any;
  onConfirm: (categoryId: string, data: any) => void;
  onDataChange?: (categoryId: string, normalizedData: NormalizedDebtData) => void;
  isConfirmed: boolean;
  existingData?: any;
}

const FSDebtConfiguration: React.FC<DebtConfigurationProps> = ({
  category,
  onConfirm,
  onDataChange,
  isConfirmed,
  existingData
}) => {
  
  const handleDataChange = (normalizedData: NormalizedDebtData) => {
    onDataChange?.(category.id, normalizedData);
  };

  const handleConfirm = (confirmPayload: any) => {
    onConfirm(category.id, confirmPayload);
  };

  const confirmButton = (
    <Button
      onClick={() => {}} // 会被Editor组件重写
      className="w-full h-12 text-white font-bold rounded-2xl"
      style={{ backgroundColor: '#01BCD6' }}
    >
      确认{category.name}信息
    </Button>
  );

  // 根据债务类型渲染对应的编辑器
  const renderDebtEditor = () => {
    const editorProps = {
      existingData,
      onDataChange: handleDataChange,
      onConfirm: handleConfirm,
      children: confirmButton
    };

    switch (category.type) {
      case 'mortgage':
        return <EditorMortgage {...editorProps} />;
      case 'carLoan':
        return <EditorCarLoan {...editorProps} />;
      case 'consumerLoan':
        return <EditorConsumerLoan {...editorProps} />;
      case 'businessLoan':
        return <EditorBusinessLoan {...editorProps} />;
      case 'privateLoan':
        return <EditorPrivateLoan {...editorProps} />;
      case 'creditCard':
        return <EditorCreditCard {...editorProps} />;
      default:
        return <div>不支持的债务类型</div>;
    }
  };

  return (
    <div className="p-0">
      {renderDebtEditor()}
    </div>
  );
};

export default FSDebtConfiguration;