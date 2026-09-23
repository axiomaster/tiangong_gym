# HarmonyOSGym 架构设计

> 状态：正式设计与落地规范 v0.3（2026-09-23 结合华为商城真机复刻与 MobileGym 桌面集成实践更新）  
> 参考基准：`reference/mobilegym`（浏览器模拟移动环境 + 基准评测 + 强化学习训练）

---

## 1. 目标与价值闭环

### 1.1 核心痛点与解决思路
在真实 HarmonyOS（鸿蒙）真机上采集完整轨迹和海量数据成本极高（存在设备损耗、遍历易受阻断、网络风控拦截、不可逆业务操作等限制）。
本项目旨在建立一条**从“少量真机样本”到“海量高保真训练数据”**的高效数据合成流水线：

1. **输入数据结构**：基于真机采集的树形结构数据（`pageInfo.json`、`dump.json` 等）与屏幕截图自动切片，形成可驱动虚拟应用的标准输入；
2. **虚拟应用生成（HarmonyOSGym 虚拟应用）**：
   - **独立运行包（Path B）**：自包含纯静态渲染包（`harmonyos-apps/<bundle_name>/`），纯 JS 几何回放，秒级还原真机物理坐标；
   - **MobileGym 深度集成**：1:1 高保真 React 应用（`reference/mobilegym/apps/<AppName>/`），对齐 MobileGym 模块契约与悬浮毛玻璃 Dock，并固定于手机桌面 Launcher；
3. **参数化数据注入与放大**：复用 MobileGym 的数据分离（`defaults.json`）与内容注入机制，批量修改页面文本、图片、列表内容；
4. **统一输出表示（`cue_data.json`）**：虚拟应用批量渲染并经由模拟器环境（Playwright）采集清洗，输出与真机完全对称且对等的中间表示 `cue_data.json`，批量喂给多模态 GUI Agent 模型进行理解与训练。

```
【真机环境】
少量真机采样 (pageInfo + uitest + 截图)
      │
      ├───────────────────────────────┐
      ▼                               ▼
自动切图 + 输入规格 Spec            真机 Cleaner
      │                               │
      ├──────────────────┐            ▼
      ▼                  ▼      真机 cue_data.json
【Path B 独立渲染包】 【MobileGym 1:1 React App】  │
(geometry replay)   (桌面固定+可交互)         │ 校验基准 (Verifier Diff)
      │                  │            ▼
      └─────────┬────────┘      海量合成 cue_data.json
                ▼                     │
           批量数据注入                ▼
                │             喂给模型理解与训练
                ▼
        Playwright 采集清洗
```

### 1.2 核心设计原则（落地固化）
1. **`cue_data.json` 是系统的“最终产出”，而非生成应用的“输入”**：
   - `cue_data.json` 的首要目标是提供给下游模型（GUI Agent / Multimodal LLM）进行感知理解、状态评估和动作规划的统一格式。
   - 生成虚拟应用直接基于更丰富的真机原始树形数据（`pageInfo.json`），绝不从 `cue_data.json` 做逆向猜测。
2. **数据注入驱动规模化放大（核心价值）**：
   - 虚拟应用核心优势在于支持内容可修改、可注入。通过替换数据槽位即可零成本变体出成千上万张高保真页面。
3. **双目标虚拟应用交付体系**：
   - **自动化流水线主线**：基于 `spec.json` 与相对物理坐标回放的通用运行时渲染（Path B），零代码生成秒级直出；
   - **仿真平台应用主线**：基于真机切片的高保真 React 模块，对齐 MobileGym 桌面与手势体系，作为 Benchmark 任务环境。
4. **统一几何与排版基准**：
   - 设备物理分辨率归一化：真机 1320×2848 对应 resolution 3.375，换算 CSS Viewport 为 390px 左右，保证双端比例无缝对齐。

---

## 2. 总体架构与数据流

系统包含五大核心链路：

