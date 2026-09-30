import React from 'react';
import { useTaobaoStrings } from '../hooks/useTaobaoStrings';
import { useTaobaoGestures } from '../hooks/useTaobaoGestures';
import { useTaobaoStore } from '../state';
import { IcMessage } from '../res/icons';

export const MessagesPage: React.FC = () => {
  const s = useTaobaoStrings();
  const { bindTap } = useTaobaoGestures();
  const messages = useTaobaoStore((st) => st.messages);
  const markAllMessagesRead = useTaobaoStore((st) => st.markAllMessagesRead);
  const markMessageRead = useTaobaoStore((st) => st.markMessageRead);

  return (
    <div
      className="flex flex-col h-full bg-[#F4F4F6] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <span className="text-[18px] font-bold text-[#11192D]">{s.msg_title}</span>
        <div
          {...bindTap(
            { kind: 'action', id: 'messages.all.read' },
            { onTrigger: () => markAllMessagesRead() },
          )}
          className="text-xs text-[#50607A] bg-gray-100 px-2.5 py-1 rounded-full cursor-pointer active:opacity-75"
        >
          {s.msg_sub_unread}
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto no-scrollbar p-2.5 space-y-2"
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
            className="bg-white rounded-xl p-3.5 flex items-center gap-3 cursor-pointer active:bg-gray-50 transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF7700] to-[#FF5000] flex items-center justify-center text-white flex-shrink-0">
              <IcMessage size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[15px] font-semibold text-[#11192D] truncate">
                    {msg.sender}
                  </span>
                  <span className="text-[10px] text-[#FF5000] bg-[#FFF0E8] px-1.5 py-0.5 rounded">
                    {msg.tag}
                  </span>
                </div>
                <span className="text-[11px] text-[#7C889C] flex-shrink-0">{msg.timeText}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-[13px] text-[#50607A] truncate">{msg.preview}</p>
                {msg.unread > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#FF2442] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
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
