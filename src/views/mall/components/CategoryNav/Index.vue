<!--商品分类导航-->
<template>
  <div>
    <div class="category">
      <van-tabs v-model:active="active" sticky swipeable @change="handleTabClick">
        <van-tab v-for="(item,index) in categoryList" :title="item.name" :name="item.to">
        </van-tab>
      </van-tabs>
      <!-- 内容页 -->
      <div class="content">
        <component :is="activeTabComponent"></component>
      </div>
    </div>
  </div>
</template>

<script setup>
// 推荐组件
import RecommendContent from '@/views/mall/recommend/Index.vue';
// 水果组件
import FruitContent from '@/views/mall/fruit/Index.vue';


const active = ref(0);
const activeTabComponent = ref(RecommendContent)
const props = defineProps({
  categoryList: {
    type: Array,
  }
})

const handleTabClick = (toUrl) => {
  console.info("category handleTabClick:" + toUrl)
  if (toUrl === '/recommend') {
    activeTabComponent.value = RecommendContent
  } else {
    activeTabComponent.value = FruitContent
  }
}

</script>
<style lang="less" scoped>

</style>