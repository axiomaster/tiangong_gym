import React from 'react';
import {
  Search,
  Menu,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Star,
  Share2,
  Plus,
  Check,
  X,
  Send,
  Music,
  Video,
  Users,
  User,
  Sparkles,
  Flame,
  Maximize2,
  Minimize2,
  Settings,
} from 'lucide-react';

export const IcLauncher: React.FC<{ size?: number | string; className?: string }> = ({
  size = 28,
  className,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M14 4V14.5C14 16.7 12.2 18.5 10 18.5C7.8 18.5 6 16.7 6 14.5C6 12.3 7.8 10.5 10 10.5C10.4 10.5 10.8 10.6 11.2 10.7V8C10.8 7.9 10.4 7.8 10 7.8C6.3 7.8 3.3 10.8 3.3 14.5C3.3 18.2 6.3 21.2 10 21.2C13.7 21.2 16.7 18.2 16.7 14.5V9.1C18.1 10.1 19.7 10.7 21.5 10.7V7.8C18.6 7.8 16.2 5.7 15.9 3H14V4Z"
      fill="#25F4EE"
      transform="translate(-1, -0.8)"
    />
    <path
      d="M14 4V14.5C14 16.7 12.2 18.5 10 18.5C7.8 18.5 6 16.7 6 14.5C6 12.3 7.8 10.5 10 10.5C10.4 10.5 10.8 10.6 11.2 10.7V8C10.8 7.9 10.4 7.8 10 7.8C6.3 7.8 3.3 10.8 3.3 14.5C3.3 18.2 6.3 21.2 10 21.2C13.7 21.2 16.7 18.2 16.7 14.5V9.1C18.1 10.1 19.7 10.7 21.5 10.7V7.8C18.6 7.8 16.2 5.7 15.9 3H14V4Z"
      fill="#FE2C55"
      transform="translate(1, 0.8)"
    />
    <path
      d="M14 4V14.5C14 16.7 12.2 18.5 10 18.5C7.8 18.5 6 16.7 6 14.5C6 12.3 7.8 10.5 10 10.5C10.4 10.5 10.8 10.6 11.2 10.7V8C10.8 7.9 10.4 7.8 10 7.8C6.3 7.8 3.3 10.8 3.3 14.5C3.3 18.2 6.3 21.2 10 21.2C13.7 21.2 16.7 18.2 16.7 14.5V9.1C18.1 10.1 19.7 10.7 21.5 10.7V7.8C18.6 7.8 16.2 5.7 15.9 3H14V4Z"
      fill="#FFFFFF"
    />
  </svg>
);

export const IcSearch = Search;
export const IcMenu = Menu;
export const IcNavBack = ChevronLeft;
export const IcNavForward = ChevronRight;
export const IcHeart = Heart;
export const IcComment = MessageCircle;
export const IcStar = Star;
export const IcShare = Share2;
export const IcPlus = Plus;
export const IcCheck = Check;
export const IcClose = X;
export const IcSend = Send;
export const IcMusic = Music;
export const IcVideo = Video;
export const IcUsers = Users;
export const IcUser = User;
export const IcSparkles = Sparkles;
export const IcFlame = Flame;
export const IcMaximize = Maximize2;
export const IcMinimize = Minimize2;
export const IcSettings = Settings;
