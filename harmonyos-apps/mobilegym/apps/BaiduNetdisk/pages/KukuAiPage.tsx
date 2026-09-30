import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useBaiduNetdiskStrings } from '../hooks/useBaiduNetdiskStrings';
import { useBaiduNetdiskGestures } from '../hooks/useBaiduNetdiskGestures';
import { useBaiduNetdiskStore } from '../state';
import { BAIDU_NETDISK_ASSETS } from '../data';
import { IcSparkles, IcTrash, IcFolder } from '../res/icons';

export const KukuAiPage: React.FC = () => {
  const s = useBaiduNetdiskStrings();
  const { bindTap } = useBaiduNetdiskGestures();

  const { aiPrompts, aiMessages, files } = useBaiduNetdiskStore(
    useShallow((st) => ({
      aiPrompts: st.aiPrompts,
      aiMessages: st.aiMessages,
      files: st.files,
    })),
  );
  const askAiPrompt = useBaiduNetdiskStore((st) => st.askAiPrompt);
  const clearAiHistory = useBaiduNetdiskStore((st) => st.clearAiHistory);

  return (
    <div
      className="flex flex-col h-full bg-gradient-to-b from-[#E6F4FF] via-[#F4F7FC] to-[#F4F7FC] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Top Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/60 bg-white/70 backdrop-blur-xs">
        <div className="flex items-center gap-2.5">
          <img
            src={BAIDU_NETDISK_ASSETS.tabKukuAi}
            alt="Kuku AI"
            className="w-8 h-8 object-contain"
          />
          <div>
            <div className="text-[16px] font-bold text-[#191C24]">{s.ai_title}</div>
            <div className="text-[11px] text-[#737987]">{s.ai_subtitle}</div>
          </div>
        </div>
        <div
          {...bindTap(
            { kind: 'action', id: 'ai.history.clear' },
            { onTrigger: () => clearAiHistory() },
          )}
          className="flex items-center gap-1 text-xs text-[#737987] bg-white px-2.5 py-1 rounded-full cursor-pointer active:opacity-75"
        >
          <IcTrash size={13} />
          <span>{s.ai_clear}</span>
        </div>
      </div>

      {/* Chat & Prompt Feed */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3"
        data-scroll-container="ai-chat"
        data-scroll-direction="vertical"
      >
        {/* Suggested Prompts Card */}
        <div className="bg-white rounded-2xl p-3.5 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#06A7FF]">
            <IcSparkles size={14} />
            <span>{s.ai_quick_prompts}</span>
          </div>
          <div className="space-y-2">
            {aiPrompts.map((p) => (
              <div
                key={p.id}
                {...bindTap(
                  { kind: 'action', id: 'ai.prompt.ask' },
                  {
                    params: { promptId: p.id },
                    onTrigger: () => askAiPrompt(p.id),
                  },
                )}
                className="px-3 py-2 rounded-xl bg-[#F4F7FC] hover:bg-[#E8F3FF] text-xs font-medium text-[#191C24] flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform"
              >
                <span>{p.title}</span>
                <span className="text-[#06A7FF] text-[11px] font-semibold">提问 →</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation Messages */}
        {aiMessages.map((msg) => {
          const linkedFile = msg.linkedFileId
            ? files.find((f) => f.id === msg.linkedFileId)
            : undefined;
          return (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-[#06A7FF] text-white rounded-br-xs'
                    : 'bg-white text-[#191C24] rounded-bl-xs shadow-xs'
                }`}
              >
                <p>{msg.text}</p>
                {linkedFile && (
                  <div
                    {...bindTap('file.detail.open', { params: { id: linkedFile.id } })}
                    className="mt-1.5 p-2 rounded-xl bg-[#F4F7FC] text-[#191C24] flex items-center gap-2 cursor-pointer active:opacity-80"
                  >
                    <IcFolder size={16} className="text-[#06A7FF] flex-shrink-0" />
                    <span className="font-semibold truncate flex-1">{linkedFile.title}</span>
                    <span className="text-[10px] text-[#06A7FF] flex-shrink-0">查看</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
