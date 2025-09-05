import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Edit3 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
interface MultiItem {
  id: string;
  name: string;
  amount: number;
  marketValue: number; // 市值（万元）
}
interface MultiItemEditorProps {
  title: string;
  itemType: 'house' | 'car';
  unit: string;
  defaultAmount: number;
  minAmount: number;
  maxAmount: number;
  items: MultiItem[];
  onItemsChange: (items: MultiItem[]) => void;
  isPrePopulated?: boolean;
  showInYuan?: boolean;
}
const MultiItemEditor: React.FC<MultiItemEditorProps> = ({
  title,
  itemType,
  unit,
  defaultAmount,
  minAmount,
  maxAmount,
  items,
  onItemsChange,
  isPrePopulated = false,
  showInYuan = false
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MultiItem | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [itemMarketValue, setItemMarketValue] = useState('');
  const [nameError, setNameError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [marketValueError, setMarketValueError] = useState('');
  const getDefaultItemName = (type: 'house' | 'car', index: number) => {
    return type === 'house' ? `房产${index + 1}` : `车辆${index + 1}`;
  };
  const calculateMaintenanceCost = (marketValue: number, type: 'house' | 'car') => {
    if (type === 'house') {
      return marketValue * 0.0015; // 0.15%
    } else {
      return marketValue * 0.02; // 2%
    }
  };
  const addNewItem = () => {
    const newItem: MultiItem = {
      id: Date.now().toString(),
      name: getDefaultItemName(itemType, items.length),
      amount: defaultAmount,
      marketValue: itemType === 'house' ? 300 : 20 // 默认房产300万，车辆20万
    };
    setEditingItem(newItem);
    setItemName(newItem.name);
    setItemAmount(newItem.amount.toString());
    setItemMarketValue(newItem.marketValue.toString());
    setNameError('');
    setAmountError('');
    setMarketValueError('');
    setEditDialogOpen(true);
  };
  const editItem = (item: MultiItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemAmount(item.amount.toString());
    setItemMarketValue(item.marketValue.toString());
    setNameError('');
    setAmountError('');
    setMarketValueError('');
    setEditDialogOpen(true);
  };
  const deleteItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    onItemsChange(updatedItems);
  };
  const validateAndSave = () => {
    let hasError = false;

    // 验证名称
    if (!itemName.trim()) {
      setNameError('请输入名称');
      hasError = true;
    } else {
      setNameError('');
    }

    // 验证金额
    const amount = parseFloat(itemAmount);
    if (isNaN(amount) || amount < minAmount || amount > maxAmount) {
      setAmountError(`请输入${minAmount}-${maxAmount}之间的数值`);
      hasError = true;
    } else {
      setAmountError('');
    }

    // 验证市值
    const marketValue = parseFloat(itemMarketValue);
    if (isNaN(marketValue) || marketValue <= 0) {
      setMarketValueError('请输入有效的市值');
      hasError = true;
    } else {
      setMarketValueError('');
    }
    if (hasError) return;
    if (editingItem) {
      if (items.find(item => item.id === editingItem.id)) {
        // 编辑现有项目
        const updatedItems = items.map(item => item.id === editingItem.id ? {
          ...item,
          name: itemName.trim(),
          amount,
          marketValue
        } : item);
        onItemsChange(updatedItems);
      } else {
        // 添加新项目
        const newItem = {
          ...editingItem,
          name: itemName.trim(),
          amount,
          marketValue
        };
        onItemsChange([...items, newItem]);
      }
    }
    setEditDialogOpen(false);
    setEditingItem(null);
  };
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  return <div className="space-y-4">
      <div className="flex flex-col gap-2">
        
        <p className="text-sm text-gray-500">
          {itemType === 'house' ? '养房成本包含物业费、取暖费、房屋维修等日常维护费用' : '养车成本包含保险费、保养费、停车费、燃油费等日常使用费用'}
        </p>
      </div>

      {items.length === 0 ? <Card className="p-6 text-center border-dashed border-2 border-gray-300">
          <p className="text-gray-500 mb-3">还没有添加{itemType === 'house' ? '房产' : '车辆'}</p>
          <Button variant="outline" onClick={addNewItem} className="border-[#CCE9B5] text-gray-700 hover:bg-[#CCE9B5]/10">
            <Plus className="w-4 h-4 mr-1" />
            添加第一个{itemType === 'house' ? '房产' : '车辆'}
          </Button>
        </Card> : <div className="space-y-3">
          {items.map((item, index) => <Card key={item.id} className="relative p-4 bg-gradient-to-br from-white via-[#CCE9B5]/15 to-[#B8E0A1]/20 border border-[#CCE9B5]/30 shadow-sm hover:shadow-md transition-shadow">
              {/* 删除按钮 */}
              {items.length > 1}
              
              <div className="space-y-3 pr-4">
                {/* 标题和市值 */}
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                  
                </div>
                
                {/* 市值和费用输入 - 一行显示 */}
                <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto pl-0">
                  {/* 市值输入 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-gray-700">
                        {itemType === 'house' ? '房产' : '车辆'}市值 <span className="text-xs text-gray-500">(万元)</span>
                      </Label>
                    </div>
                    <Input type="number" value={item.marketValue} onChange={e => {
                const newMarketValue = parseFloat(e.target.value) || 0;
                const calculatedAmount = calculateMaintenanceCost(newMarketValue, itemType);
                const updatedItems = items.map(i => i.id === item.id ? {
                  ...i,
                  marketValue: newMarketValue,
                  amount: showInYuan ? calculatedAmount * 10000 : calculatedAmount
                } : i);
                onItemsChange(updatedItems);
              }} min="0" step="1" className="w-full text-center bg-white border-[#CCE9B5]/40 focus:border-[#CCE9B5] focus:ring-[#CCE9B5]/20" placeholder="请输入市值" />
                  </div>
                  
                  {/* 年度费用输入 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-gray-700">
                        年度{itemType === 'house' ? '养房' : '养车'}费用 <span className="text-xs text-gray-500">({showInYuan ? `元/${unit}` : `万/${unit}`})</span>
                      </Label>
                    </div>
                    <Input type="number" value={item.amount} onChange={e => {
                const newAmount = parseFloat(e.target.value) || 0;
                const updatedItems = items.map(i => i.id === item.id ? {
                  ...i,
                  amount: newAmount
                } : i);
                onItemsChange(updatedItems);
              }} min={minAmount} max={maxAmount} step={showInYuan ? "100" : "0.1"} className="w-full text-center bg-white border-[#CCE9B5]/40 focus:border-[#CCE9B5] focus:ring-[#CCE9B5]/20" placeholder="请输入费用" />
                  </div>
                </div>
              </div>
            </Card>)}
          
        </div>}

      {/* 编辑对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem && items.find(item => item.id === editingItem.id) ? '编辑' : '添加'}
              {itemType === 'house' ? '房产' : '车辆'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="itemName">名称</Label>
              <Input id="itemName" value={itemName} onChange={e => setItemName(e.target.value)} placeholder={`请输入${itemType === 'house' ? '房产' : '车辆'}名称`} className={nameError ? 'border-red-500' : ''} />
              {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
            </div>
            <div>
              <Label htmlFor="itemMarketValue">
                {itemType === 'house' ? '房产' : '车辆'}市值 (万元)
              </Label>
              <Input id="itemMarketValue" type="number" value={itemMarketValue} onChange={e => {
              const marketValue = e.target.value;
              setItemMarketValue(marketValue);
              // 自动计算维护成本
              const marketValueNum = parseFloat(marketValue) || 0;
              const calculatedAmount = calculateMaintenanceCost(marketValueNum, itemType);
              setItemAmount((showInYuan ? calculatedAmount * 10000 : calculatedAmount).toString());
            }} placeholder="请输入市值" min="0" step="1" className={marketValueError ? 'border-red-500' : ''} />
              {marketValueError && <p className="text-sm text-red-500 mt-1">{marketValueError}</p>}
              <p className="text-xs text-gray-500 mt-1">
                系统将自动计算{itemType === 'house' ? '养房' : '养车'}成本（{itemType === 'house' ? '市值×0.15%' : '市值×2%'}）
              </p>
            </div>
            <div>
              <Label htmlFor="itemAmount">
                {itemType === 'house' ? '养房' : '养车'}费用 ({showInYuan ? `元/${unit}` : `万/${unit}`})
              </Label>
              <Input id="itemAmount" type="number" value={itemAmount} onChange={e => setItemAmount(e.target.value)} placeholder={`${minAmount.toLocaleString()}-${maxAmount.toLocaleString()}`} min={minAmount} max={maxAmount} step={showInYuan ? "100" : "0.1"} className={amountError ? 'border-red-500' : ''} />
              {amountError && <p className="text-sm text-red-500 mt-1">{amountError}</p>}
              <p className="text-xs text-gray-500 mt-1">
                建议范围：{showInYuan ? `${minAmount.toLocaleString()}-${maxAmount.toLocaleString()}元/${unit}` : `${minAmount}-${maxAmount}万/${unit}`}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={validateAndSave} className="bg-gradient-to-r from-[#CCE9B5] to-[#B8E0A1] hover:from-[#B8E0A1] hover:to-[#A5D68A] text-gray-900">
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
export default MultiItemEditor;