```
┌────────────────────────────────────────────────────────────────────────┐
│ ① 采集与资产提取层 (Collector & Cropper)                                  │
│    - 真机: hdc 自动探测设备/端口，采集 pageInfo / uitest / 截图          │
│    - 截图切片器 (Cropper): 智能过滤复合容器，裁剪 1:1 高清 Icon/Banner    │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ 结构化输入 (Input Spec + Assets)
┌──────────────────────────────────┴─────────────────────────────────────┐
│ ② 虚拟应用合成与打包层 (Synthesizer & Packager)                          │
│    - 目标 A: harmonyos-apps/ 自包含独立应用包 (spec.json + renderer.js)  │
│    - 目标 B: reference/mobilegym/ 1:1 React 应用 (桌面集成 + 浮动 Dock)  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ 虚拟应用运行态
┌──────────────────────────────────┴─────────────────────────────────────┐
│ ③ 数据注入与批量放大引擎 (Injection & Augmentation Engine)              │
│    - 模板化提取: 识别文本/图片/列表槽位                                  │
│    - 批量注入: 替换 defaults.json / 属性参数，海量衍生变体页面            │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ 动态派生页面
┌──────────────────────────────────┴─────────────────────────────────────┐
│ ④ 双端清洗层 (Cleaner)                                                 │
│    - 真机端: pageInfo + uitest → cue_data.json                         │
│    - Gym 端: 虚拟应用在浏览器运行 → Playwright 抓取 → cue_data.json      │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ cue_data.json (统一产出协议)
┌──────────────────────────────────┴─────────────────────────────────────┐
│ ⑤ 校验层 (Verifier)                                                    │
│    - 默认态虚拟应用 vs 真机版本: 几何 IoU、文本命中率、动作覆盖率对比    │
│    - 保障虚拟应用清洗产物与真机具有 100% 对称性与等价性                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 输入数据结构与采集层

### 3.1 真机快照采集工具 (`src/collector/hdc_collector.py`)
采集脚本内置 HDC 自动探测与端口兼容机制（支持标准 8710 端口及各自定义端口），自动定位前台应用并抓取状态四件套：

| # | 命令 / 操作 | 采集目标 | 说明 |
|---|---|---|---|
| 1 | `hdc shell "hidumper -s WindowManagerService -a '-a'"` | 窗口层级与 Focus Window | 提取当前活动包名（如 `com.huawei.hmos.vmall`）与顶层窗口 ID |
| 2 | `hdc shell "hidumper -s DeviceStatusService -a '-i'"` | `pageInfo.json` | 核心布局树、几何 `$rect`、样式 `$attrs`（双重 JSON 编码） |
| 3 | `hdc shell "snapshot_display -f /data/local/tmp/_shot.jpeg"` | 屏幕原始截图 | 物理像素图像（如 1320×2848） |
| 4 | `hdc shell "uitest dumpLayout -p /data/local/tmp/dump.json"` | 交互可操作性标志 | 补齐 clickable / scrollable 等动作属性 |

### 3.2 智能截图切片器 (`src/collector/cropper.py`)
针对鸿蒙 `pageInfo.json` 中图片无外部 URL、仅有资源 ID 的问题，采集流水线内置切片处理器：
- **复合容器抑制算法（`_is_compound_container`）**：自动检测 `Image` 节点下是否包含 `Text` 等子节点。对包裹有文字的背景容器实施抑制，避免截取带字背景产生“幽灵重影”；
- **边界校验与裁剪**：规范化负坐标与超出屏幕边界的组件，输出 `assets/images/<component_id>.png`；
- **资产清单（`assets_map.json`）**：记录节点 ID 到切片路径的映射，供合成层直接绑定。

### 3.3 虚拟应用生成输入规格 (App Generation Spec)
由 `src/cleaner/spec_converter.py` 输出，完整保留全树信息与局部坐标：
- 坐标规范：保留真机录制的绝对矩形 `[x1, y1, x2, y2]`；
- 文本补全：优先取 `attrs.content`，若为空则自动回退至 `attrs.accessibilityText`（解决 ArkUI TitleBar/Button 文本在无障碍字段的问题）；
- 动作补全：关联 `dump.json` 中的 `clickable/scrollable` 标志。

---

## 4. 统一产出协议：`cue_data.json`

### 4.1 协议定义与规范
面向多模态 Agent 的扁平化控件标注协议：

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "bundle_name": "com.huawei.hmos.vmall",
  "page_url": "pages/Splash",
  "window_id": 1,
  "viewport": {
    "width": 1320.0,
    "height": 2848.0,
    "resolution": 3.375
  },
  "screenshot": "screenshot.jpeg",
  "functions": [],
  "components": [
    {
      "id": 234,
      "type": "Text",
      "content": "首页",
      "bbox": [54.0, 174.0, 230.0, 174.0, 230.0, 277.0, 54.0, 277.0],
      "description": "",
      "style": { "fontSize": 26.0, "color": "#E5000000" },
      "group": "",
      "actions": ["click"]
    },
    {
      "id": 16612,
      "type": "Image",
      "content": "",
      "bbox": [0.0, 0.0, 1320.0, 0.0, 1320.0, 1687.0, 0.0, 1687.0],
      "description": "华为阔家族",
      "style": {},
      "group": "",
      "actions": ["scroll"]
    }
  ]
}
```

