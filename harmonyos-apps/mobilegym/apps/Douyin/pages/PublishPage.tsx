import React, { useState } from 'react';
import { useDouyinStrings } from '../hooks/useDouyinStrings';
import { useDouyinGestures } from '../hooks/useDouyinGestures';
import { useDouyinStore } from '../state';
import { DOUYIN_ASSETS } from '../data';
import { IcNavBack } from '../res/icons';

export const PublishPage: React.FC = () => {
  const s = useDouyinStrings();
  const { bindTap, bindBack } = useDouyinGestures();
  const [caption, setCaption] = useState('');
  const [publishedToast, setPublishedToast] = useState(false);
  const publishWork = useDouyinStore((st) => st.publishWork);

  return (
    <div
      className="flex flex-col h-full bg-[#12121A] text-white pt-10"
      data-status-bar-foreground="light"
      data-navigation-bar-foreground="light"
    >
      <div className="px-3 py-3 flex items-center justify-between border-b border-white/10">
        <div {...bindBack()} className="p-1 cursor-pointer text-white">
          <IcNavBack size={22} />
        </div>
        <span className="text-[16px] font-bold">{s.publish_title}</span>
        <div className="w-6" />
      </div>

      <div
        className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4"
        data-scroll-container="publish-main"
        data-scroll-direction="vertical"
      >
        {publishedToast && (
          <div className="bg-[#25F4EE]/15 border border-[#25F4EE]/40 text-[#25F4EE] text-xs font-medium px-3 py-2 rounded-lg">
            {s.publish_success_toast}
          </div>
        )}

        <div className="flex gap-3 bg-[#1C1C28] p-3.5 rounded-xl border border-white/10">
          <textarea
            value={caption}
            data-action="publish.caption.change"
            onChange={(e) => setCaption(e.target.value)}
            placeholder={s.publish_caption_placeholder}
            rows={4}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/40 outline-none resize-none"
          />
          <div className="w-20 h-28 rounded-lg overflow-hidden bg-black flex-shrink-0">
            <img
              src={DOUYIN_ASSETS.videoMain}
              alt="preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['#男装人的国庆八天乐', '#服装人日常', '#秋季穿搭'].map((tag) => (
            <span
              key={tag}
              onClick={() => setCaption((prev) => `${prev} ${tag}`.trim())}
              className="px-2.5 py-1 rounded-md bg-white/10 text-xs text-white/80 cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <div
          {...bindTap(
            { kind: 'action', id: 'publish.work.submit' },
            {
              onTrigger: () => {
                publishWork(caption);
                setPublishedToast(true);
                setCaption('');
              },
            },
          )}
          className="w-full py-3 rounded-xl bg-[#FE2C55] text-white text-sm font-bold flex items-center justify-center cursor-pointer active:opacity-90"
        >
          {s.publish_submit_btn}
        </div>
      </div>
    </div>
  );
};
