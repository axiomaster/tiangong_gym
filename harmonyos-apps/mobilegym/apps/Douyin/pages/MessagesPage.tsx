import React from 'react';
import { useDouyinStrings } from '../hooks/useDouyinStrings';
import { useDouyinGestures } from '../hooks/useDouyinGestures';
import { useDouyinStore } from '../state';
import { DOUYIN_ASSETS } from '../data';

export const MessagesPage: React.FC = () => {
  const s = useDouyinStrings();
  const { bindTap } = useDouyinGestures();
  const messages = useDouyinStore((st) => st.messages);
  const markAllMessagesRead = useDouyinStore((st) => st.markAllMessagesRead);
  const markMessageRead = useDouyinStore((st) => st.markMessageRead);

  return (
    <div
      className="flex flex-col h-full bg-[#12121A] text-white pt-10"
      data-status-bar-foreground="light"
      data-navigation-bar-foreground="light"
    >
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
        <span className="text-[17px] font-bold">{s.messages_title}</span>
        <div
          {...bindTap(
            { kind: 'action', id: 'messages.all.read' },
            { onTrigger: () => markAllMessagesRead() },
          )}
          className="text-xs text-white/70 bg-white/10 px-2.5 py-1 rounded-full cursor-pointer active:opacity-80"
        >
          {s.messages_mark_read}
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2.5"
        data-scroll-container="messages-list"
        data-scroll-direction="vertical"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            {...bindTap(
              { kind: 'action', id: 'messages.item.read' },
              { params: { id: msg.id }, onTrigger: () => markMessageRead(msg.id) },
            )}
            className="bg-[#1C1C28] rounded-xl p-3.5 flex items-center gap-3 cursor-pointer active:bg-white/10"
          >
            <img
              src={DOUYIN_ASSETS.avatarAuthor}
              alt={msg.sender}
              className="w-11 h-11 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-semibold text-white truncate">{msg.sender}</span>
                <span className="text-[11px] text-white/50 flex-shrink-0">{msg.timeText}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-xs text-white/70 truncate">{msg.preview}</p>
                {msg.unread > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#FE2C55] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {msg.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
