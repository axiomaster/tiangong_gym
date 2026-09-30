import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useBaiduNetdiskStrings } from '../hooks/useBaiduNetdiskStrings';
import { useBaiduNetdiskGestures } from '../hooks/useBaiduNetdiskGestures';
import { useBaiduNetdiskStore } from '../state';
import { BAIDU_NETDISK_ASSETS, getFileIcon } from '../data';
import { IcCrown, IcSettings, IcCloud, IcShield } from '../res/icons';

export const MePage: React.FC = () => {
  const s = useBaiduNetdiskStrings();
  const { bindTap } = useBaiduNetdiskGestures();

  const { user, files } = useBaiduNetdiskStore(
    useShallow((st) => ({
      user: st.user,
      files: st.files,
    })),
  );

  const starredFiles = files.filter((f) => f.starred);

  return (
    <div
      className="flex flex-col h-full bg-[#F4F7FC] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      <div
        className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3"
        data-scroll-container="me-main"
        data-scroll-direction="vertical"
      >
        {/* User Info Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white p-1 shadow-xs overflow-hidden">
              <img
                src={BAIDU_NETDISK_ASSETS.tabKukuAi}
                alt={user.nickname}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[17px] font-bold text-[#191C24]">{user.nickname}</span>
                <span className="text-[10px] font-bold text-[#B87400] bg-[#FFF3D6] px-2 py-0.5 rounded-full">
                  {user.vipLevel}
                </span>
              </div>
              <div className="text-xs text-[#8B919E] mt-0.5">百度账号: {user.account}</div>
            </div>
          </div>
          <div className="p-2 text-[#737987]">
            <IcSettings size={20} />
          </div>
        </div>

        {/* Cloud Storage Progress Card */}
        <div className="bg-white rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#191C24]">
              <IcCloud size={16} className="text-[#06A7FF]" />
              <span>{s.me_cloud_space}</span>
            </div>
            <span className="text-[#737987] font-medium">
              {user.usedSpaceText} / {user.totalSpaceText}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#EEF2F8] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#06A7FF] to-[#36C5FF]"
              style={{ width: `${user.usedPercent}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="bg-white rounded-2xl py-3 px-2 grid grid-cols-4 text-center">
          <div>
            <div className="text-[16px] font-bold text-[#191C24]">{files.length}</div>
            <div className="text-[11px] text-[#737987] mt-0.5">{s.me_stat_files}</div>
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#191C24]">{starredFiles.length}</div>
            <div className="text-[11px] text-[#737987] mt-0.5">{s.me_stat_starred}</div>
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#06A7FF]">{user.transferCount}</div>
            <div className="text-[11px] text-[#737987] mt-0.5">{s.me_stat_transfer}</div>
          </div>
          <div>
            <div className="text-[16px] font-bold text-[#191C24]">{user.albumCount}</div>
            <div className="text-[11px] text-[#737987] mt-0.5">{s.me_stat_album}</div>
          </div>
        </div>

        {/* SVIP Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#232733] to-[#384054] p-3.5 text-[#F8DFA5] flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-sm font-bold">
              <IcCrown size={16} />
              <span>{s.me_svip_title}</span>
            </div>
            <div className="text-[11px] text-[#F8DFA5]/80">{s.me_svip_sub}</div>
          </div>
          <IcShield size={24} className="text-[#F8DFA5]" />
        </div>

        {/* Starred Files Quick Access */}
        {starredFiles.length > 0 && (
          <div className="bg-white rounded-2xl p-3.5 space-y-2.5">
            <div className="text-[14px] font-bold text-[#191C24]">{s.me_stat_starred}</div>
            <div className="space-y-2">
              {starredFiles.map((file) => (
                <div
                  key={file.id}
                  {...bindTap('file.detail.open', { params: { id: file.id } })}
                  className="p-2 rounded-xl bg-[#F4F7FC] flex items-center gap-2.5 cursor-pointer active:opacity-85"
                >
                  <img
                    src={getFileIcon(file)}
                    alt={file.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-[#191C24] truncate">
                      {file.title}
                    </div>
                    <div className="text-[11px] text-[#8B919E] mt-0.5">
                      {file.sizeText} · {file.locationPath}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
