import React from 'react';
import { useParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useBaiduNetdiskStrings } from '../hooks/useBaiduNetdiskStrings';
import { useBaiduNetdiskGestures } from '../hooks/useBaiduNetdiskGestures';
import { useBaiduNetdiskStore } from '../state';
import { getFileIcon } from '../data';
import {
  IcNavBack,
  IcStar,
  IcDownload,
  IcSparkles,
  IcCheckCircle,
  IcHardDrive,
} from '../res/icons';

export const FileDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const s = useBaiduNetdiskStrings();
  const { bindTap, bindBack } = useBaiduNetdiskGestures();

  const { files } = useBaiduNetdiskStore(
    useShallow((st) => ({
      files: st.files,
    })),
  );
  const toggleFileStar = useBaiduNetdiskStore((st) => st.toggleFileStar);
  const triggerFileDownload = useBaiduNetdiskStore((st) => st.triggerFileDownload);

  const file = files.find((f) => f.id === id) || files[0];

  return (
    <div
      className="flex flex-col h-full bg-[#F4F7FC] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Top Bar */}
      <div className="bg-white px-3 py-2.5 flex items-center justify-between border-b border-gray-100">
        <div
          {...bindBack()}
          className="w-8 h-8 rounded-full flex items-center justify-center active:bg-gray-100 cursor-pointer"
        >
          <IcNavBack size={22} className="text-[#191C24]" />
        </div>
        <span className="text-[16px] font-bold text-[#191C24]">{s.detail_title}</span>
        <div
          {...bindTap(
            { kind: 'action', id: 'file.star.toggle' },
            {
              params: { fileId: file.id, to: !file.starred },
              onTrigger: () => toggleFileStar(file.id),
            },
          )}
          className="w-8 h-8 rounded-full flex items-center justify-center active:bg-gray-100 cursor-pointer"
        >
          <IcStar
            size={20}
            className={file.starred ? 'text-[#FFB800]' : 'text-[#737987]'}
            fill={file.starred ? 'currentColor' : 'none'}
          />
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3.5"
        data-scroll-container="file-detail"
        data-scroll-direction="vertical"
      >
        {/* File Preview Hero Card */}
        <div className="bg-white rounded-2xl p-5 flex flex-col items-center text-center space-y-3 shadow-xs">
          <img
            src={getFileIcon(file)}
            alt={file.title}
            className="w-24 h-24 rounded-2xl object-cover shadow-xs"
          />
          <div className="space-y-1">
            <div className="text-[17px] font-bold text-[#191C24]">{file.title}</div>
            <div className="text-xs text-[#8B919E]">
              {file.sizeText} · {file.timeText}
            </div>
          </div>
        </div>

        {/* Metadata Card */}
        <div className="bg-white rounded-2xl p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-gray-100">
            <span className="text-[#8B919E]">{s.detail_size}</span>
            <span className="font-semibold text-[#191C24]">{file.sizeText}</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-gray-100">
            <span className="text-[#8B919E]">{s.detail_time}</span>
            <span className="font-semibold text-[#191C24]">{file.timeText}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[#8B919E]">{s.detail_location}</span>
            <span className="font-semibold text-[#06A7FF] flex items-center gap-1">
              <IcHardDrive size={13} />
              {file.locationPath}
            </span>
          </div>
        </div>

        {/* File Summary Card */}
        <div className="bg-white rounded-2xl p-4 space-y-2">
          <div className="text-xs font-bold text-[#191C24]">资源简介</div>
          <p className="text-xs text-[#737987] leading-relaxed">{file.description}</p>
        </div>

        {/* Kuku AI Deep Link Card */}
        <div
          {...bindTap('file.ai.analyze')}
          className="bg-gradient-to-r from-[#E8F5FF] to-[#F0F7FF] border border-[#BDE3FF] rounded-2xl p-3.5 flex items-center justify-between cursor-pointer active:opacity-90"
        >
          <div className="flex items-center gap-2 text-[#06A7FF] font-semibold text-xs">
            <IcSparkles size={16} />
            <span>{s.detail_ask_ai}</span>
          </div>
          <span className="text-xs font-bold text-[#06A7FF]">立即解读 →</span>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-100 px-4 py-2.5 flex items-center gap-3">
        <div
          {...bindTap(
            { kind: 'action', id: 'file.star.toggle' },
            {
              params: { fileId: file.id, to: !file.starred },
              onTrigger: () => toggleFileStar(file.id),
            },
          )}
          className="px-4 h-10 rounded-full border border-gray-200 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#191C24] cursor-pointer active:bg-gray-50"
        >
          <IcStar
            size={16}
            className={file.starred ? 'text-[#FFB800]' : 'text-[#737987]'}
            fill={file.starred ? 'currentColor' : 'none'}
          />
          <span>{file.starred ? s.detail_starred : s.detail_star}</span>
        </div>

        <div
          {...bindTap(
            { kind: 'action', id: 'file.download.trigger' },
            {
              params: { fileId: file.id },
              onTrigger: () => triggerFileDownload(file.id),
            },
          )}
          className="flex-1 h-10 rounded-full bg-[#06A7FF] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer active:opacity-90"
        >
          {file.downloaded ? <IcCheckCircle size={16} /> : <IcDownload size={16} />}
          <span>{file.downloaded ? s.detail_downloaded : s.detail_download}</span>
        </div>
      </div>
    </div>
  );
};
