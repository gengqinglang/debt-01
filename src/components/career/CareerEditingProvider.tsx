
import React, { createContext, useContext, useState } from 'react';
import { useCareerData } from './SimplifiedCareerDataProvider';

interface CareerEditingContextType {
  editingStage: { type: 'personal' | 'partner', stageId: string } | null;
  editValues: { position: string; yearlyIncome: string };
  startEditStage: (type: 'personal' | 'partner', stageId: string) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  onEditChange: (field: 'position' | 'yearlyIncome', value: string) => void;
}

const CareerEditingContext = createContext<CareerEditingContextType | undefined>(undefined);

export const useCareerEditing = () => {
  const context = useContext(CareerEditingContext);
  if (!context) {
    throw new Error('useCareerEditing must be used within a CareerEditingProvider');
  }
  return context;
};

interface CareerEditingProviderProps {
  children: React.ReactNode;
}

export const CareerEditingProvider: React.FC<CareerEditingProviderProps> = ({ children }) => {
  const { careerPlan, setCareerPlan, partnerCareerPlan, setPartnerCareerPlan, formatToWan } = useCareerData();
  
  const [editingStage, setEditingStage] = useState<{ type: 'personal' | 'partner', stageId: string } | null>(null);
  const [editValues, setEditValues] = useState<{ position: string; yearlyIncome: string }>({ position: '', yearlyIncome: '' });

  const startEditStage = (type: 'personal' | 'partner', stageId: string) => {
    const plan = type === 'personal' ? careerPlan : partnerCareerPlan;
    const stage = plan.find(s => s.id === stageId);
    if (stage) {
      setEditingStage({ type, stageId });
      setEditValues({
        position: stage.position,
        yearlyIncome: formatToWan(stage.yearlyIncome)
      });
    }
  };

  const saveEdit = () => {
    if (!editingStage) return;
    
    const newIncomeInWan = parseFloat(editValues.yearlyIncome);
    if (isNaN(newIncomeInWan) || newIncomeInWan <= 0) return;
    
    const newIncomeInYuan = newIncomeInWan * 10000;

    const updatePlan = (plan: any[]) => 
      plan.map(stage => 
        stage.id === editingStage.stageId 
          ? { ...stage, position: editValues.position, yearlyIncome: newIncomeInYuan }
          : stage
      );

    if (editingStage.type === 'personal') {
      setCareerPlan(updatePlan(careerPlan));
    } else {
      setPartnerCareerPlan(updatePlan(partnerCareerPlan));
    }

    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingStage(null);
    setEditValues({ position: '', yearlyIncome: '' });
  };

  const onEditChange = (field: 'position' | 'yearlyIncome', value: string) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <CareerEditingContext.Provider value={{
      editingStage,
      editValues,
      startEditStage,
      saveEdit,
      cancelEdit,
      onEditChange
    }}>
      {children}
    </CareerEditingContext.Provider>
  );
};
