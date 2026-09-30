export interface QQBrowserArticle {
  id: string;
  title: string;
  source: string;
  timeText: string;
  category: 'hot' | 'video' | 'tech';
  summary: string;
  content: string[];
  readCountText: string;
  likes: number;
  liked: boolean;
  bookmarked: boolean;
  hotRank: number;
  comments: Array<{
    id: string;
    user: string;
    text: string;
    timeText: string;
  }>;
}

export interface QQBrowserNovel {
  id: string;
  title: string;
  author: string;
  category: string;
  score: string;
  latestChapter: string;
  progressText: string;
  inBookshelf: boolean;
  linkedArticleId: string;
}

export interface QQBrowserFileItem {
  id: string;
  name: string;
  sizeText: string;
  timeText: string;
  type: 'doc' | 'media';
  starred: boolean;
}

export interface QQBrowserUserProfile {
  nickname: string;
  qqAccount: string;
  cloudUsedText: string;
  openTabsCount: number;
  historyCount: number;
  downloadsCount: number;
}
