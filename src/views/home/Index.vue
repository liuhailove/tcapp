<template>
  <div id="home-container">
    <div id="top-bar">
      <van-sticky>
        <van-tabs v-model:active="active" @change="handleTabClick" sticky>
          <van-tab v-for="(item,idx) in tobBar" :name="item.to">
            <template #title>
              <van-icon :name="item.icon"/>
              {{ item.title }}
            </template>
          </van-tab>
        </van-tabs>
      </van-sticky>
      <router-view></router-view>
    </div>
    <!-- 内容页 -->
    <div class="content">
      <component :is="activeTabComponent"></component>
    </div>

    <!-- 回到顶部按钮 -->
    <!--    <v-top/>-->
  </div>
</template>
<script setup>
// 电商组件
import MallContent from '@/views/mall/Index.vue';
// 直播组件
import LiveContent from '@/views/live/Index.vue';
// 默认活跃的tab
const active = ref(0)
// 活跃组件
const activeTabComponent = ref(LiveContent)
const handleTabClick = (toUrl) => {
  console.info("handleTabClick:" + toUrl)
  if (toUrl === '/live') {
    activeTabComponent.value = LiveContent
  } else {
    activeTabComponent.value = MallContent
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
      name: "app",
      title: "",
      icon: "apps-o",
      to: "/app",
      id: 1,
    },
    {
      name: "hot",
      title: "热点",
      icon: "",
      to: "/hot",
      id: 2,
    },
    {
      name: "live",
      title: "直播",
      icon: "",
      to: "/live",
      id: 3,
    },
    {
      name: "mall",
      title: "电商",
      icon: "",
      to: "/mall",
      id: 4,
    },
    {
      name: "recommend",
      title: "推荐",
      icon: "",
      to: "/recommand",
      id: 5,
    },
    {
      name: "search",
      title: "",
      icon: "search",
      to: "/search",
      id: 6,
    },
    {
      name: "setting",
      title: "",
      icon: "setting-o",
      to: "/setting",
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