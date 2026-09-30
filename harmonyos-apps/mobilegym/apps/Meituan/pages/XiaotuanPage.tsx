import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useMeituanStrings } from '../hooks/useMeituanStrings';
import { useMeituanGestures } from '../hooks/useMeituanGestures';
import { useMeituanStore } from '../state';
import { MEITUAN_ASSETS, getDealImage } from '../data';
import { IcSparkles } from '../res/icons';

export const XiaotuanPage: React.FC = () => {
  const s = useMeituanStrings();
  const { bindTap } = useMeituanGestures();
  const { xiaotuanTopics, activeTopicId, deals } = useMeituanStore(
    useShallow((st) => ({
      xiaotuanTopics: st.xiaotuanTopics,
      activeTopicId: st.activeTopicId,
      deals: st.deals,
    })),
  );
  const selectXiaotuanTopic = useMeituanStore((st) => st.selectXiaotuanTopic);

  const activeTopic =
    xiaotuanTopics.find((t) => t.id === activeTopicId) || xiaotuanTopics[0];
  const recommendedDeal = deals.find((d) => d.id === activeTopic?.recommendedDealId);

  return (
    <div
      className="flex flex-col h-full bg-gradient-to-b from-[#FFF9DB] via-[#F6F7FB] to-[#F4F4F6] pt-10"
      data-status-bar-foreground="dark"
      data-navigation-bar-foreground="dark"
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2.5 border-b border-black/5">
        <img
          src={MEITUAN_ASSETS.tabXiaotuan}
          alt="小团"
          className="w-9 h-9 object-contain"
        />
        <div>
          <div className="text-[16px] font-bold text-[#111111] flex items-center gap-1">
            <span>{s.xiaotuan_title}</span>
            <IcSparkles size={14} className="text-[#FF8800]" />
          </div>
          <div className="text-[11px] text-[#50607A]">{s.xiaotuan_subtitle}</div>
        </div>
      </div>

      {/* Chat & Prompt Area */}
      <div
        className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3.5"
        data-scroll-container="xiaotuan-chat"
        data-scroll-direction="vertical"
      >
        {/* Greeting Card */}
        <div className="bg-white rounded-2xl p-3.5 shadow-2xs text-xs text-[#111111] leading-relaxed">
          {s.xiaotuan_greeting}
        </div>

        {/* Prompt Chips */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#50607A] px-1">猜你想问：</div>
          {xiaotuanTopics.map((topic) => {
            const isSelected = topic.id === activeTopic?.id;
            return (
              <div
                key={topic.id}
                {...bindTap(
                  { kind: 'action', id: 'xiaotuan.topic.select' },
                  {
                    params: { topicId: topic.id },
                    onTrigger: () => selectXiaotuanTopic(topic.id),
                  },
                )}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#FFD100] text-[#111111] font-bold shadow-2xs'
                    : 'bg-white text-[#111111] active:bg-gray-50'
                }`}
              >
                “{topic.prompt}”
              </div>
            );
          })}
        </div>

        {/* AI Response + Deal Card */}
        {activeTopic && (
          <div className="bg-white rounded-2xl p-3.5 space-y-3 shadow-xs">
            <div className="text-xs text-[#111111] leading-relaxed">{activeTopic.reply}</div>

            {recommendedDeal && (
              <div
                {...bindTap('home.deal.open', { params: { id: recommendedDeal.id } })}
                className="border border-gray-100 rounded-xl p-2.5 flex items-center gap-3 bg-[#FAFAFC] cursor-pointer active:opacity-90"
              >
                <img
                  src={getDealImage(recommendedDeal.imageKey)}
                  alt={recommendedDeal.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#111111] truncate">
                    {recommendedDeal.shortTitle}
                  </div>
                  <div className="text-[11px] text-[#50607A] truncate mt-0.5">
                    {recommendedDeal.subtitle}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-[#FF2D19]">
                      {s.currency_symbol}
                      {recommendedDeal.priceText}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFD100] text-[#111111] text-[10px] font-bold">
                      去抢购
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
