import React from 'react';
import { useBaiduNetdiskStrings } from '../hooks/useBaiduNetdiskStrings';
import { useBaiduNetdiskGestures } from '../hooks/useBaiduNetdiskGestures';
import { useBaiduNetdiskStore } from '../state';
import { IcUsers, IcFolder } from '../res/icons';

export const SharePage: React.FC = () => {
  const s = useBaiduNetdiskStrings();
  const { bindTap } = useBaiduNetdiskGestures();
  const shareGroups = useBaiduNetdiskStore((st) => st.shareGroups);
  const markAllSharesRead = useBaiduNetdiskStore((st) => st.markAllSharesRead);
  const markShareGroupRead = useBaiduNetdiskStore((st) => st.markShareGroupRead);

  return (
    <div
      className="flex flex-col h-full bg-[#F4F7FC] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <span className="text-[18px] font-bold text-[#191C24]">{s.share_title}</span>
        <div
          {...bindTap(
            { kind: 'action', id: 'share.all.read' },
            { onTrigger: () => markAllSharesRead() },
          )}
          className="text-xs text-[#737987] bg-[#F2F4F8] px-3 py-1 rounded-full cursor-pointer active:opacity-75"
        >
          {s.share_mark_all_read}
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2.5"
        data-scroll-container="share-list"
        data-scroll-direction="vertical"
      >
        {shareGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-2xl p-3.5 space-y-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
          >
            <div
              {...bindTap(
                { kind: 'action', id: 'share.group.read' },
                {
                  params: { id: group.id },
                  onTrigger: () => markShareGroupRead(group.id),
                },
              )}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#06A7FF] to-[#0077E6] text-white flex items-center justify-center flex-shrink-0">
                <IcUsers size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-[#191C24] truncate">
                    {group.name} ({group.memberCount})
                  </span>
                  <span className="text-[11px] text-[#9AA0AE] flex-shrink-0">{group.timeText}</span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-xs text-[#737987] truncate">{group.lastMessage}</p>
                  {group.unread > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#FF3B5C] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {group.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div
              {...bindTap('file.detail.open', { params: { id: group.linkedFileId } })}
              className="px-3 py-2 rounded-xl bg-[#F4F7FC] flex items-center justify-between text-xs cursor-pointer active:bg-[#E8F3FF]"
            >
              <div className="flex items-center gap-2 text-[#191C24] font-medium truncate">
                <IcFolder size={15} className="text-[#06A7FF] flex-shrink-0" />
                <span className="truncate">{group.lastMessage}</span>
              </div>
              <span className="text-[#06A7FF] font-semibold flex-shrink-0 ml-2">打开文件</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
