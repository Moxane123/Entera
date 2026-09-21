import React from 'react';
import {
  Cpu,
  Settings,
  Wrench,
  HardHat,
  Scissors,
  Sparkles,
  Palette,
  Briefcase,
  Megaphone,
  CalendarCheck,
  GraduationCap,
  DollarSign,
  Sprout,
  Car,
  Utensils,
  Compass,
  Layers,
  Award,
  CheckCircle2,
  ShieldCheck,
  FolderPlus,
  Tag
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-4 h-4' }) => {
  switch (name?.toLowerCase()) {
    case 'cpu':
      return <Cpu className={className} />;
    case 'settings':
      return <Settings className={className} />;
    case 'wrench':
      return <Wrench className={className} />;
    case 'hardhat':
      return <HardHat className={className} />;
    case 'scissors':
      return <Scissors className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'palette':
      return <Palette className={className} />;
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'megaphone':
      return <Megaphone className={className} />;
    case 'calendarcheck':
      return <CalendarCheck className={className} />;
    case 'graduationcap':
      return <GraduationCap className={className} />;
    case 'dollarsign':
      return <DollarSign className={className} />;
    case 'sprout':
      return <Sprout className={className} />;
    case 'car':
      return <Car className={className} />;
    case 'utensils':
      return <Utensils className={className} />;
    case 'compass':
      return <Compass className={className} />;
    case 'award':
      return <Award className={className} />;
    case 'folderplus':
      return <FolderPlus className={className} />;
    case 'shieldcheck':
      return <ShieldCheck className={className} />;
    default:
      return <Tag className={className} />;
  }
};
