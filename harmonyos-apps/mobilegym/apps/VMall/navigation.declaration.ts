import { NavigationDeclaration, ScrollContainerDeclaration } from './navigation.types';

const MAIN_SCROLL: ScrollContainerDeclaration[] = [
  { name: 'main', direction: 'vertical', description: '页面主内容区' },
];

const CATEGORY_SCROLL: ScrollContainerDeclaration[] = [
  { name: 'sidebar', direction: 'vertical', description: '左侧分类栏' },
  { name: 'main', direction: 'vertical', description: '右侧商品列表' },
];

export const NAVIGATION_DECLARATION = {
  app: 'vmall',

  routes: [
    // =========================
    // Main tabs
    // =========================
    {
      path: '/',
      component: 'HomePage',
      params: {},
      entryPoint: 'home',
      scrollContainers: MAIN_SCROLL,
      uiStates: [{ id: 'home.base', search: {}, description: '首页' }],
      queryParams: {},
      description: '华为商城首页',
    },
    {
      path: '/category',
      component: 'CategoryPage',
      params: {},
      entryPoint: 'none',
      scrollContainers: CATEGORY_SCROLL,
      uiStates: [
        { id: 'category.base', search: {}, description: '分类页（默认分类）' },
        { id: 'category.cat.phone', search: { cat: '华为手机' }, description: '分类-华为手机' },
        { id: 'category.cat.watch', search: { cat: '运动健康' }, description: '分类-运动健康' },
        { id: 'category.cat.audio', search: { cat: '影音娱乐' }, description: '分类-影音娱乐' },
        { id: 'category.cat.office', search: { cat: '智慧办公' }, description: '分类-智慧办公' },
        { id: 'category.cat.smartpick', search: { cat: '鸿蒙智选' }, description: '分类-鸿蒙智选' },
        { id: 'category.cat.smarthome', search: { cat: '鸿蒙智家' }, description: '分类-鸿蒙智家' },
        { id: 'category.cat.car', search: { cat: '鸿蒙智行' }, description: '分类-鸿蒙智行' },
        { id: 'category.cat.pilot', search: { cat: '乾崑智驾' }, description: '分类-乾崑智驾' },
        { id: 'category.cat.subsidy', search: { cat: '国家补贴' }, description: '分类-国家补贴' },
        { id: 'category.cat.education', search: { cat: '教育优惠' }, description: '分类-教育优惠' },
      ],
      queryParams: {},
      description: '商品分类页（cat 为当前选中分类名，枚举自 defaults.json）',
    },
    {
      path: '/discover',
      component: 'DiscoverPage',
      params: {},
      entryPoint: 'none',
      scrollContainers: MAIN_SCROLL,
      uiStates: [{ id: 'discover.base', search: {}, description: '发现' }],
      queryParams: {},
      description: '发现页',
    },
    {
      path: '/me',
      component: 'MePage',
      params: {},
      entryPoint: 'none',
      scrollContainers: MAIN_SCROLL,
      uiStates: [{ id: 'me.base', search: {}, description: '我的' }],
      queryParams: {},
      description: '我的页面',
    },

    // =========================
    // Sub pages
    // =========================
    {
      path: '/product/:id',
      component: 'ProductDetailPage',
      params: { id: 'string' },
      entryPoint: 'none',
      scrollContainers: MAIN_SCROLL,
      uiStates: [
        {
          id: 'product.base',
          search: {},
          description: '商品详情页',
          actions: [
            {
              id: 'product.cart.add',
              label: '加入购物车',
              behavior: 'other',
              paramsSchema: { id: 'string' },
            },
            {
              id: 'product.buyNow.submit',
              label: '立即购买',
              behavior: 'submit',
              paramsSchema: { id: 'string' },
            },
            {
              id: 'product.color.choose',
              label: '选择机身配色',
              behavior: 'other',
              paramsSchema: { value: 'string' },
            },
            {
              id: 'product.spec.choose',
              label: '选择规格配置',
              behavior: 'other',
              paramsSchema: { value: 'string' },
            },
          ],
        },
      ],
      queryParams: {},
      description: '商品详情页',
    },
    {
      path: '/cart',
      component: 'CartPage',
      params: {},
      entryPoint: 'none',
      scrollContainers: MAIN_SCROLL,
      uiStates: [
        {
          id: 'cart.base',
          search: {},
          description: '购物车',
          actions: [
            { id: 'cart.items.clear', label: '清空购物车', behavior: 'other' },
            { id: 'cart.checkout.submit', label: '去结算', behavior: 'submit' },
          ],
        },
      ],
      queryParams: {},
      description: '购物车页面',
    },
  ],

  transitions: [
    // =========================
    // Tab switching
    // =========================
    {
      id: 'tab.home',
      from: ['/category', '/discover', '/me'],
      to: '/',
      search: {},
      searchParams: {},
      mode: 'replace',
      params: {},
      label: '切换到首页',
      ui: { placement: 'tabbar', icon: 'tab_home', gesture: 'tap' },
    },
    {
      id: 'tab.category',
      from: ['/', '/discover', '/me'],
      to: '/category',
      search: {},
      searchParams: {},
      mode: 'replace',
      params: {},
      label: '切换到分类',
      ui: { placement: 'tabbar', icon: 'tab_category', gesture: 'tap' },
    },
    {
      id: 'tab.discover',
      from: ['/', '/category', '/me'],
      to: '/discover',
      search: {},
      searchParams: {},
      mode: 'replace',
      params: {},
      label: '切换到发现',
      ui: { placement: 'tabbar', icon: 'tab_discover', gesture: 'tap' },
    },
    {
      id: 'tab.me',
      from: ['/', '/category', '/discover'],
      to: '/me',
      search: {},
      searchParams: {},
      mode: 'replace',
      params: {},
      label: '切换到我的',
      ui: { placement: 'tabbar', icon: 'tab_me', gesture: 'tap' },
    },

    // =========================
    // Home page
    // =========================
    {
      id: 'home.search.open',
      from: '/',
      to: '/category',
      search: {},
      searchParams: {},
      mode: 'push',
      params: {},
      label: '点击搜索按钮进入分类页',
      ui: { placement: 'topbar', icon: 'search', gesture: 'tap' },
    },
    {
      id: 'home.category.open',
      from: '/',
      to: '/category',
      search: {},
      searchParams: { cat: 'string' },
      mode: 'push',
      params: {},
      label: '打开金刚位分类',
      ui: { placement: 'content', icon: 'grid', gesture: 'tap' },
    },
    {
      id: 'home.promo.open',
      from: '/',
      to: '/category',
      search: { cat: '智慧办公' },
      searchParams: {},
      mode: 'push',
      params: {},
      label: '打开品类日营销卡片',
      ui: { placement: 'content', icon: 'promo', gesture: 'tap' },
    },
    {
      id: 'home.product.open',
      from: '/',
      to: '/product/:id',
      search: {},
      searchParams: {},
      mode: 'push',
      params: { id: 'string' },
      label: '打开商品详情',
      ui: { placement: 'content', icon: 'product', gesture: 'tap' },
      dataSource: { ref: 'products', paramMapping: { id: 'id' }, labelField: 'name' },
    },

    // =========================
    // Category page
    // =========================
    {
      id: 'category.select',
      from: [
        { path: '/category', search: {} },
        { path: '/category', search: { cat: '*' } },
      ],
      to: '/category',
      search: {},
      searchParams: { cat: 'string' },
      mode: 'replace',
      params: {},
      label: '选择左侧分类',
      ui: { placement: 'content', icon: 'category', gesture: 'tap' },
    },
    {
      id: 'category.product.open',
      from: '/category',
      to: '/product/:id',
      search: {},
      searchParams: {},
      mode: 'push',
      params: { id: 'string' },
      label: '打开商品详情',
      ui: { placement: 'content', icon: 'product', gesture: 'tap' },
      dataSource: { ref: 'products', paramMapping: { id: 'id' }, labelField: 'name' },
    },

    // =========================
    // Cart
    // =========================
    {
      id: 'cart.open',
      from: ['/', '/product/:id'],
      to: '/cart',
      search: {},
      searchParams: {},
      mode: 'push',
      params: {},
      label: '打开购物车',
      ui: { placement: 'topbar', icon: 'cart', gesture: 'tap' },
    },
    {
      id: 'cart.goHome',
      from: '/cart',
      to: '/',
      search: {},
      searchParams: {},
      mode: 'replace',
      params: {},
      label: '去选购（返回首页）',
      ui: { placement: 'content', icon: 'home', gesture: 'tap' },
    },
  ],

  capabilities: {
    historyBack: true,
  },
} as const satisfies NavigationDeclaration;

export type TransitionId = (typeof NAVIGATION_DECLARATION.transitions)[number]['id'];
