import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useBaiduNetdiskStrings } from '../hooks/useBaiduNetdiskStrings';
import { useBaiduNetdiskGestures } from '../hooks/useBaiduNetdiskGestures';
import { useBaiduNetdiskStore } from '../state';
import { BAIDU_NETDISK_ASSETS, getMemoryImage } from '../data';
import { IcCamera, IcEye, IcEyeOff, IcNavForward } from '../res/icons';

export const HomePage: React.FC = () => {
  const s = useBaiduNetdiskStrings();
  const { bindTap } = useBaiduNetdiskGestures();

  const { files, memories, transferTab, hiddenSections } = useBaiduNetdiskStore(
    useShallow((st) => ({
      files: st.files,
      memories: st.memories,
      transferTab: st.transferTab,
      hiddenSections: st.hiddenSections,
    })),
  );
  const setTransferTab = useBaiduNetdiskStore((st) => st.setTransferTab);
  const toggleSectionPrivacy = useBaiduNetdiskStore((st) => st.toggleSectionPrivacy);

  const kingkongItems = [
    { id: 'album', label: s.kk_album, icon: BAIDU_NETDISK_ASSETS.kkAlbum, category: 'album' },
    { id: 'novel', label: s.kk_novel, icon: BAIDU_NETDISK_ASSETS.kkNovel, category: 'novel' },
    { id: 'scan', label: s.kk_scan, icon: BAIDU_NETDISK_ASSETS.kkScan, category: 'scan' },
    { id: 'note', label: s.kk_note, icon: BAIDU_NETDISK_ASSETS.kkNote, category: 'note' },
    { id: 'drama', label: s.kk_drama, icon: BAIDU_NETDISK_ASSETS.kkDrama, category: 'drama' },
  ];

  const recentFile = files.find((f) => f.id === 'file_cat_meme') || files[0];
  const transferFiles = files.filter((f) => f.category === 'transfer');

  const isRecentHidden = hiddenSections.includes('recent');
  const isTransferHidden = hiddenSections.includes('transfer');
  const isMemoryHidden = hiddenSections.includes('memory');

  return (
    <div
      className="flex flex-col h-full bg-gradient-to-b from-[#EEF5FF] via-[#F4F7FC] to-[#F4F7FC] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Top Search & Action Bar */}
      <div className="px-3.5 pt-1.5 pb-2.5 flex items-center gap-3">
        <div
          {...bindTap('home.search.open')}
          className="flex-1 h-[40px] rounded-full border-[1.8px] border-[#191C24] bg-white pl-2 pr-3 flex items-center justify-between cursor-pointer active:opacity-90"
        >
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={BAIDU_NETDISK_ASSETS.tabKukuAi}
              alt="AI"
              className="w-6 h-6 object-contain flex-shrink-0"
            />
            <span className="text-[14px] text-[#8B919E] font-medium truncate">
              {s.search_placeholder}
            </span>
          </div>
          <div className="relative flex items-center text-[#191C24] flex-shrink-0">
            <IcCamera size={20} strokeWidth={2} />
            <span className="text-[8px] font-extrabold -mt-2.5 ml-0.5">AI</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div
            {...bindTap('home.category.open', { params: { category: 'drama' } })}
            className="w-7 h-7 flex items-center justify-center cursor-pointer active:scale-95"
          >
            <img
              src={BAIDU_NETDISK_ASSETS.topTv}
              alt="TV"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div
            {...bindTap('home.category.open', { params: { category: 'transfer' } })}
            className="w-7 h-7 flex items-center justify-center cursor-pointer active:scale-95"
          >
            <img
              src={BAIDU_NETDISK_ASSETS.topTransfer}
              alt="Transfer"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div
            {...bindTap('home.category.open', { params: { category: 'all' } })}
            className="w-7 h-7 flex items-center justify-center cursor-pointer active:scale-95"
          >
            <img
              src={BAIDU_NETDISK_ASSETS.topPlus}
              alt="Add"
              className="w-6 h-6 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Main Scrollable Feed */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar px-3 pb-5 space-y-3"
        data-scroll-container="home-feed"
        data-scroll-direction="vertical"
      >
        {/* 5-Column Kingkong Row */}
        <div className="py-2.5 px-1 grid grid-cols-5 gap-2">
          {kingkongItems.map((item) => (
            <div
              key={item.id}
              {...bindTap('home.category.open', { params: { category: item.category } })}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-11 h-11 object-contain"
              />
              <span className="text-[12px] text-[#2B303A] font-medium mt-1.5 whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* 最近 Card */}
        <div className="bg-white rounded-[18px] p-3.5 shadow-[0_1px_6px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[16px] font-bold text-[#191C24]">{s.sec_recent}</span>
            <div className="flex items-center gap-3 text-[#9AA0AE]">
              <div
                {...bindTap(
                  { kind: 'action', id: 'home.privacy.toggle' },
                  {
                    params: { section: 'recent', to: !isRecentHidden },
                    onTrigger: () => toggleSectionPrivacy('recent'),
                  },
                )}
                className="cursor-pointer active:opacity-70"
              >
                {isRecentHidden ? <IcEyeOff size={17} /> : <IcEye size={17} />}
              </div>
              <div
                {...bindTap('home.category.open', { params: { category: 'all' } })}
                className="cursor-pointer active:opacity-70"
              >
                <IcNavForward size={18} />
              </div>
            </div>
          </div>

          {isRecentHidden ? (
            <div className="py-3 text-xs text-[#9AA0AE] text-center">{s.privacy_hidden_hint}</div>
          ) : (
            recentFile && (
              <div
                {...bindTap('file.detail.open', { params: { id: recentFile.id } })}
                className="flex items-center gap-3 cursor-pointer active:opacity-85"
              >
                <img
                  src={BAIDU_NETDISK_ASSETS.icLinkFile}
                  alt={recentFile.title}
                  className="w-12 h-12 rounded-xl object-contain flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-bold text-[#191C24] truncate">
                      {recentFile.title}
                    </span>
                    {recentFile.tag && (
                      <span className="text-[10px] text-[#8B919E] bg-[#F2F4F8] px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                        {recentFile.tag}
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-[#8B919E] mt-1">
                    {recentFile.timeText} {recentFile.subText}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* 转存记录 | 订阅更新 Card */}
        <div className="bg-white rounded-[18px] p-3.5 shadow-[0_1px_6px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-3">
              <span
                {...bindTap(
                  { kind: 'action', id: 'home.transfer.tab.switch' },
                  {
                    params: { tab: 'transfer' },
                    onTrigger: () => setTransferTab('transfer'),
                  },
                )}
                className={`cursor-pointer transition-colors ${
                  transferTab === 'transfer'
                    ? 'text-[16px] font-bold text-[#191C24]'
                    : 'text-[15px] font-medium text-[#8B919E]'
                }`}
              >
                {s.sec_transfer}
              </span>
              <span
                {...bindTap(
                  { kind: 'action', id: 'home.transfer.tab.switch' },
                  {
                    params: { tab: 'subscribe' },
                    onTrigger: () => setTransferTab('subscribe'),
                  },
                )}
                className={`cursor-pointer transition-colors ${
                  transferTab === 'subscribe'
                    ? 'text-[16px] font-bold text-[#191C24]'
                    : 'text-[15px] font-medium text-[#8B919E]'
                }`}
              >
                {s.sec_subscribe}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[#9AA0AE]">
              <div
                {...bindTap(
                  { kind: 'action', id: 'home.privacy.toggle' },
                  {
                    params: { section: 'transfer', to: !isTransferHidden },
                    onTrigger: () => toggleSectionPrivacy('transfer'),
                  },
                )}
                className="cursor-pointer active:opacity-70"
              >
                {isTransferHidden ? <IcEyeOff size={17} /> : <IcEye size={17} />}
              </div>
              <div
                {...bindTap('home.category.open', { params: { category: 'transfer' } })}
                className="cursor-pointer active:opacity-70"
              >
                <IcNavForward size={18} />
              </div>
            </div>
          </div>

          {isTransferHidden ? (
            <div className="py-3 text-xs text-[#9AA0AE] text-center">{s.privacy_hidden_hint}</div>
          ) : (
            <div
              className="flex items-center gap-4 overflow-x-auto no-scrollbar"
              data-scroll-container="home-transfers"
              data-scroll-direction="horizontal"
            >
              {transferFiles.map((file) => (
                <div
                  key={file.id}
                  {...bindTap('file.detail.open', { params: { id: file.id } })}
                  className="flex items-center gap-3 min-w-[240px] flex-shrink-0 cursor-pointer active:opacity-85"
                >
                  <img
                    src={BAIDU_NETDISK_ASSETS.icFolder}
                    alt={file.title}
                    className="w-12 h-12 rounded-xl object-contain flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-[15px] font-semibold text-[#191C24] truncate">
                      {file.title}
                    </div>
                    <div className="text-[12px] text-[#8B919E] mt-1 flex items-center">
                      <span>
                        {file.timeText} {file.subText}
                      </span>
                      <IcNavForward size={13} className="ml-0.5 text-[#9AA0AE]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 回忆 Card */}
        <div className="bg-white rounded-[18px] p-3.5 shadow-[0_1px_6px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[16px] font-bold text-[#191C24]">{s.sec_memory}</span>
            <div className="flex items-center gap-3 text-[#9AA0AE]">
              <div
                {...bindTap(
                  { kind: 'action', id: 'home.privacy.toggle' },
                  {
                    params: { section: 'memory', to: !isMemoryHidden },
                    onTrigger: () => toggleSectionPrivacy('memory'),
                  },
                )}
                className="cursor-pointer active:opacity-70"
              >
                {isMemoryHidden ? <IcEyeOff size={17} /> : <IcEye size={17} />}
              </div>
              <div
                {...bindTap('home.category.open', { params: { category: 'album' } })}
                className="cursor-pointer active:opacity-70"
              >
                <IcNavForward size={18} />
              </div>
            </div>
          </div>

          {isMemoryHidden ? (
            <div className="py-6 text-xs text-[#9AA0AE] text-center">{s.privacy_hidden_hint}</div>
          ) : (
            <div
              className="flex items-center gap-2.5 overflow-x-auto no-scrollbar"
              data-scroll-container="home-memories"
              data-scroll-direction="horizontal"
            >
              {memories.map((mem) => (
                <div
                  key={mem.id}
                  {...bindTap('file.detail.open', { params: { id: mem.linkedFileId } })}
                  className="relative w-[190px] h-[128px] rounded-[14px] overflow-hidden flex-shrink-0 cursor-pointer active:opacity-95"
                >
                  <img
                    src={getMemoryImage(mem.imageKey)}
                    alt={mem.title}
                    className="w-full h-full object-cover"
                  />
                  {mem.isNew && (
                    <span className="sr-only">{s.badge_new}</span>
                  )}
                  <div className="sr-only">
                    <span>{mem.title}</span>
                    <span>{mem.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
