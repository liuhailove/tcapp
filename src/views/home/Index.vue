<template>
  <div id="home-container">
    <TopBar/>
    <RightBar/>
    <!-- 播放视频 -->
<!--    <div class="content">-->

<!--    </div>-->


    <!--    &lt;!&ndash; 底部内容作者作品组件显示 &ndash;&gt;-->
    <!--    <div  class="workBottom">-->
    <!--      <input type="text" @keyup.enter="publish()" placeholder="善语结善缘，恶言伤人心" v-model.trim="chatText">-->
    <!--      <van-icon name="guide-o" @click="publish()" color="#000" />-->
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

  // if (this.activeTab === tabId) {
  //   this.sidebarVisible = !this.sidebarVisible;
  // } else {
  //   this.activeTab = tabId;
  //   this.sidebarVisible = true;
  // }
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

.top-bar {
  width: 80%;
}


//.workBottom {
//  position: fixed;
//  bottom: 0;
//  left: 0;
//  width: 100%;
//  padding: 15px 0;
//  display: flex;
//  align-items: center;
//  justify-content: space-evenly;
//
//  input {
//    // 透明背景
//    background-color: rgba(0, 0, 0, 0, 1);
//    border: 0;
//    margin-right: 5px;
//    color: #fff;
//    font-size: 16px;
//    width: 75%;
//    padding: 8px 0;
//  }
//
//  input::-webkit-input-placeholder {
//    color: #bababa;
//    font-size: 14px;
//  }
//
//  :deep(.van-icon-guide-o) {
//    vertical-align: middle;
//  }
//}


</style>