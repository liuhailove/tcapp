<template>
  <div id="order-container">
    <div id="top-bar">
      <van-tabs v-model:active="active" @change="handleTabClick" sticky>
        <van-tab v-for="(item,idx) in tobBar" :name="item.to" :badge="item.badge">
          <template #title>
            <van-icon :name="item.icon"/>
            {{ item.title }}
          </template>
        </van-tab>
      </van-tabs>
      <router-view></router-view>
    </div>
    <!-- 内容页 -->
    <div class="content">
      <component :is="activeTabComponent"></component>
    </div>

    <!-- 回到顶部按钮 -->
    <van-back-top />
  </div>
</template>
<script setup>
import AllOrdersContent from '@/views/user/myorders/AllOrders/Index.vue';
import ToBeDeliveredContent from '@/views/user/myorders/ToBeDelivered/Index.vue';
// 默认活跃的tab
const active = ref(0)
// 活跃组件
const activeTabComponent = ref(AllOrdersContent)
const handleTabClick = (toUrl) => {
  console.info("handleTabClick:" + toUrl)
  if (toUrl === '/all') {
    activeTabComponent.value = AllOrdersContent
  } else {
    activeTabComponent.value = ToBeDeliveredContent
  }
}

onMounted(() => {
  // 在下次 DOM 更新循环结束后执行回调
  nextTick(() => {
    // 确保子组件已经获取到修改后的属性值
    initData()
  });
})

// 初始化顶部菜单
const tobBar = ref([]);
const initData = () => {
  tobBar.value = [
    {
      name: "all",
      title: "全部",
      icon: "",
      to: "/all",
      id: 1,
    },
    {
      name: "toBePaid",
      title: "待支付",
      icon: "",
      to: "/toBePaid",
      id: 2,
      badge:"10+"
    },
    {
      name: "toBeDelivered",
      title: "待发货",
      icon: "",
      to: "/toBeDelivered",
      id: 3,
    },
    {
      name: "toBeReceiptUse",
      title: "待收货/使用",
      icon: "",
      to: "/toBeReceiptUse",
      id: 4,
    },
    {
      name: "evaluate",
      title: "评价",
      icon: "",
      to: "/evaluate",
      id: 5,
    },
    {
      name: "sales",
      title: "售后",
      icon: "",
      to: "/sales",
      id: 7,
    },
  ]
}

</script>

<style lang="less" scoped>
.home-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 2000;
  padding-top: 44px;
  overflow: auto;

}

</style>