import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Settings } from 'lucide-react';

type DensityMode = 'comfortable' | 'cozy' | 'compact';

export const DensityToggle: React.FC = () => {
  const [density, setDensity] = useState<DensityMode>('comfortable');

  useEffect(() => {
    // Load saved density from localStorage
    const savedDensity = localStorage.getItem('density-mode') as DensityMode;
    if (savedDensity && ['comfortable', 'cozy', 'compact'].includes(savedDensity)) {
      setDensity(savedDensity);
      document.documentElement.setAttribute('data-density', savedDensity);
    }
  }, []);

  const handleDensityChange = (newDensity: DensityMode) => {
    setDensity(newDensity);
    document.documentElement.setAttribute('data-density', newDensity);
    localStorage.setItem('density-mode', newDensity);
  };

  const densityLabels = {
    comfortable: '舒适',
    cozy: '紧凑',
    compact: '超紧凑'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          {densityLabels[density]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(densityLabels).map(([mode, label]) => (
          <DropdownMenuItem
            key={mode}
            onClick={() => handleDensityChange(mode as DensityMode)}
            className={density === mode ? 'bg-accent' : ''}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};