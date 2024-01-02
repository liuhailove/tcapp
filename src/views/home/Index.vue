<template>
  <div id="home-container">
    <TopBar/>
    <RightBar/>
    <!-- 播放视频 -->
<!--    <div class="content">-->

<!--    </div>-->

    <!-- 回到顶部按钮 -->
    <!--    <v-top/>-->
  </div>
</template>
<script setup>
import RightBar from '@/views/home/components/sidebar/RightBar.vue';
import TopBar from '@/views/home/components/sidebar/TopBar.vue';

const tobBar = ref([]);
const activeIndex = ref(0);
const sidebarVisible = ref(2);
onMounted(() => {
  // 在下次 DOM 更新循环结束后执行回调
  nextTick(() => {
    // 确保子组件已经获取到修改后的属性值
    initData()
  });
})

const initData = () => {
  tobBar.value = [
    {
      name: "hot",
      title: "热点",
      icon: "",
      to: "/hot",
      id: 1,
    },
    {
      name: "live",
      title: "直播",
      icon: "",
      to: "/live",
      id: 2,
    },
    {
      name: "mall",
      title: "电商",
      icon: "",
      to: "/mall",
      id: 3,
    },
    {
      name: "recommend",
      title: "推荐",
      icon: "",
      to: "/recommand",
      id: 4,
    },
    {
      name: "search",
      title: "搜索",
      icon: "search",
      to: "/search",
      id: 5,
    },
  ]
}
const isSidebarVisible = ref(false);
const handleTabClick = (tabId) => {
  console.info("sidebarVisible.value" + tabId);

  if (tabId === 1) {
    this.sidebarVisible = true;
    isSidebarVisible.value = true;
  } else {
    this.sidebarVisible = false;
    isSidebarVisible.value = false;
  }
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