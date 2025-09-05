import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, User, MapPin, Calendar, Check, Baby, Heart, Plus, Trash2, Info } from 'lucide-react';
import { useNavigationState } from '@/hooks/useNavigationState';
const PersonalInfoPage = () => {
  const navigate = useNavigate();
  const {
    getReturnState,
    navigateBack
  } = useNavigationState();
  const [birthYear, setBirthYear] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [partnerBirthYear, setPartnerBirthYear] = useState('');
  const [children, setChildren] = useState<{
    id: string;
    birthYear: string;
  }[]>([]);

  // 检查是否来自风险详情页的重走财富快照或从new页面的重新测评
  const returnState = getReturnState();
  const showBackButton = returnState?.sourceModule === 'risk-detail-retake-snapshot' || returnState?.sourceModule === 'new-page-retest' || returnState?.sourceModule === 'wealth-snapshot-reassessment';
  const handleBack = () => {
    if (returnState?.sourceModule === 'new-page-retest') {
      // 从new页面重新测评进入，返回到new页面
      navigate('/new');
    } else {
      // 其他情况使用原有的返回逻辑
      console.log('[PersonalInfoPage] Navigating back from personal info');
      navigateBack();
    }
  };

  // 根据性别动态生成婚育状态选项
  const getMaritalStatusOptions = () => {
    const baseOptions = [{
      value: 'single-no-child',
      label: '单身无娃',
      image: gender === 'male' ? '/lovable-uploads/9027216e-c5d6-4e3a-87d8-e6bad2686e10.png' : '/lovable-uploads/7f981ffd-9ce1-4f2d-a1f2-d7928e4505c2.png'
    }, {
      value: 'single-with-child',
      label: '单身有娃',
      image: gender === 'male' ? '/lovable-uploads/4dd11acf-3ebe-41d0-996b-00057bd1d66d.png' : '/lovable-uploads/4db99c2f-e77b-4024-bd6a-4e282e924598.png'
    }, {
      value: 'married-no-child',
      label: '已婚无娃',
      image: '/lovable-uploads/c8de23f8-f1b1-4884-a26d-9bc80f17cf67.png'
    }, {
      value: 'married-with-child',
      label: '已婚有娃',
      image: '/lovable-uploads/e6cf3de3-1131-4ac3-b6b3-005bcb86b93d.png'
    }];
    return baseOptions;
  };
  const maritalStatusOptions = getMaritalStatusOptions();
  const currentYear = new Date().getFullYear();
  const years = Array.from({
    length: 70
  }, (_, i) => currentYear - 18 - i);
  const childYears = Array.from({
    length: 30
  }, (_, i) => currentYear - i);
  const cities = ['北京', '上海', '广州', '深圳', '杭州', '苏州', '南京', '武汉', '成都', '重庆', '西安', '天津', '青岛', '大连', '厦门', '宁波', '长沙', '郑州', '济南', '福州', '东莞', '佛山', '无锡', '烟台'];
  const basicInfoComplete = birthYear && city && gender && maritalStatus;
  const needPartnerInfo = maritalStatus === 'married-no-child' || maritalStatus === 'married-with-child';
  const needChildInfo = maritalStatus === 'single-with-child' || maritalStatus === 'married-with-child';
  const partnerInfoComplete = !needPartnerInfo || partnerBirthYear;
  const childInfoComplete = !needChildInfo || children.length > 0;
  const canProceed = basicInfoComplete && partnerInfoComplete && childInfoComplete;
  const goToNext = () => {
    if (canProceed) {
      navigate('/optional-life', {
        state: {
          maritalStatus,
          personalInfo: {
            birthYear,
            city,
            gender,
            maritalStatus,
            partnerBirthYear,
            children
          }
        }
      });
    }
  };
  const handleBirthYearInput = (value: string) => {
    // 只允许数字输入，且限制为4位
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    setBirthYear(numericValue);
  };
  const handlePartnerBirthYearInput = (value: string) => {
    // 只允许数字输入，且限制为4位
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    setPartnerBirthYear(numericValue);
  };

  // 添加孩子
  const addChild = () => {
    if (children.length < 10) {
      const newChild = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        birthYear: ''
      };
      setChildren([...children, newChild]);
    }
  };

  // 删除孩子
  const removeChild = (childId: string) => {
    setChildren(children.filter(child => child.id !== childId));
  };

  // 更新孩子出生年份
  const updateChildBirthYear = (childId: string, value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    setChildren(children.map(child => child.id === childId ? {
      ...child,
      birthYear: numericValue
    } : child));
  };

  // 当出生年份改变时，同步更新伴侣出生年份的默认值
  useEffect(() => {
    if (birthYear && !partnerBirthYear && needPartnerInfo) {
      setPartnerBirthYear(birthYear);
    }
  }, [birthYear, needPartnerInfo, partnerBirthYear]);

  // 当需要孩子信息且当前没有孩子时，自动添加第一个孩子
  useEffect(() => {
    if (needChildInfo && children.length === 0) {
      const firstChild = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        birthYear: ''
      };
      setChildren([firstChild]);
    } else if (!needChildInfo && children.length > 0) {
      setChildren([]);
    }
  }, [needChildInfo]);
  return <div className="min-h-screen bg-[#FFFDF4] flex flex-col">
      
      {/* Subtle animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full animate-pulse bg-gradient-to-br from-[#FFEA95] to-transparent"></div>
        <div className="absolute top-40 right-8 w-16 h-16 rounded-full animate-pulse delay-1000 bg-gradient-to-br from-[#FFEA95] to-transparent"></div>
        <div className="absolute bottom-32 left-8 w-12 h-12 rounded-full animate-pulse delay-2000 bg-gradient-to-br from-[#FFEA95] to-transparent"></div>
      </div>

      <div className="relative h-full flex flex-col bg-white/90 backdrop-blur-xl flex-1">
        {/* 返回按钮 - 只在特定条件下显示 */}
        {showBackButton && <div className="absolute top-4 left-4 z-50">
            <Button variant="ghost" size="sm" onClick={handleBack} className="p-2 h-auto text-gray-600 hover:text-gray-800 bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-full shadow-md">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </div>}

        {/* Premium Header - 优化响应式布局 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#FFEA95]/20 via-white/60 to-[#FFEA95]/20">
          <div className="relative p-3 sm:p-4 text-center flex flex-col justify-center" style={{
          minHeight: '70px'
        }}>
            <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 tracking-tight break-words">
              您当前的状态？
            </h1>
            
            {/* 解释信息 */}
            <div className="mt-3 p-3 rounded-lg bg-[#FFEA95]/20 border border-[#FFEA95]/40">
              <div className="flex items-start gap-2">
                <Info className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-600 leading-relaxed text-left">为确保您的家庭开支梳理准确无遗漏，我们需要了解您以下基本情况，以便在您梳理过程中系统帮您进行查漏补缺。</p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Content Area - Mobile optimized spacing */}
        <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto bg-white pb-32 sm:pb-40 md:pb-48">
          <div className="space-y-4 sm:space-y-5 md:space-y-8">
            {/* 出生年份 - Mobile optimized */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <Label htmlFor="birthYear" className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 flex items-center">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-2 sm:mr-3" />
                出生年份
              </Label>
              <div className="flex gap-2 sm:gap-3">
                <div className="flex-1">
                  <Input id="birthYear" type="text" placeholder="例如：1990" value={birthYear} onChange={e => handleBirthYearInput(e.target.value)} className="h-10 sm:h-12 md:h-14 text-base sm:text-base border-2 border-gray-200 rounded-xl shadow-sm focus:border-[#FFEA95] focus:ring-2 focus:ring-[#FFEA95]/20" maxLength={4} />
                </div>
                <div className="w-20 sm:w-24 md:w-30">
                  <Select onValueChange={setBirthYear} value={birthYear}>
                    <SelectTrigger className="h-10 sm:h-12 md:h-14 text-base sm:text-base border-2 border-gray-200 rounded-xl shadow-sm focus:border-[#FFEA95] focus:ring-2 focus:ring-[#FFEA95]/20">
                      <SelectValue placeholder="选择" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => <SelectItem key={year} value={year.toString()}>
                          {year}年
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 城市 - Mobile optimized */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <Label htmlFor="city" className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 flex items-center">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-2 sm:mr-3" />
                所在城市
              </Label>
              <Select onValueChange={setCity}>
                <SelectTrigger className="h-10 sm:h-12 md:h-14 text-base sm:text-base border-2 border-gray-200 rounded-xl shadow-sm focus:border-[#FFEA95] focus:ring-2 focus:ring-[#FFEA95]/20">
                  <SelectValue placeholder="请选择您的所在城市" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(cityName => <SelectItem key={cityName} value={cityName}>
                      {cityName}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* 性别 - Mobile optimized */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <Label className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">性别</Label>
              <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4 sm:gap-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <RadioGroupItem value="male" id="male" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <Label htmlFor="male" className="text-sm sm:text-base font-medium">男</Label>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <RadioGroupItem value="female" id="female" className="w-4 h-4 sm:w-5 sm:h-5" />
                  <Label htmlFor="female" className="text-sm sm:text-base font-medium">女</Label>
                </div>
              </RadioGroup>
            </div>

            {/* 婚育状态 - Mobile optimized */}
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              <Label className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">婚育状态</Label>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {maritalStatusOptions.map(option => <div key={option.value} className={`relative cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${maritalStatus === option.value ? 'scale-105' : ''}`} onClick={() => setMaritalStatus(option.value)}>
                    <Card className={`overflow-hidden border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${maritalStatus === option.value ? 'border-[#FFEA95] bg-gradient-to-r from-[#FFEA95]/15 to-[#FFE585]/15 ring-2 ring-[#FFEA95]/60' : 'border-gray-200 hover:border-gray-300'}`}>
                      <CardContent className="p-0">
                        <div className="aspect-[4/2.5] md:aspect-[4/2.5] relative overflow-hidden">
                          <img src={option.image} alt={option.label} className="w-full h-full object-cover" />
                          {maritalStatus === option.value && <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5">
                              <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-[#FFEA95] rounded-full flex items-center justify-center shadow-lg">
                                <Check className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 text-gray-900" />
                              </div>
                            </div>}
                        </div>
                        <div className="p-1 sm:p-1.5 md:p-2 border-t border-gray-200">
                          <h4 className="text-xs font-semibold text-center text-gray-800">
                            {option.label}
                          </h4>
                        </div>
                      </CardContent>
                    </Card>
                  </div>)}
              </div>
            </div>

            {/* 伴侣出生年份 - Mobile optimized */}
            {needPartnerInfo && <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <Label htmlFor="partnerBirthYear" className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 flex items-center">
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-2 sm:mr-3" />
                  伴侣出生年份
                </Label>
                <div className="flex gap-2 sm:gap-3">
                  <div className="flex-1">
                    <Input id="partnerBirthYear" type="text" placeholder="例如：1990" value={partnerBirthYear} onChange={e => handlePartnerBirthYearInput(e.target.value)} className="h-10 sm:h-12 md:h-14 text-base sm:text-base border-2 border-gray-200 rounded-xl shadow-sm focus:border-[#FFEA95] focus:ring-2 focus:ring-[#FFEA95]/20" maxLength={4} />
                  </div>
                  <div className="w-20 sm:w-24 md:w-30">
                    <Select onValueChange={setPartnerBirthYear} value={partnerBirthYear}>
                      <SelectTrigger className="h-10 sm:h-12 md:h-14 text-base sm:text-base border-2 border-gray-200 rounded-xl shadow-sm focus:border-[#FFEA95] focus:ring-2 focus:ring-[#FFEA95]/20">
                        <SelectValue placeholder="选择" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => <SelectItem key={year} value={year.toString()}>
                            {year}年
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>}

            {/* 孩子出生年份 - Mobile optimized */}
            {needChildInfo && <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 flex items-center">
                    <Baby className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-2 sm:mr-3" />
                    孩子出生年份
                  </Label>
                  {children.length < 10 && <Button type="button" variant="outline" size="sm" onClick={addChild} className="h-8 px-3 text-xs border-[#FFEA95] text-gray-700 hover:bg-[#FFEA95]/10">
                      <Plus className="w-3 h-3 mr-1" />
                      添加孩子
                    </Button>}
                </div>

                {/* 孩子列表 */}
                <div className="space-y-3">
                  {children.map((child, index) => <div key={child.id} className="flex gap-2 sm:gap-3 items-center">
                      <div className="flex-1">
                        <Input type="text" placeholder="例如：2010" value={child.birthYear} onChange={e => updateChildBirthYear(child.id, e.target.value)} className="h-10 sm:h-12 md:h-14 text-base sm:text-base border-2 border-gray-200 rounded-xl shadow-sm focus:border-[#FFEA95] focus:ring-2 focus:ring-[#FFEA95]/20" maxLength={4} />
                      </div>
                      <div className="w-20 sm:w-24 md:w-30">
                        <Select onValueChange={value => updateChildBirthYear(child.id, value)} value={child.birthYear}>
                          <SelectTrigger className="h-10 sm:h-12 md:h-14 text-base sm:text-base border-2 border-gray-200 rounded-xl shadow-sm focus:border-[#FFEA95] focus:ring-2 focus:ring-[#FFEA95]/20">
                            <SelectValue placeholder="选择" />
                          </SelectTrigger>
                          <SelectContent>
                            {childYears.map(year => <SelectItem key={year} value={year.toString()}>
                                {year}年
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      {index > 0 && <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button type="button" variant="ghost" size="sm" className="h-10 w-10 p-0 text-red-500 hover:bg-red-50 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认删除</AlertDialogTitle>
                              <AlertDialogDescription>
                                您确定要删除这个孩子的信息吗？此操作无法撤销。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction onClick={() => removeChild(child.id)} className="bg-red-500 hover:bg-red-600">
                                删除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>}
                    </div>)}
                </div>
              </div>}
          </div>
        </div>

        {/* Enhanced Fixed Premium Bottom Section - Mobile optimized */}
        <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 bg-gradient-to-t from-white via-white to-white/95 border-t border-gray-100 shadow-2xl z-50 min-h-[80px] sm:min-h-[100px] md:min-h-[110px]">
          <div className="max-w-md mx-auto">
            <Button onClick={goToNext} disabled={!canProceed} className={`w-full py-2 sm:py-3 md:py-4 font-bold rounded-2xl text-sm sm:text-base md:text-lg shadow-xl transform transition-all duration-300 border-0 ${canProceed ? 'bg-gradient-to-r from-[#FFEA95] to-[#FFE585] hover:from-[#FFE585] hover:to-[#FFE075] text-gray-900 hover:scale-[1.02]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
              <span className="flex items-center justify-center gap-2 sm:gap-3">
                完成信息录入
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default PersonalInfoPage;