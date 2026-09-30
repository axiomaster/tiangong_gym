import React from 'react';
import {
  ShoppingBag,
  Home,
  Grid,
  Compass,
  User,
  Search,
  ShoppingCart,
  Scan,
  ChevronRight,
  ArrowLeft,
  Share2,
  Heart,
  Star,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const IcLauncher: React.FC<{ size?: number | string; className?: string }> = ({ size = 28, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V9H19C19.5523 9 20 9.44772 20 10V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V10C4 9.44772 4.44772 9 5 9H7V8ZM9 9H15V8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8V9Z"
      fill="white"
    />
    <path
      d="M9.5 13L12 17.5L14.5 13"
      stroke="#C7000B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const IcTabHome = Home;
export const IcTabCategory = Grid;
export const IcTabDiscover = Compass;
export const IcTabMe = User;

export const IcSearch = Search;
export const IcCart = ShoppingCart;
export const IcScan = Scan;
export const IcChevronRight = ChevronRight;
export const IcBack = ArrowLeft;
export const IcShare = Share2;
export const IcHeart = Heart;
export const IcStar = Star;
export const IcCheck = Check;
export const IcShield = ShieldCheck;
export const IcTruck = Truck;
export const IcRotate = RotateCcw;
export const IcSparkles = Sparkles;
