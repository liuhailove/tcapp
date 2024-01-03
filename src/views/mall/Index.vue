<template>
  <div>
    <div v-if="!isShowLoading">
      <!-- 搜索框 -->
      <goods-search/>
      <!-- 快捷导航 -->
      <quick-nav/>
      <!--精选导航-->
      <selected-nav/>
      <!-- 分类导航 -->
      <category-nav :categoryList="categoryList"/>
      <!-- 回到顶部按钮 -->
<!--      <v-top/>-->
    </div>
    <!-- 数据加载提示gif -->
    <loading :show="isShowLoading"/>
  </div>
</template>
<script setup lang="ts">
import CategoryNav from '@/views/mall/components/CategoryNav/Index.vue';
import GoodsSearch from '@/views/mall/components/search/Index.vue';
import QuickNav from '@/views/mall/components/QuickNav/Index.vue';
import SelectedNav from '@/views/mall/components/SelectedNav/Index.vue';


const isShowLoading = ref(true)  // 是否加载动画
const advertList = ref([]) // 广告轮播图
const categoryList = ref([]) // 商品分类

onMounted(() => {
  var data = [{
    "pic_url": "src/assets/images/ali_pay.png",
    "name": "ali_pay",
  },
    {
      "pic_url": "src/assets/images/order_no_data.png",
      "name": "order_no_data",
    },
    {
      "pic_url": "src/assets/images/payment_success.png",
      "name": "payment_success",
    }]

  advertList.value = data


  var data2 = [
    {
      "icon_url": "src/assets/images/order_no_data.png",
      "name": "推荐",
      "to": '/recommend',
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "母婴",
      "to": '/motherAndBaby',
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "百货",
      "to": "/departmentStore",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "收集",
      "to": "/collect"
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "医药",
      "to": "/collect"
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "水果",
      "to": "/fruit"
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "女装",
      "to": "/collect"
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "电器",
      "to": "/collect"
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "男装",
      "to": "/collect"
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "鞋包",
      "to": "/collect"
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "车品",
      "to": "/collect"
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "电脑",
      "to": "/collect"
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "家装",
      "to": "/collect"
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "运动",
      "to": "/collect"
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "美妆",
      "to": "/collect"
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "家具",
      "to": "/collect"
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "内衣",
      "to": "/collect"
    },
  ]

  categoryList.value = data2


  isShowLoading.value = false
})


</script>