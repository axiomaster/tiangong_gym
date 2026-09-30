import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useQQBrowserStrings } from '../hooks/useQQBrowserStrings';
import { useQQBrowserGestures } from '../hooks/useQQBrowserGestures';
import { useQQBrowserStore } from '../state';
import { IcNovel, IcCheck, IcPlus } from '../res/icons';

export const NovelPage: React.FC = () => {
  const s = useQQBrowserStrings();
  const { bindTap } = useQQBrowserGestures();

  const { novels } = useQQBrowserStore(
    useShallow((st) => ({
      novels: st.novels,
    })),
  );
  const toggleNovelBookshelf = useQQBrowserStore((st) => st.toggleNovelBookshelf);

  return (
    <div
      className="flex flex-col h-full bg-[#F5F7FA] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IcNovel size={20} className="text-[#0066FF]" />
          <span className="text-[17px] font-bold text-[#11192D]">{s.novel_title}</span>
        </div>
        <span className="text-xs text-[#0066FF] font-medium bg-[#EBF2FF] px-2.5 py-1 rounded-full">
          {s.novel_shelf_tab} ({novels.filter((n) => n.inBookshelf).length})
        </span>
      </div>

      {/* Novel List */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2.5"
        data-scroll-container="novel-list"
        data-scroll-direction="vertical"
      >
        {novels.map((novel) => (
          <div
            key={novel.id}
            className="bg-white rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
          >
            <div
              {...bindTap('home.article.open', { params: { id: novel.linkedArticleId } })}
              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
            >
              <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-[#0066FF] to-[#4D94FF] text-white flex flex-col items-center justify-center p-1.5 flex-shrink-0 shadow-xs">
                <IcNovel size={18} />
                <span className="text-[10px] font-bold mt-1">{novel.score}</span>
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-bold text-[#11192D] truncate">
                    {novel.title}
                  </span>
                </div>
                <div className="text-xs text-[#50607A]">
                  {novel.author} · {novel.category}
                </div>
                <div className="text-xs text-[#8A94A6] truncate">
                  {novel.latestChapter} · {novel.progressText}
                </div>
              </div>
            </div>

            <div
              {...bindTap(
                { kind: 'action', id: 'novel.bookshelf.toggle' },
                {
                  params: { novelId: novel.id, to: !novel.inBookshelf },
                  onTrigger: () => toggleNovelBookshelf(novel.id),
                },
              )}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 cursor-pointer flex-shrink-0 ${
                novel.inBookshelf
                  ? 'bg-gray-100 text-[#50607A]'
                  : 'bg-[#0066FF] text-white'
              }`}
            >
              {novel.inBookshelf ? <IcCheck size={13} /> : <IcPlus size={13} />}
              <span>{novel.inBookshelf ? s.novel_in_shelf : s.novel_add_shelf}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
