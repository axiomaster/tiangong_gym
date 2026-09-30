import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBaiduNetdiskStrings } from '../hooks/useBaiduNetdiskStrings';
import { useBaiduNetdiskGestures } from '../hooks/useBaiduNetdiskGestures';
import { useBaiduNetdiskStore } from '../state';
import { getFileIcon } from '../data';
import { IcSearch, IcStar } from '../res/icons';

export const FilesPage: React.FC = () => {
  const s = useBaiduNetdiskStrings();
  const { bindTap } = useBaiduNetdiskGestures();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const files = useBaiduNetdiskStore((st) => st.files);
  const toggleFileStar = useBaiduNetdiskStore((st) => st.toggleFileStar);

  const categories = [
    { id: 'all', label: s.files_cat_all },
    { id: 'transfer', label: s.files_cat_transfer },
    { id: 'album', label: s.files_cat_album },
    { id: 'scan', label: s.files_cat_scan },
    { id: 'starred', label: s.files_cat_starred },
  ];

  const displayedFiles = files.filter((f) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'starred') return f.starred;
    if (activeCategory === 'novel' || activeCategory === 'note' || activeCategory === 'drama') {
      return true;
    }
    return f.category === activeCategory;
  });

  return (
    <div
      className="flex flex-col h-full bg-[#F4F7FC] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Top Header & Search */}
      <div className="bg-white px-4 pt-2 pb-3 space-y-2.5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-[18px] font-bold text-[#191C24]">{s.files_title}</span>
          <div
            {...bindTap('home.search.open')}
            className="flex items-center gap-1.5 bg-[#F2F4F8] text-[#737987] px-3 py-1.5 rounded-full text-xs cursor-pointer active:opacity-80"
          >
            <IcSearch size={14} />
            <span>{s.search_placeholder}</span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <div
                key={cat.id}
                {...bindTap('files.category.switch', { params: { category: cat.id } })}
                className={`px-3.5 py-1 rounded-full text-xs font-medium cursor-pointer flex-shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#06A7FF] text-white font-semibold'
                    : 'bg-[#F2F4F8] text-[#737987]'
                }`}
              >
                {cat.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* File List */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2"
        data-scroll-container="files-list"
        data-scroll-direction="vertical"
      >
        {displayedFiles.map((file) => (
          <div
            key={file.id}
            className="bg-white rounded-2xl p-3 flex items-center justify-between gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
          >
            <div
              {...bindTap('file.detail.open', { params: { id: file.id } })}
              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer active:opacity-85"
            >
              <img
                src={getFileIcon(file)}
                alt={file.title}
                className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-semibold text-[#191C24] truncate">
                    {file.title}
                  </span>
                  {file.tag && (
                    <span className="text-[10px] text-[#06A7FF] bg-[#E8F6FF] px-1.5 py-0.5 rounded flex-shrink-0">
                      {file.tag}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#8B919E] mt-1 truncate">
                  {file.timeText} · {file.sizeText} · {file.subText}
                </div>
              </div>
            </div>

            <div
              {...bindTap(
                { kind: 'action', id: 'files.item.star.toggle' },
                {
                  params: { fileId: file.id, to: !file.starred },
                  onTrigger: () => toggleFileStar(file.id),
                },
              )}
              className="p-2 rounded-full cursor-pointer active:bg-gray-100 flex-shrink-0"
            >
              <IcStar
                size={18}
                className={file.starred ? 'text-[#FFB800]' : 'text-[#C0C6D4]'}
                fill={file.starred ? 'currentColor' : 'none'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
