
import React from 'react';
import { SquareCode, BarChart3, Dna } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuggestionCardProps {
  icon: 'code' | 'chart' | 'science';
  title: string;
  onClick: () => void;
  className?: string;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ 
  icon, 
  title, 
  onClick,
  className
}) => {
  const Icon = {
    'code': SquareCode,
    'chart': BarChart3,
    'science': Dna
  }[icon];

  return (
    <button
      onClick={onClick}
      className={cn(
        "glass-card p-4 rounded-xl text-left w-full transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]",
        "flex flex-col items-center text-center",
        className
      )}
    >
      <div className="mb-3">
        <Icon className="w-6 h-6 text-accent" />
      </div>
      <p className="text-sm">{title}</p>
    </button>
  );
};

export default SuggestionCard;
