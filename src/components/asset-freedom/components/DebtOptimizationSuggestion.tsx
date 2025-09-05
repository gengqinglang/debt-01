import React, { useState, useMemo } from 'react';
import { Banknote, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 可自由支配金额数据接口
interface DisposableWealthData {
  age: number;
  year: string;
  amount: number;
}

export const DebtOptimizationSuggestion: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCell, setSelectedCell] = useState<DisposableWealthData | null>(null);

  // 可自由支配金额数据生成
  const disposableWealthData = useMemo(() => {
    const data: DisposableWealthData[] = [];
    
    for (let age = 30; age <= 85; age++) {
      // 模拟现金流充沛情况下的可自由支配金额
      let amount = 0;
      
      if (age >= 35 && age <= 65) {
        // 35-65岁期间有充沛现金流，可用于债务优化
        const peak = 50; // 50岁达到峰值
        const maxAmount = 20; // 最大20万可自由支配
        
        if (age <= peak) {
          amount = Math.round((age - 35) / (peak - 35) * maxAmount);
        } else {
          amount = Math.round(maxAmount - (age - peak) / (65 - peak) * maxAmount);
        }
        
        // 使用固定的伪随机变化，基于年龄生成固定值
        const pseudoRandom = (age * 17 + 23) % 7 - 3;
        amount = Math.max(0, amount + pseudoRandom);
      }
      
      data.push({
        age,
        year: `${2024 - 30 + age}`,
        amount
      });
    }
    
    return data;
  }, []);

  const maxDisposableAmount = Math.max(...disposableWealthData.map(d => d.amount));

  // 根据金额计算颜色深度
  const getDisposableColorIntensity = (amount: number) => {
    if (amount === 0) return 'bg-white border-gray-200';
    
    const intensity = amount / maxDisposableAmount;
    if (intensity <= 0.2) return 'bg-[#CAF4F7]/20 border-[#CAF4F7]/30';
    if (intensity <= 0.4) return 'bg-[#CAF4F7]/40 border-[#CAF4F7]/50';
    if (intensity <= 0.6) return 'bg-[#CAF4F7]/60 border-[#CAF4F7]/70';
    if (intensity <= 0.8) return 'bg-[#CAF4F7]/80 border-[#CAF4F7]/90';
    return 'bg-[#4A90A4] border-[#4A90A4]';
  };

  // 处理热力图单元格点击
  const handleCellClick = (cellData: DisposableWealthData) => {
    setSelectedCell(selectedCell?.age === cellData.age ? null : cellData);
  };

  // 处理录入负债信息按钮点击
  const handleDebtInfoEntry = () => {
    navigate('/debt-info-entry');
  };

  // 将数据分割成网格行（每行14年）
  const dataRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < disposableWealthData.length; i += 14) {
      rows.push(disposableWealthData.slice(i, i + 14));
    }
    return rows;
  }, [disposableWealthData]);

  return (
    <div className="bg-white border rounded-lg p-4 mt-4" style={{ borderColor: '#01BCD6' }}>
      {/* 标题 */}
      <div className="mb-4">
        <div className="mb-2">
          <h4 className="text-base font-bold text-gray-800">您有债务优化机会，请关注</h4>
        </div>
        
        {/* 现金流充沛说明 */}
        <div className="rounded-lg p-3 border" style={{ backgroundColor: 'rgba(202, 244, 247, 0.2)', borderColor: '#B3EBEF' }}>
          <div className="flex items-start space-x-2">
            <Banknote className="w-4 h-4 mt-0.5" style={{ color: '#01BCD6' }} />
            <div className="text-sm text-gray-700">
              <span className="font-medium text-gray-800">鉴于您的现金流充沛</span>，您有债务优化机会，
              <span className="font-medium" style={{ color: '#01BCD6' }}>优化得当，可节省利息支出</span>
            </div>
          </div>
        </div>
      </div>

      {/* 随便花的钱热力图 */}
      <div className="mb-6">
        <div className="mb-3">
          <h5 className="text-sm font-medium text-gray-700 mb-2">可以随便花的钱</h5>
        </div>
        
        {/* 热力图网格 */}
        <div className="space-y-1">
          {dataRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex space-x-1">
              {row.map((cellData, cellIndex) => {
                const isFirst = cellData.age === 30;
                const isLast = cellData.age === 85;
                const isSelected = selectedCell?.age === cellData.age;
                
                return (
                  <div
                    key={cellData.age}
                    className={`
                      w-6 h-6 border cursor-pointer transition-all duration-200 hover:scale-110 relative flex items-center justify-center
                      ${getDisposableColorIntensity(cellData.amount)}
                      ${isSelected ? 'ring-2 ring-[#01BCD6]' : ''}
                    `}
                    onClick={() => handleCellClick(cellData)}
                    title={`${cellData.age}岁: ${cellData.amount}万元`}
                  >
                    {isFirst && (
                      <span className="text-xs text-gray-800 font-bold z-10">
                        30
                      </span>
                    )}
                    {isLast && (
                      <span className="text-xs text-gray-800 font-bold z-10">
                        85
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 图例 */}
        <div className="flex items-center space-x-2 text-xs text-gray-600 mt-4">
          <span>金额:</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-white border border-gray-200"></div>
            <span>0万</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#CAF4F7]/40"></div>
            <span>较少</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#4A90A4]"></div>
            <span>较多</span>
          </div>
        </div>

        {/* 选中单元格详情 */}
        {selectedCell && (
          <div className="mt-4 p-3 rounded-lg border" style={{ backgroundColor: 'rgba(202, 244, 247, 0.3)', borderColor: '#B3EBEF' }}>
            <div className="text-sm">
              <div className="font-medium text-gray-800 mb-1">
                {selectedCell.age}岁（{selectedCell.year}年）
              </div>
              <div className="text-gray-600">
                可随便花的钱：<span className="font-medium" style={{ color: '#01BCD6' }}>{selectedCell.amount}万元</span>
              </div>
        </div>
      </div>
        )}
      </div>

      {/* 建议录入负债信息 */}
      <div className="rounded-lg p-4 border" style={{ backgroundColor: 'rgba(202, 244, 247, 0.1)', borderColor: '#B3EBEF' }}>
        <div className="flex items-start space-x-3">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800 mb-2">
              精准债务优化建议
            </div>
            <div className="text-sm text-gray-600 mb-3">
              建议您录入详细的负债信息，获取精准债务优化建议
            </div>
            <button 
              onClick={handleDebtInfoEntry}
              className="w-full bg-white hover:bg-gray-50 text-[#01BCD6] border-[#01BCD6] font-medium text-sm py-2.5 px-4 rounded-lg border transition-all duration-200 hover:shadow-md"
            >
              录入详细负债信息
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};