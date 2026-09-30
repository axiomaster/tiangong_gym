import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { usePinduoduoStrings } from '../hooks/usePinduoduoStrings';
import { usePinduoduoGestures } from '../hooks/usePinduoduoGestures';
import { usePinduoduoStore } from '../state';
import { getProductImage } from '../data';
import { IcHeart, IcShoppingBag } from '../res/icons';

export const VideoPage: React.FC = () => {
  const s = usePinduoduoStrings();
  const { bindTap } = usePinduoduoGestures();
  const { videos, products } = usePinduoduoStore(
    useShallow((st) => ({
      videos: st.videos,
      products: st.products,
    })),
  );
  const toggleVideoLike = usePinduoduoStore((st) => st.toggleVideoLike);
  const toggleVideoFollow = usePinduoduoStore((st) => st.toggleVideoFollow);

  return (
    <div
      className="flex flex-col h-full bg-[#111319] text-white pt-10"
      data-status-bar-foreground="light"
      data-navigation-bar-foreground="dark"
    >
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
        <span className="text-[17px] font-bold">{s.video_title}</span>
      </div>

      <div
        className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-4"
        data-scroll-container="video-feed"
        data-scroll-direction="vertical"
      >
        {videos.map((vid) => {
          const linkedProduct = products.find((p) => p.id === vid.linkedProductId);
          return (
            <div
              key={vid.id}
              className="bg-[#1C1F28] rounded-2xl overflow-hidden border border-white/10"
            >
              <div className="relative aspect-[4/3] bg-black overflow-hidden">
                <img
                  src={getProductImage(vid.imageKey)}
                  alt={vid.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <div className="bg-black/55 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-medium">
                    @{vid.author}
                  </div>
                  <div
                    {...bindTap(
                      { kind: 'action', id: 'video.item.follow.toggle' },
                      {
                        params: { videoId: vid.id, to: !vid.followed },
                        onTrigger: () => toggleVideoFollow(vid.id),
                      },
                    )}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                      vid.followed ? 'bg-white/20 text-white' : 'bg-[#E02E24] text-white'
                    }`}
                  >
                    {vid.followed ? s.video_followed_btn : s.video_follow_btn}
                  </div>
                </div>
              </div>

              <div className="p-3.5 space-y-3">
                <p className="text-[14px] leading-snug text-white/90">{vid.title}</p>

                <div className="flex items-center justify-between">
                  {linkedProduct && (
                    <div
                      {...bindTap('home.product.open', { params: { id: linkedProduct.id } })}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg cursor-pointer max-w-[72%]"
                    >
                      <IcShoppingBag size={15} className="text-[#E02E24] flex-shrink-0" />
                      <span className="text-xs truncate">{linkedProduct.title}</span>
                      <span className="text-xs font-bold text-[#E02E24] flex-shrink-0">
                        {s.currency_symbol}
                        {linkedProduct.priceText}
                      </span>
                    </div>
                  )}

                  <div
                    {...bindTap(
                      { kind: 'action', id: 'video.item.like.toggle' },
                      {
                        params: { videoId: vid.id, to: !vid.liked },
                        onTrigger: () => toggleVideoLike(vid.id),
                      },
                    )}
                    className="flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
                  >
                    <IcHeart
                      size={20}
                      className={vid.liked ? 'text-[#E02E24]' : 'text-white/80'}
                      fill={vid.liked ? 'currentColor' : 'none'}
                    />
                    <span className="text-xs font-medium">{vid.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
