
import React, { useState } from 'react';
import { User, Users, Baby, Heart, CheckCircle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  birthYear: number | string;
  icon: React.ComponentType<{ className?: string }>;
}

interface FamilyTreeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAge: number;
  partnerAge: number;
  onCurrentAgeChange: (age: number) => void;
  onPartnerAgeChange: (age: number) => void;
  currentYear: number;
  readonly?: boolean;
}

const FamilyTreeDialog: React.FC<FamilyTreeDialogProps> = ({ 
  open, 
  onOpenChange,
  currentAge,
  partnerAge,
  onCurrentAgeChange,
  onPartnerAgeChange,
  currentYear,
  readonly = false
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const currentBirthYear = currentYear - currentAge;
  const partnerBirthYear = currentYear - partnerAge;
  
  const initialMembers: FamilyMember[] = [
    { id: 'self', name: '本人', relation: '本人', birthYear: currentBirthYear, icon: User },
    { id: 'partner', name: '伴侣', relation: '伴侣', birthYear: partnerBirthYear, icon: Heart },
    { id: 'future-partner', name: '未来伴侣', relation: '未来伴侣', birthYear: partnerBirthYear + 10, icon: Heart },
    { id: 'child', name: '孩子', relation: '孩子', birthYear: 2015, icon: Baby },
    { id: 'future-child', name: '未来孩子', relation: '未来孩子', birthYear: 2025, icon: Baby },
    { id: 'father', name: '本人爸爸', relation: '父亲', birthYear: currentBirthYear - 25, icon: User },
    { id: 'mother', name: '本人妈妈', relation: '母亲', birthYear: currentBirthYear - 25, icon: User },
    { id: 'partner-father', name: '伴侣爸爸', relation: '伴侣父亲', birthYear: partnerBirthYear - 25, icon: User },
    { id: 'partner-mother', name: '伴侣妈妈', relation: '伴侣母亲', birthYear: partnerBirthYear - 25, icon: User },
    { id: 'future-partner-father', name: '未来伴侣爸爸', relation: '未来伴侣父亲', birthYear: partnerBirthYear - 15, icon: User },
    { id: 'future-partner-mother', name: '未来伴侣妈妈', relation: '未来伴侣母亲', birthYear: partnerBirthYear - 15, icon: User },
  ];

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialMembers);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Reset family members when dialog opens
  React.useEffect(() => {
    if (open) {
      setFamilyMembers(initialMembers);
      setHasChanges(false);
    }
  }, [open, currentAge, partnerAge]);

  const handleBirthYearChange = (id: string, value: string) => {
    // 允许空字符串或者数字字符串
    if (value !== '' && !/^\d+$/.test(value)) {
      return; // 只允许空字符串或纯数字
    }

    // 如果输入不为空，进行年龄差验证
    if (value !== '') {
      const birthYear = parseInt(value);
      if (isNaN(birthYear)) return;

      // 验证本人和孩子的年龄差
      if (id === 'child' || id === 'future-child') {
        const selfMember = familyMembers.find(member => member.id === 'self');
        if (selfMember) {
          const selfBirthYear = typeof selfMember.birthYear === 'string' ? parseInt(selfMember.birthYear) : selfMember.birthYear;
          if (!isNaN(selfBirthYear)) {
            const selfAge = currentYear - selfBirthYear;
            const childAge = currentYear - birthYear;
            const ageDifference = selfAge - childAge;
            
            if (ageDifference < 18) {
              toast({
                title: "年龄设置错误",
                description: "本人和孩子的年龄差不能小于18岁，请重新设置",
                variant: "destructive"
              });
              return;
            }
          }
        }
      }

      // 如果修改的是本人的出生年份，需要检查与所有孩子的年龄差
      if (id === 'self') {
        const childMembers = familyMembers.filter(member => member.id === 'child' || member.id === 'future-child');
        const newSelfAge = currentYear - birthYear;
        
        for (const child of childMembers) {
          const childBirthYear = typeof child.birthYear === 'string' ? parseInt(child.birthYear) : child.birthYear;
          if (!isNaN(childBirthYear)) {
            const childAge = currentYear - childBirthYear;
            const ageDifference = newSelfAge - childAge;
            
            if (ageDifference < 18) {
              toast({
                title: "年龄设置错误",
                description: "本人和孩子的年龄差不能小于18岁，请重新设置",
                variant: "destructive"
              });
              return;
            }
          }
        }
      }
    }

    // 更新状态，允许空字符串或有效的数字
    setFamilyMembers(prev => prev.map(member => {
      if (member.id === id) {
        return { ...member, birthYear: value === '' ? '' : parseInt(value) };
      }
      return member;
    }));

    setHasChanges(true);
  };

  const handleConfirm = () => {
    let updateMessages: string[] = [];

    familyMembers.forEach(member => {
      if (member.id === 'self' && member.birthYear !== '') {
        const birthYear = typeof member.birthYear === 'string' ? parseInt(member.birthYear) : member.birthYear;
        if (!isNaN(birthYear)) {
          const newAge = currentYear - birthYear;
          if (newAge !== currentAge) {
            onCurrentAgeChange(newAge);
            updateMessages.push(`本人年龄已更新为${newAge}岁`);
          }
        }
      } else if (member.id === 'partner' && member.birthYear !== '') {
        const birthYear = typeof member.birthYear === 'string' ? parseInt(member.birthYear) : member.birthYear;
        if (!isNaN(birthYear)) {
          const newAge = currentYear - birthYear;
          if (newAge !== partnerAge) {
            onPartnerAgeChange(newAge);
            updateMessages.push(`伴侣年龄已更新为${newAge}岁`);
          }
        }
      }
    });

    // 如果有变更，显示成功弹窗
    if (hasChanges) {
      setHasChanges(false);
      onOpenChange(false);
      setShowSuccessModal(true);
    } else {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setFamilyMembers(initialMembers);
    setHasChanges(false);
    onOpenChange(false);
  };

  const getDisplayAge = (birthYear: number | string) => {
    if (birthYear === '' || typeof birthYear === 'string') {
      return '-';
    }
    return currentYear - birthYear;
  };

  const handleContinueAdjusting = () => {
    setShowSuccessModal(false);
  };

  const handleViewLatestTyping = () => {
    setShowSuccessModal(false);
    navigate('/new', { 
      state: { 
        activeTab: 'discover'
      } 
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              家庭成员
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">关系</TableHead>
                  <TableHead>出生年份</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {familyMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="w-[200px]">
                      <div className="flex items-center gap-2">
                        <member.icon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                        <span className="whitespace-nowrap">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={member.birthYear}
                          onChange={(e) => handleBirthYearChange(member.id, e.target.value)}
                          className={`w-24 h-8 text-sm [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] ${
                            (readonly || ['self', 'partner', 'future-partner', 'child'].includes(member.id)) 
                              ? 'bg-gray-50 cursor-not-allowed' 
                              : ''
                          }`}
                          placeholder="年份"
                          disabled={readonly || ['self', 'partner', 'future-partner', 'child'].includes(member.id)}
                          readOnly={readonly || ['self', 'partner', 'future-partner', 'child'].includes(member.id)}
                        />
                        <span className="text-sm text-gray-500">年</span>
                        <span className="text-xs text-gray-500">
                          ({getDisplayAge(member.birthYear)}岁)
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* 提示文案 */}
          <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg mx-6 mb-4">
            <p className="text-sm text-blue-700 text-center">
              💡 如您想修改家庭成员年龄，请重新走快照
            </p>
          </div>
          <DialogFooter className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              取消
            </Button>
            <Button onClick={handleConfirm} className="flex-1 bg-[#CCE9B5] hover:bg-[#B3EBEF] text-gray-800">
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 配置更新成功弹窗 */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className="relative">
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="p-8 text-center space-y-6">
              {/* 成功图标 */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              {/* 标题 */}
              <h2 className="text-xl font-bold text-gray-800">
                配置更新成功！
              </h2>

              {/* 描述文案 */}
              <p className="text-sm text-gray-700 leading-relaxed">
                您的家庭成员出生年份已更新，这可能会影响您的财富分型和风险评估结果。建议查看最新的财富分型，了解调整后的财务状况变化。
              </p>

              {/* 按钮组 */}
              <div className="flex gap-3">
                <Button
                  onClick={handleContinueAdjusting}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  暂不查看，继续调整
                </Button>
                <Button
                  onClick={handleViewLatestTyping}
                  className="flex-1 bg-[#B3EBEF] hover:bg-[#A0E7EB] text-gray-800 border-0"
                >
                  查看最新财富分型
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FamilyTreeDialog;
