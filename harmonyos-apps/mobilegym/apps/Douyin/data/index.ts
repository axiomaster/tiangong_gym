import defaults from './defaults.json';
import type {
  DouyinVideoItem,
  DouyinFriendItem,
  DouyinMessageItem,
  DouyinUserProfile,
} from '../types';

import imgVideoMain from '../assets/images/video_main.png';
import imgIcFullscreen from '../assets/images/ic_fullscreen.png';
import imgAvatarAuthor from '../assets/images/avatar_author.png';
import imgIcFollowPlus from '../assets/images/ic_follow_plus.png';
import imgIcLike from '../assets/images/ic_like.png';
import imgIcComment from '../assets/images/ic_comment.png';
import imgIcStar from '../assets/images/ic_star.png';
import imgIcShare from '../assets/images/ic_share.png';
import imgMusicDisc from '../assets/images/music_disc.png';
import imgTopMenu from '../assets/images/top_menu.png';
import imgRedPacket from '../assets/images/red_packet.png';
import imgTopSearch from '../assets/images/top_search.png';
import imgTabPublish from '../assets/images/tab_publish.png';

export * from '../types';

export const DOUYIN_ASSETS = {
  videoMain: imgVideoMain,
  icFullscreen: imgIcFullscreen,
  avatarAuthor: imgAvatarAuthor,
  icFollowPlus: imgIcFollowPlus,
  icLike: imgIcLike,
  icComment: imgIcComment,
  icStar: imgIcStar,
  icShare: imgIcShare,
  musicDisc: imgMusicDisc,
  topMenu: imgTopMenu,
  redPacket: imgRedPacket,
  topSearch: imgTopSearch,
  tabPublish: imgTabPublish,
} as const;

export const DOUYIN_CONFIG = {
  user: defaults.user as DouyinUserProfile,
  mainVideo: defaults.mainVideo as DouyinVideoItem,
  friends: defaults.friends as DouyinFriendItem[],
  messages: defaults.messages as DouyinMessageItem[],
  hotSearches: defaults.hotSearches as string[],
} as const;
