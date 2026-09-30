import React from 'react';
import {
  Search,
  Camera,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Star,
  Download,
  Share2,
  Folder,
  FileText,
  Sparkles,
  Trash2,
  CheckCircle2,
  Users,
  Cloud,
  HardDrive,
  Crown,
  Settings,
  ShieldCheck,
} from 'lucide-react';

export const IcLauncher: React.FC<{ size?: number | string; className?: string }> = ({
  size = 28,
  className,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="9.5" cy="13.5" r="4" stroke="white" strokeWidth="2.2" />
    <circle cx="15" cy="9.5" r="3.2" stroke="white" strokeWidth="2.2" />
    <circle cx="15.5" cy="15.5" r="2.6" stroke="white" strokeWidth="2.2" />
  </svg>
);

export const IcSearch = Search;
export const IcCamera = Camera;
export const IcEye = Eye;
export const IcEyeOff = EyeOff;
export const IcNavBack = ChevronLeft;
export const IcNavForward = ChevronRight;
export const IcStar = Star;
export const IcDownload = Download;
export const IcShare = Share2;
export const IcFolder = Folder;
export const IcFileText = FileText;
export const IcSparkles = Sparkles;
export const IcTrash = Trash2;
export const IcCheckCircle = CheckCircle2;
export const IcUsers = Users;
export const IcCloud = Cloud;
export const IcHardDrive = HardDrive;
export const IcCrown = Crown;
export const IcSettings = Settings;
export const IcShield = ShieldCheck;