### 4.2 关键约束
1. **顺时针 4 点坐标**：`bbox: [x_tl, y_tl, x_tr, y_tr, x_br, y_br, x_bl, y_bl]`，单位为物理像素；
2. **标准命名**：固定为 `components`，废弃 `conponments`；
3. **动作空间**：包含 `click`、`long_press`、`scroll`、`type`。

---

## 5. 合成层与双目标虚拟应用交付

### 5.1 交付目标一：自包含独立应用包 (Path B Standalone)
通过 `src/synthesizer/packager.py` 一键打包生成：
- **目录位置**：`harmonyos-apps/<bundle_name>/`
- **内部构成**：
  - `app.json`：应用元数据（包名、尺寸、分辨率）；
  - `spec.json`：页面全量布局规范；
  - `index.html` + `renderer.js` + `renderer.css`：零构建轻量级纯 JS 渲染器；
  - `assets/images/*.png`：切片资源。
- **渲染算法优化**：解决父子绝对定位累加漂移问题，统一采用局部相对偏移 `left = rect[0] - parentRect[0]`，确保几何 IoU 贴近 1.0。
- **DOM 契约**：暴露 `[data-component-id]`、`[data-node-type]` 及 `window.__SPEC_RENDERED__`，供自动化 Cleaner 抓取。

### 5.2 交付目标二：MobileGym 1:1 高保真 React 应用
为了无缝接入 Agent 强化学习评测与交互环境，在 `reference/mobilegym` 中实现 1:1 真机级 React 应用（以华为商城为例）：
1. **资产无损复用**：`apps/VMall/assets/images/` 承载真机提取的真实切图（阔家族 Banner、10 金刚位 3D 图标、圆形搜索/购物车按钮、资质浮签）；
2. **桌面固定集成（Launcher Integration）**：
   - 布局配置：`os/launcher/defaults.json` 将 `vmall` 显式固定在桌面首屏（`screen1`）第 4 行第 4 列；
   - 品牌图标：`apps/VMall/res/icons.tsx` 按照华为官方规范绘制红底圆角 + 白色购物袋 + 红色“V”标志矢量图标；
   - 缓存迁移机制：递增 `LAUNCHER_LAYOUT_VERSION = 2`，保证任意浏览器访问均能无缝重载桌面首屏图标。
3. **界面结构 1:1 复刻**：
   - **顶部栏**：白底大号加粗“首页” + 右上角独立圆形搜索与购物车按钮；
   - **Hero 轮播**：真机“华为阔家族”三折叠屏视觉 + 5 段式胶囊滑块指示器；
   - **金刚位网格**：10 项真实 3D 渲染图标，左侧贴合“资质与规则”浮签；
   - **品类日营销卡片**：“周二智慧办公品类日 ›”结合红色优惠高亮；
   - **悬浮 Dock（TabBar）**：4 栏毛玻璃胶囊（首页、分类、发现、我的），首页采用实心红房子图标。

---

## 6. 校验闭环 (Verifier)

通过自动化 Diff 测试验证虚拟应用生成精度：

| 指标 | 评估方法 | 达标基准 | 作用 |
|---|---|---|---|
| **组件匹配率** | 基于 `(type, text/acc)` 匹配 | $\ge 95\%$ | 确保无控件漏渲染 |
| **几何 IoU** | 匹配组件的 `bbox` 平均交并比 | $\ge 0.85$ | 确保排版与真实鸿蒙屏幕重合 |
| **文本一致率** | 文本精确比对 | $\ge 98\%$ | 杜绝文案错漏 |
| **动作覆盖率** | 交互元素动作召回 | $100\%$ | 确保可点击/可滑动热区完全对齐 |

---

## 7. 实际工程落点与代码组织

