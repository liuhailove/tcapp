<template>
  <div id="top-bar" class="topBarContainer">
    <!-- 导航项内容 -->
    <!--    <van-grid :column-num="tobBar.length" :border="false" >-->
    <!--      <van-grid-item v-for="(item,idx) in tobBar"-->
    <!--                     :key="idx"-->
    <!--                     :icon="item.icon"-->
    <!--                     :text="item.title"-->
    <!--                     @click="handleBarClick(idx,item.name)"-->
    <!--      />-->
    <!--    </van-grid>-->
    <van-tabs v-model:active="active" sticky @click-tab="onClickTab">
      <van-tab v-for="(item,idx) in tobBar" :name="item.to">
        <template #title>
          <van-icon :name="item.icon"/>
          {{ item.title }}
        </template>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script setup lang="ts">

const router = useRouter()

const active = ref(0)
const tobBar = ref([]);
onMounted(() => {
  // 在下次 DOM 更新循环结束后执行回调
  nextTick(() => {
    // 确保子组件已经获取到修改后的属性值
    initData()
  });
})

const onClickTab = (item) => {
  console.info("onClickTab:" + item.name)
  router.push(item.name);
};

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
const handleBarClick = (index, name) => {
  console.info("sidebarVisible.value" + index + "," + name);
  router.push(name);
}
</script>

<style lang="less" scoped>
.topBarContainer {
  height: 30px;
  width: 100%;
}
</style>
