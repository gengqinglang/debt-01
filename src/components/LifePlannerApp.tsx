import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
interface LifePlannerAppProps {}
const LifePlannerApp: React.FC<LifePlannerAppProps> = () => {
  const [globalLifeLevel, setGlobalLifeLevel] = useState('基础');
  const [activeTab1, setActiveTab1] = useState('基础生活');
  const [activeTab2, setActiveTab2] = useState('结婚');

  // 第一模块的生活水平选项
  const lifeLevels = ['极简', '基础', '舒适', '富裕', '奢侈'];

  // 第一模块的tabs
  const module1Tabs = ['基础生活', '医疗', '养老', '教育', '大额消费'];

  // 第二模块的tabs
  const module2Tabs = ['结婚', '生育', '购房', '购车'];

  // 各科目的生活水平选项
  const subjectOptions = {
    '基础生活': ['菜市场自由', '超市自由', '山姆自由'],
    '医疗': ['社区医院', '三甲医院', '私立医院', '海外医疗'],
    '养老': ['居家养老', '社区养老', '高端养老院', '海外养老'],
    '教育': ['公立学校', '公立学校国际部', '私立学校', '海外学校'],
    '大额消费': ['节俭消费', '品质消费', '轻奢消费', '顶级消费']
  };
  const [selectedSubjectLevels, setSelectedSubjectLevels] = useState<{
    [key: string]: string;
  }>({
    '基础生活': '超市自由',
    '医疗': '三甲医院',
    '养老': '社区养老',
    '教育': '公立学校',
    '大额消费': '品质消费'
  });

  // 结婚标准选项
  const marriageStandards = ['简朴婚礼', '传统婚礼', '精致婚礼', '豪华婚礼'];
  const [selectedMarriageStandard, setSelectedMarriageStandard] = useState('传统婚礼');

  // 生育标准选项
  const birthStandards = ['基础生育', '舒适生育', '精致生育', '顶级生育'];
  const [selectedBirthStandard, setSelectedBirthStandard] = useState('舒适生育');

  // 第二模块的状态
  const [childrenCount, setChildrenCount] = useState(1);
  const [houseCount, setHouseCount] = useState(1);
  const [carCount, setCarCount] = useState(1);

  // 购房相关状态 - 改为数组，每套房都有自己的配置
  const [houseConfigs, setHouseConfigs] = useState<{
    type: string;
    motives: {
      [key: string]: boolean;
    };
  }[]>([{
    type: '2居室(70-120㎡)',
    motives: {
      '买套改善房': false,
      '买个学区房': false,
      '跨城置业': false,
      '给父母买房': false,
      '买个养老房': false,
      '投资买房': false,
      '给孩子买婚房': false
    }
  }]);

  // 购车相关状态
  const [carConfigs, setCarConfigs] = useState<{
    level: string;
  }[]>([{
    level: '经济型'
  }]);
  const houseTypes = ['1居室(40-70㎡)', '2居室(70-120㎡)', '3居室(100-200㎡)', '4居室(120-250㎡)'];
  const houseMotives = ['买套改善房', '买个学区房', '跨城置业', '给父母买房', '买个养老房', '投资买房', '给孩子买婚房'];
  const carLevels = ['经济型', '舒适型', '豪华型', '超豪华型'];

  // 更新房子数量
  const updateHouseCount = (newCount: number) => {
    setHouseCount(newCount);

    // 调整houseConfigs数组
    const newConfigs = [...houseConfigs];
    if (newCount > houseConfigs.length) {
      // 增加房子配置
      for (let i = houseConfigs.length; i < newCount; i++) {
        newConfigs.push({
          type: '2居室(70-120㎡)',
          motives: {
            '买套改善房': false,
            '买个学区房': false,
            '跨城置业': false,
            '给父母买房': false,
            '买个养老房': false,
            '投资买房': false,
            '给孩子买婚房': false
          }
        });
      }
    } else {
      // 减少房子配置
      newConfigs.splice(newCount);
    }
    setHouseConfigs(newConfigs);
  };

  // 更新指定房子的户型
  const updateHouseType = (houseIndex: number, type: string) => {
    const newConfigs = [...houseConfigs];
    newConfigs[houseIndex].type = type;
    setHouseConfigs(newConfigs);
  };

  // 切换指定房子的购房动机
  const toggleHouseMotive = (houseIndex: number, motive: string) => {
    const newConfigs = [...houseConfigs];
    newConfigs[houseIndex].motives[motive] = !newConfigs[houseIndex].motives[motive];
    setHouseConfigs(newConfigs);
  };

  // 更新车辆数量
  const updateCarCount = (newCount: number) => {
    setCarCount(newCount);

    // 调整carConfigs数组
    const newConfigs = [...carConfigs];
    if (newCount > carConfigs.length) {
      // 增加车辆配置
      for (let i = carConfigs.length; i < newCount; i++) {
        newConfigs.push({
          level: '经济型'
        });
      }
    } else {
      // 减少车辆配置
      newConfigs.splice(newCount);
    }
    setCarConfigs(newConfigs);
  };

  // 更新指定车辆的档次
  const updateCarLevel = (carIndex: number, level: string) => {
    const newConfigs = [...carConfigs];
    newConfigs[carIndex].level = level;
    setCarConfigs(newConfigs);
  };
  const getTabImage = (tab: string) => {
    const imageMap = {
      '基础生活': 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&h=200&fit=crop&crop=center',
      '医疗': 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=200&fit=crop&crop=center',
      '养老': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=200&fit=crop&crop=center',
      '教育': 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&h=200&fit=crop&crop=center',
      '大额消费': 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=300&h=200&fit=crop&crop=center',
      '结婚': 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=200&fit=crop&crop=center',
      '生育': 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&h=200&fit=crop&crop=center',
      '购房': 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=300&h=200&fit=crop&crop=center',
      '购车': 'https://images.unsplash.com/photo-1487252665478-49b61b47f302?w=300&h=200&fit=crop&crop=center'
    };
    return imageMap[tab] || '';
  };
  return <div className="w-[375px] h-[812px] mx-auto bg-lime overflow-y-auto">
      {/* 第一模块 */}
      <div className="p-4">
        <Card className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 mb-4 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">人生必选项</h2>
          
          {/* Tab导航 */}
          <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
            {module1Tabs.map(tab => <Button key={tab} onClick={() => setActiveTab1(tab)} className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap transition-all ${activeTab1 === tab ? 'bg-lime text-gray-800 shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} variant="ghost">
                {tab}
              </Button>)}
          </div>

          {/* Tab内容 */}
          <div className="bg-white rounded-xl p-4">
            <div className="mb-4 -mx-4">
              <img src={getTabImage(activeTab1)} alt={activeTab1} className="w-full h-32 object-cover rounded-lg" />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-2">{activeTab1}水平选择：</p>
              <div className="flex flex-wrap gap-2">
                {subjectOptions[activeTab1]?.map(option => <Button key={option} onClick={() => setSelectedSubjectLevels({
                ...selectedSubjectLevels,
                [activeTab1]: option
              })} className={`px-3 py-1 text-xs rounded-full transition-all ${selectedSubjectLevels[activeTab1] === option ? 'bg-yellow text-gray-800 shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} variant="ghost">
                    {option}
                  </Button>)}
              </div>
            </div>
          </div>
        </Card>

        {/* 第二模块 */}
        <Card className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">
            人生可选项
          </h2>
          
          {/* Tab导航 */}
          <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
            {module2Tabs.map(tab => <Button key={tab} onClick={() => setActiveTab2(tab)} className={`px-3 py-2 text-sm rounded-lg whitespace-nowrap transition-all ${activeTab2 === tab ? 'bg-lime text-gray-800 shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} variant="ghost">
                {tab}
              </Button>)}
          </div>

          {/* Tab内容 */}
          <div className="bg-white rounded-xl p-4">
            <div className="mb-4 -mx-4">
              <img src={getTabImage(activeTab2)} alt={activeTab2} className="w-full h-32 object-cover rounded-lg" />
            </div>
            
            {/* 根据不同tab显示不同内容 */}
            {activeTab2 === '结婚' && <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">结婚标准选择：</p>
                <div className="grid grid-cols-2 gap-2">
                  {marriageStandards.map(standard => <Button key={standard} onClick={() => setSelectedMarriageStandard(standard)} className={`px-3 py-2 text-sm rounded-lg transition-all ${selectedMarriageStandard === standard ? 'bg-yellow text-gray-800 shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} variant="ghost">
                      {standard}
                    </Button>)}
                </div>
              </div>}

            {activeTab2 === '生育' && <div className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">生育计划：</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600">孩子数量：</span>
                    <Button onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} className="w-8 h-8 p-0 bg-mint hover:bg-mint/80 text-gray-800">
                      -
                    </Button>
                    <span className="px-3 py-1 bg-yellow rounded-lg text-gray-800 font-medium">{childrenCount}个</span>
                    <Button onClick={() => setChildrenCount(Math.min(5, childrenCount + 1))} className="w-8 h-8 p-0 bg-mint hover:bg-mint/80 text-gray-800">
                      +
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">生育标准选择：</p>
                  <div className="grid grid-cols-2 gap-2">
                    {birthStandards.map(standard => <Button key={standard} onClick={() => setSelectedBirthStandard(standard)} className={`px-3 py-2 text-sm rounded-lg transition-all ${selectedBirthStandard === standard ? 'bg-yellow text-gray-800 shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`} variant="ghost">
                        {standard}
                      </Button>)}
                  </div>
                </div>
              </div>}

            {activeTab2 === '购房' && <div className="space-y-4">
                {/* 购房数量选择 */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-600">购房数量：</span>
                  <Button onClick={() => updateHouseCount(Math.max(1, houseCount - 1))} className="w-8 h-8 p-0 bg-mint hover:bg-mint/80 text-gray-800">
                    -
                  </Button>
                  <span className="px-3 py-1 bg-yellow rounded-lg text-gray-800 font-medium">{houseCount}套</span>
                  <Button onClick={() => updateHouseCount(Math.min(5, houseCount + 1))} className="w-8 h-8 p-0 bg-mint hover:bg-mint/80 text-gray-800">
                    +
                  </Button>
                </div>

                {/* 每套房的配置 */}
                <div className="space-y-4">
                  {houseConfigs.map((config, houseIndex) => <Card key={houseIndex} className="p-3 border border-gray-200 bg-gray-50">
                      <h4 className="text-sm font-medium text-gray-800 mb-3">第{houseIndex + 1}套房</h4>
                      
                      {/* 户型选择 */}
                      <div className="mb-3">
                        <p className="text-xs text-gray-600 mb-2">户型选择：</p>
                        <div className="grid grid-cols-2 gap-2">
                          {houseTypes.map(type => <Button key={type} onClick={() => updateHouseType(houseIndex, type)} className={`px-2 py-1 text-xs rounded-lg transition-all ${config.type === type ? 'bg-yellow text-gray-800 shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`} variant="ghost">
                              {type}
                            </Button>)}
                        </div>
                      </div>

                      {/* 购房动机选择 */}
                      <div>
                        <p className="text-xs text-gray-600 mb-2">购房动机：</p>
                        <div className="grid grid-cols-2 gap-2">
                          {houseMotives.map(motive => <Card key={motive} onClick={() => toggleHouseMotive(houseIndex, motive)} className={`p-2 cursor-pointer transition-all ${config.motives[motive] ? 'border-mint bg-mint/10 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-700">{motive}</span>
                                <div className={`w-3 h-3 rounded-full border-2 ${config.motives[motive] ? 'border-mint bg-mint' : 'border-gray-300'}`}>
                                  {config.motives[motive] && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                                </div>
                              </div>
                            </Card>)}
                        </div>
                      </div>
                    </Card>)}
                </div>
              </div>}

            {activeTab2 === '购车' && <div className="space-y-4">
                {/* 车辆数量选择 */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">我认为：</p>
                  <div className="grid grid-cols-1 gap-3">
                    <Card onClick={() => updateCarCount(1)} className={`p-3 cursor-pointer transition-all ${carCount === 1 ? 'border-mint bg-mint/10 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">家庭始终要有1辆车</span>
                        <div className={`w-4 h-4 rounded-full border-2 ${carCount === 1 ? 'border-mint bg-mint' : 'border-gray-300'}`}>
                          {carCount === 1 && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                        </div>
                      </div>
                    </Card>
                    
                    <Card onClick={() => updateCarCount(2)} className={`p-3 cursor-pointer transition-all ${carCount === 2 ? 'border-mint bg-mint/10 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">家庭始终要有2辆车</span>
                        <div className={`w-4 h-4 rounded-full border-2 ${carCount === 2 ? 'border-mint bg-mint' : 'border-gray-300'}`}>
                          {carCount === 2 && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* 每辆车的配置 */}
                <div className="space-y-4">
                  {carConfigs.map((config, carIndex) => <Card key={carIndex} className="p-3 border border-gray-200 bg-gray-50">
                      <h4 className="text-sm font-medium text-gray-800 mb-3">第{carIndex + 1}辆车</h4>
                      
                      {/* 车辆档次选择 */}
                      <div>
                        <p className="text-xs text-gray-600 mb-2">车辆档次：</p>
                        <div className="grid grid-cols-2 gap-2">
                          {carLevels.map(level => <Card key={level} onClick={() => updateCarLevel(carIndex, level)} className={`p-2 cursor-pointer transition-all ${config.level === level ? 'border-yellow bg-yellow/20 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-700">{level}</span>
                                <div className={`w-3 h-3 rounded-full border-2 ${config.level === level ? 'border-yellow bg-yellow' : 'border-gray-300'}`}>
                                  {config.level === level && <div className="w-full h-full rounded-full bg-white scale-50"></div>}
                                </div>
                              </div>
                            </Card>)}
                        </div>
                      </div>
                    </Card>)}
                </div>
              </div>}
          </div>
        </Card>
      </div>
    </div>;
};
export default LifePlannerApp;