```
harmonyosgym/
├── docs/
│   ├── arch.md                             # 本架构与设计文档
│   └── data                                # 真实设备原始截图样本 (JPEG)
├── data/
│   └── captures/
│       └── com.huawei.hmos.vmall/          # 真机采集产物 (pageInfo, dump, screenshot)
├── harmonyos-apps/                         # 生成的自包含虚拟应用包 (Path B)
│   ├── com.huawei.hmos.vmall/              # 华为商城虚拟包 (spec.json, renderer.js, assets/)
│   └── com.xingin.xhs_hos/                 # 小红书虚拟包
├── reference/
│   ├── data/                               # 归档数据样例 (小红书 real dump)
│   └── mobilegym/                          # 移动端仿真环境与基准平台
│       ├── os/launcher/                    # 桌面启动器 (defaults.json, Launcher.tsx)
│       └── apps/VMall/                     # 1:1 高保真华为商城 React 应用
├── src/                                    # HarmonyOSGym 核心代码库
│   ├── schema/
│   │   ├── input_spec.py                   # App Generation Spec Pydantic 模型
│   │   └── cue_data.py                     # cue_data 统一协议模型
│   ├── collector/
│   │   ├── hdc_collector.py                # 真机采集器 (设备检测/窗口捕获/四件套抓取)
│   │   ├── cropper.py                      # 截图切片器 (复合容器抑制/坐标对齐)
│   │   └── uitest.py                       # uitest dumpLayout 解析器
│   ├── cleaner/
│   │   ├── device_cleaner.py               # 真机数据 → cue_data.json 转换器
│   │   ├── spec_converter.py               # 真机数据 → input_spec.json 转换器
│   │   └── gym_cleaner.py                  # Gym 页面 DOM → cue_data.json 采集清洗器
│   ├── synthesizer/
│   │   ├── packager.py                     # 自包含虚拟应用打包器
│   │   ├── renderer/                       # 通用运行时渲染器 (renderer.js, renderer.css)
│   │   └── injector.py                     # 参数化批量数据注入与放大引擎
│   └── verifier/
│       ├── diff_engine.py                  # 双端比对与验证引擎
│       └── metrics.py                      # IoU 与指标计算库
└── tests/                                  # 单元测试与端到端测试套件
    ├── test_hdc_collector.py               # 采集器单元测试
    ├── test_cropper.py                     # 切片器单元测试
    ├── test_device_cleaner.py              # 真机清洗器测试
    ├── test_spec_converter.py              # Spec 转换器测试
    ├── test_packager.py                    # 打包器测试
    ├── test_real_data.py                   # 真实样本冒烟测试
    └── test_renderer_integration.py        # Playwright 浏览器端渲染与加载测试
```

---

## 8. 里程碑与当前进展

- [x] **Milestone 1：协议固化与真实数据清洗验证 [已完成]**
  - 完成 `cue_data`、`input_spec` Pydantic 模型定义；
  - 实现带复合容器抑制的自动切片器 `cropper.py` 与真机清洗器 `device_cleaner.py`；
  - 接入小红书与华为商城真实样本，全绿通过单元测试。
- [x] **Milestone 2：真机采集器与自包含虚拟应用打包 (Path B) [已完成]**
  - 实现 HDC 自动化采集器 `hdc_collector.py`，完成真机四件套提取；
  - 实现 `synthesizer/packager.py` 与轻量级纯 JS 绝对几何定位渲染器；
  - 打包生成小红书与华为商城虚拟应用包，通过 Playwright 端到端浏览器渲染验证。
- [x] **Milestone 2+：MobileGym 桌面集成与 1:1 高保真真机复刻 [已完成]**
  - 桌面 Launcher 首屏固定放置华为商城官方矢量图标；
  - 基于真机切片全方位重构华为商城首页、分类页、详情页与毛玻璃 Dock，实现像素级视觉与交互对齐。
- [ ] **Milestone 3：Playwright Gym Cleaner 与双端验证闭环 [进行中]**
  - 实现 `src/cleaner/gym_cleaner.py`，从浏览器渲染态提取 `cue_data.json`；
  - 实现 `src/verifier/diff_engine.py`，计算虚拟端与真机端的组件匹配率、几何 IoU 与动作覆盖率。
- [ ] **Milestone 4：参数化数据注入与规模化放大引擎**
  - 实现 `src/synthesizer/injector.py`，批量替换数据槽位生成海量变体样本并输出训练数据。
