import React from 'react';
import TabBar from '../components/TabBar';
import { IcChevronRight, IcShield, IcTruck, IcRotate } from '../res/icons';

export const MePage: React.FC = () => {
  const orderTabs = [
    { label: '待付款', icon: '💳' },
    { label: '待发货', icon: '📦' },
    { label: '待收货', icon: '🚚' },
    { label: '待评价', icon: '⭐' },
    { label: '退换/售后', icon: '🔄' },
  ];

  const tools = [
    { label: '收货地址', icon: '📍', desc: '已添加 2 个地址' },
    { label: '优惠券', icon: '🎟️', desc: '3 张待使用' },
    { label: '积分商城', icon: '🪙', desc: '1,520 积分' },
    { label: '官方售后', icon: '🛠️', desc: '全国联保网点' },
    { label: '帮助与客服', icon: '💬', desc: '7×24小时在线' },
  ];

  return (
    <div className="h-full w-full bg-[#f4f4f4] flex flex-col relative select-none">
      {/* User Header Profile */}
      <div className="bg-gradient-to-br from-[#800000] via-[#C7000B] to-[#990008] text-white px-4 pt-12 pb-6 rounded-b-3xl shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center text-2xl shadow-inner">
            👤
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold">HarmonyOS 体验官</h2>
              <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                V3 钻石会员
              </span>
            </div>
            <p className="text-xs text-red-200 mt-0.5">账号: huawei_tester_01</p>
          </div>
        </div>

        {/* Member Benefits */}
        <div className="mt-4 pt-3 border-t border-white/10 flex justify-around text-center text-xs">
          <div>
            <div className="text-sm font-bold">1,520</div>
            <div className="text-[10px] text-red-200">积分</div>
          </div>
          <div>
            <div className="text-sm font-bold">3</div>
            <div className="text-[10px] text-red-200">优惠券</div>
          </div>
          <div>
            <div className="text-sm font-bold">12</div>
            <div className="text-[10px] text-red-200">我的收藏</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-3 pb-24"
        data-scroll-container="main"
        data-scroll-direction="vertical"
      >
        {/* My Orders Card */}
        <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between pb-3 border-b border-gray-50">
            <h3 className="text-xs font-bold text-gray-900">我的订单</h3>
            <button className="text-[11px] text-gray-400 flex items-center hover:text-gray-600">
              全部订单 <IcChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1 pt-3 text-center">
            {orderTabs.map((tab) => (
              <button
                key={tab.label}
                className="flex flex-col items-center gap-1 active:scale-95 transition-transform"
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="text-[11px] text-gray-600">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Essential Tools Card */}
        <div className="bg-white rounded-2xl p-2 shadow-xs border border-gray-100 divide-y divide-gray-50">
          {tools.map((tool) => (
            <button
              key={tool.label}
              className="w-full px-3 py-3 flex items-center justify-between hover:bg-gray-50/50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{tool.icon}</span>
                <span className="text-xs font-semibold text-gray-800">
                  {tool.label}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                <span>{tool.desc}</span>
                <IcChevronRight size={14} />
              </div>
            </button>
          ))}
        </div>

        {/* Official Services Guarantee */}
        <div className="bg-white rounded-2xl p-3 shadow-xs border border-gray-100 grid grid-cols-3 gap-2 text-center text-[10px] text-gray-500">
          <div className="flex flex-col items-center gap-1">
            <IcShield size={16} className="text-[#C7000B]" />
            <span>正品保障</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <IcTruck size={16} className="text-blue-500" />
            <span>极速发货</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <IcRotate size={16} className="text-green-500" />
            <span>7天无忧退换</span>
          </div>
        </div>
      </div>

      <TabBar />
    </div>
  );
};

export default MePage;
