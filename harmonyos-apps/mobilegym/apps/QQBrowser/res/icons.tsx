import React from 'react';
import {
  Search,
  ScanLine,
  Camera,
  Mic,
  FileText,
  BookOpen,
  Folder,
  User,
  Home,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  Bookmark,
  Share2,
  Plus,
  Trash2,
  Settings,
  Download,
  Clock,
  Sparkles,
  Flame,
  PlayCircle,
  Globe,
  Check,
  Cloud,
} from 'lucide-react';

export const IcLauncher: React.FC<{ size?: number | string; className?: string }> = ({
  size = 28,
  className,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="11.5" cy="11.5" r="6.5" stroke="white" strokeWidth="2.8" />
    <path
      d="M14.5 15.5C15.8 14.6 17.5 14.8 18.4 16.1C19.2 17.2 18.8 18.8 17.5 19.3H13.2C12.2 19.3 11.6 18.2 12.1 17.3C12.6 16.4 13.5 15.8 14.5 15.5Z"
      fill="white"
    />
  </svg>
);

export const IcSearch = Search;
export const IcScan = ScanLine;
export const IcCamera = Camera;
export const IcMic = Mic;
export const IcFeed = FileText;
export const IcNovel = BookOpen;
export const IcFiles = Folder;
export const IcMe = User;
export const IcHome = Home;
export const IcNavBack = ChevronLeft;
export const IcNavForward = ChevronRight;
export const IcHeart = Heart;
export const IcStar = Star;
export const IcBookmark = Bookmark;
export const IcShare = Share2;
export const IcPlus = Plus;
export const IcTrash = Trash2;
export const IcSettings = Settings;
export const IcDownload = Download;
export const IcClock = Clock;
export const IcSparkles = Sparkles;
export const IcFlame = Flame;
export const IcVideo = PlayCircle;
export const IcGlobe = Globe;
export const IcCheck = Check;
export const IcCloud = Cloud;
