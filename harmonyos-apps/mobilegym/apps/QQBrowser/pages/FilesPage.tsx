import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useQQBrowserStrings } from '../hooks/useQQBrowserStrings';
import { useQQBrowserGestures } from '../hooks/useQQBrowserGestures';
import { useQQBrowserStore } from '../state';
import { IcFiles, IcStar, IcTrash, IcCloud } from '../res/icons';

export const FilesPage: React.FC = () => {
  const s = useQQBrowserStrings();
  const { bindTap } = useQQBrowserGestures();

  const { files } = useQQBrowserStore(
    useShallow((st) => ({
      files: st.files,
    })),
  );
  const toggleFileStar = useQQBrowserStore((st) => st.toggleFileStar);
  const deleteFile = useQQBrowserStore((st) => st.deleteFile);

  return (
    <div
      className="flex flex-col h-full bg-[#F5F7FA] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IcFiles size={20} className="text-[#0066FF]" />
          <span className="text-[17px] font-bold text-[#11192D]">{s.files_title}</span>
        </div>
      </div>

      {/* Files List */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3"
        data-scroll-container="files-list"
        data-scroll-direction="vertical"
      >
        {/* Cloud Storage Banner */}
        <div className="bg-gradient-to-r from-[#0066FF] to-[#3385FF] rounded-2xl p-3.5 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-sm font-bold">
              <IcCloud size={18} />
              <span>腾讯微云 · 浏览器极速云盘</span>
            </div>
            <div className="text-xs text-white/85">{s.files_storage_used}</div>
          </div>
        </div>

        {/* File Items */}
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-2xl p-3.5 flex items-center justify-between gap-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-[#11192D] truncate">
                  {file.name}
                </div>
                <div className="text-xs text-[#8A94A6] mt-1">
                  {file.sizeText} · {file.timeText}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  {...bindTap(
                    { kind: 'action', id: 'files.item.star.toggle' },
                    {
                      params: { fileId: file.id, to: !file.starred },
                      onTrigger: () => toggleFileStar(file.id),
                    },
                  )}
                  className="p-2 rounded-full hover:bg-gray-50 cursor-pointer active:scale-95"
                >
                  <IcStar
                    size={18}
                    className={file.starred ? 'text-[#FF9500]' : 'text-[#8A94A6]'}
                    fill={file.starred ? 'currentColor' : 'none'}
                  />
                </div>
                <div
                  {...bindTap(
                    { kind: 'action', id: 'files.item.delete' },
                    {
                      params: { fileId: file.id },
                      onTrigger: () => deleteFile(file.id),
                    },
                  )}
                  className="p-2 rounded-full hover:bg-gray-50 text-[#8A94A6] cursor-pointer active:scale-95"
                >
                  <IcTrash size={17} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
