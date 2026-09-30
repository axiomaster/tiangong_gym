export interface BaiduFileItem {
  id: string;
  title: string;
  category: 'recent' | 'transfer' | 'album' | 'novel' | 'scan' | 'note' | 'drama';
  fileType: 'link' | 'folder' | 'image' | 'doc' | 'video';
  tag?: string;
  timeText: string;
  subText: string;
  sizeText: string;
  locationPath: string;
  starred: boolean;
  downloaded: boolean;
  description: string;
}

export interface BaiduMemoryCard {
  id: string;
  title: string;
  subtitle: string;
  isNew: boolean;
  imageKey: 'memory_xian' | 'memory_ocean';
  linkedFileId: string;
}

export interface BaiduAiPrompt {
  id: string;
  title: string;
  reply: string;
}

export interface BaiduShareGroup {
  id: string;
  name: string;
  memberCount: number;
  lastMessage: string;
  timeText: string;
  unread: number;
  linkedFileId: string;
}

export interface BaiduUserProfile {
  nickname: string;
  account: string;
  vipLevel: string;
  usedSpaceText: string;
  totalSpaceText: string;
  usedPercent: number;
  transferCount: number;
  albumCount: number;
}
