import React from 'react';
import {
  Search,
  ScanLine,
  ShoppingCart,
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
  Plus,
  Minus,
  Trash2,
  Settings,
  Package,
  Truck,
  CreditCard,
  RotateCcw,
  Sparkles,
  MapPin,
} from 'lucide-react';

export const IcLauncher: React.FC<{ size?: number | string; className?: string }> = ({
  size = 28,
  className,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <text
      x="12"
      y="17"
      textAnchor="middle"
      fill="#111111"
      fontSize="12"
      fontWeight="900"
      fontFamily="PingFang SC, -apple-system, sans-serif"
    >
      美团
    </text>
  </svg>
);

export const IcSearch = Search;
export const IcScan = ScanLine;
export const IcTabCart = ShoppingCart;
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
export const IcPlus = Plus;
export const IcMinus = Minus;
export const IcTrash = Trash2;
export const IcSettings = Settings;
export const IcPackage = Package;
export const IcTruck = Truck;
export const IcCreditCard = CreditCard;
export const IcRefund = RotateCcw;
export const IcSparkles = Sparkles;
export const IcMapPin = MapPin;
