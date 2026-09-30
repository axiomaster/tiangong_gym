import React from 'react';
import TabBar from '../components/TabBar';
import { IcSparkles, IcHeart, IcShare } from '../res/icons';

export const DiscoverPage: React.FC = () => {
  const feeds = [
    {
      id: 1,
      author: '华为终端官方',
      time: '2小时前',
      title: 'HUAWEI Mate X6 真实开箱评测：折叠新纪元',
      content: '玄武水滴铰链带来近乎零折痕的平整体验，配合鸿蒙NEXT原生智能，办公多任务效率翻倍！',
      likes: '1.2万',
      shares: '850',
    },
    {
      id: 2,
      author: '花粉俱乐部精选',
      time: '5小时前',
      title: 'WATCH D2 24小时动态血压监测实测体验',
      content: '腕上微型气泵设计，佩戴轻盈无感，每日清晨定时自动测量，全家人健康尽在掌握。',
      likes: '8600',
      shares: '320',
    },
    {
      id: 3,
      author: '智驾生活家',
      time: '昨天',
      title: '问界 M9 Ultimate 乾崑智驾 ADS 3.0 跨城高速首测',
      content: '途灵智能底盘过坎滤震极佳，车位到车位全流程领航辅助，智驾时代的旗舰标杆！',
      likes: '2.5万',
      shares: '3400',
    },
  ];

  return (
    <div className="h-full w-full bg-[#f4f4f4] flex flex-col relative select-none">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-3 border-b border-gray-100 flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-900">发现 · 精彩生活</h2>
      </div>

      {/* Feeds list */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-3 pb-24"
        data-scroll-container="main"
        data-scroll-direction="vertical"
      >
        {feeds.map((feed) => (
          <div
            key={feed.id}
            className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C7000B] to-red-400 flex items-center justify-center text-white text-xs font-bold">
                  华
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">
                    {feed.author}
                  </h4>
                  <span className="text-[10px] text-gray-400">{feed.time}</span>
                </div>
              </div>
              <span className="bg-red-50 text-[#C7000B] text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <IcSparkles size={11} /> 官方推荐
              </span>
            </div>

            <h3 className="text-sm font-bold text-gray-900 leading-snug">
              {feed.title}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {feed.content}
            </p>

            <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
              <button className="flex items-center gap-1 hover:text-[#C7000B]">
                <IcHeart size={14} /> <span>{feed.likes}</span>
              </button>
              <button className="flex items-center gap-1 hover:text-gray-600">
                <IcShare size={14} /> <span>{feed.shares}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <TabBar />
    </div>
  );
};

export default DiscoverPage;
