import React from 'react';
import {
  Search,
  Camera,
  ShoppingBag,
  MessageCircle,
  User,
  PlaySquare,
  Home,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  Share2,
  Store,
  Check,
  Trash2,
  Settings,
  Package,
  Truck,
  CreditCard,
  RotateCcw,
  Sparkles,
  Flame,
  Users,
} from 'lucide-react';

export const IcLauncher: React.FC<{ size?: number | string; className?: string }> = ({
  size = 28,
  className,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <text
      x="12"
      y="17.5"
      textAnchor="middle"
      fill="white"
      fontSize="16"
      fontWeight="900"
      fontFamily="PingFang SC, -apple-system, sans-serif"
    >
      拼
    </text>
  </svg>
);

export const IcSearch = Search;
export const IcCamera = Camera;
export const IcShoppingBag = ShoppingBag;
export const IcMessage = MessageCircle;
export const IcTabMe = User;
export const IcTabVideo = PlaySquare;
export const IcTabHome = Home;
export const IcNavBack = ChevronLeft;
export const IcNavForward = ChevronRight;
export const IcHeart = Heart;
export const IcStar = Star;
export const IcShare = Share2;
export const IcStore = Store;
export const IcCheck = Check;
export const IcTrash = Trash2;
export const IcSettings = Settings;
export const IcPackage = Package;
export const IcTruck = Truck;
export const IcCreditCard = CreditCard;
export const IcRefund = RotateCcw;
export const IcSparkles = Sparkles;
export const IcFlame = Flame;
export const IcUsers = Users;
