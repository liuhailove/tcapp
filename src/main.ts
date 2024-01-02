import {createApp} from 'vue'
import '@/style.css'
import App from '@/App.vue'

import {
    ActionSheet, AddressEdit, AddressList, Area,
    Button,
    Card, Cell, CellGroup, Checkbox, CheckboxGroup, Col, ContactCard, ContactEdit, ContactList,
    CountDown, CouponCell, CouponList,
    Divider, Field, Form,
    Grid,
    GridItem,
    Lazyload,
    Loading, NavBar, Popup, Radio, RadioGroup, Row, Search, Sidebar, SidebarItem, Stepper, SubmitBar,
    Swipe,
    SwipeItem, Tab,
    Tabbar,
    TabbarItem, Tabs,
    Toast, Dialog, Notify, ImagePreview,
    ActionBar, ActionBarIcon, ActionBarButton,
    setToastDefaultOptions
} from 'vant';
import {Icon} from "vant";
import 'vant/lib/index.css';
import router from '@/router';
import "vant/es/toast/style"; //轻提示样式
import "amfe-flexible";
import '@vant/touch-emulator';

const app = createApp(App);
// setToastDefaultOptions({ duration: 800 }); //修改轻提示默认配置

// 路由加载
app.use(router);
app.use(Toast);
app.use(Dialog);
app.use(Notify);
app.use(ImagePreview);
// Tabbar底部
app.use(Tabbar);
app.use(TabbarItem);
// loading组件
app.use(Loading);
// 轮播组件
app.use(Swipe);
app.use(SwipeItem);
// // 懒加载
// app.use(Lazyload);
// 栅栏宫格
app.use(Grid);
app.use(GridItem);
// icon图标
app.use(Icon);
// panel面板
// app.use(Panel);
// 倒计时
app.use(CountDown);
// 分割线
app.use(Divider);
// // image
// app.use(Image);
// 商品卡片
app.use(Card);
// 按钮
app.use(Button);
// 导航栏
app.use(NavBar);
// 上拉菜单
app.use(ActionSheet);
// 布局
app.use(Cell).use(CellGroup).use(Col).use(Row);
// tab标签
app.use(Tab).use(Tabs);
// 表单
app.use(Form).use(Field);
// 复选框
app.use(Checkbox).use(CheckboxGroup);
// 提交栏
app.use(SubmitBar);
// 步进器
app.use(Stepper);
// 联系人卡片
app.use(ContactCard).use(ContactList).use(ContactEdit);
// 收货人地址
app.use(AddressList).use(AddressEdit);
// 省市区选择
app.use(Area);
// 单选框
app.use(RadioGroup).use(Radio);
// 弹出层
app.use(Popup);
// 优惠券
app.use(CouponCell).use(CouponList);
// 商品搜索
app.use(Search);
// 边框
app.use(Sidebar).use(SidebarItem);
// 懒加载
app.use(Lazyload);
// app.use(store);

// console.log(import.meta.env)
app.use(ActionBar);
app.use(ActionBarIcon);
app.use(ActionBarButton);

app.mount('#app');







