import React from 'react';
import { usePinduoduoStrings } from '../hooks/usePinduoduoStrings';
import { usePinduoduoGestures } from '../hooks/usePinduoduoGestures';
import { usePinduoduoStore } from '../state';
import { IcMessage } from '../res/icons';

export const ChatPage: React.FC = () => {
  const s = usePinduoduoStrings();
  const { bindTap } = usePinduoduoGestures();
  const chats = usePinduoduoStore((st) => st.chats);
  const markAllChatsRead = usePinduoduoStore((st) => st.markAllChatsRead);
  const markChatRead = usePinduoduoStore((st) => st.markChatRead);

  return (
    <div
      className="flex flex-col h-full bg-[#F4F4F6] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <span className="text-[18px] font-bold text-[#151516]">{s.chat_title}</span>
        <div
          {...bindTap(
            { kind: 'action', id: 'chat.all.read' },
            { onTrigger: () => markAllChatsRead() },
          )}
          className="text-xs text-[#58595B] bg-gray-100 px-2.5 py-1 rounded-full cursor-pointer active:opacity-75"
        >
          {s.chat_all_read}
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto no-scrollbar p-2.5 space-y-2"
        data-scroll-container="chat-list"
        data-scroll-direction="vertical"
      >
        {chats.map((chat) => (
          <div
            key={chat.id}
            {...bindTap(
              { kind: 'action', id: 'chat.item.read' },
              { params: { id: chat.id }, onTrigger: () => markChatRead(chat.id) },
            )}
            className="bg-white rounded-xl p-3.5 flex items-center gap-3 cursor-pointer active:bg-gray-50 transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF5338] to-[#E02E24] flex items-center justify-center text-white flex-shrink-0">
              <IcMessage size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[15px] font-semibold text-[#151516] truncate">
                    {chat.sender}
                  </span>
                  <span className="text-[10px] text-[#E02E24] bg-[#FFF0EE] px-1.5 py-0.5 rounded">
                    {chat.tag}
                  </span>
                </div>
                <span className="text-[11px] text-[#9C9C9C] flex-shrink-0">{chat.timeText}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-[13px] text-[#58595B] truncate">{chat.preview}</p>
                {chat.unread > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#E02E24] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {chat.unread}
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
