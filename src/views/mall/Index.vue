<template>
  <div>
    <div v-if="!isShowLoading">
      <!-- 搜索框 -->
      <goods-search />

      <!-- 快捷导航 -->
      <quick-nav/>
<!--      &lt;!&ndash; 轮播图 &ndash;&gt;-->
<!--      <ad-carousel :advertList="advertList"/>-->

      <selected-nav/>
      <!-- 分类导航 -->
      <category-nav :categoryList="categoryList"/>

      <!-- 秒杀专区 -->
      <spike :seckillGoodsList="seckillGoodsList"/>

      <hot :hotGoodsList="hotGoodsList"/>

      <!-- 回到顶部按钮 -->
      <v-top/>
    </div>
    <!-- 数据加载提示gif -->
    <loading :show="isShowLoading"/>
  </div>
</template>
<script setup lang="ts">
// import {advertList} from '@/api/home'
// import {categoryList} from '@/api/category'
// import {goodsList} from '@/api/goods'

import loading from '@/components/loading/LoadingGif.vue';
import AdCarousel from '@/views/mall/components/AdCarousel/Index.vue';
import CategoryNav from '@/views/mall/components/CategoryNav/Index.vue';
import Spike from '@/views/mall/components/Seckill/Index.vue';
import Hot from '@/views/mall/components/Hot/Index.vue';
import GoodsSearch from '@/views/mall/components/search/Index.vue';
import QuickNav from '@/views/mall/components/QuickNav/Index.vue';
import SelectedNav from '@/views/mall/components/SelectedNav/Index.vue';


const isShowLoading = ref(true)  // 是否加载动画
const advertList = ref([]) // 广告轮播图
const categoryList = ref([]) // 商品分类
const seckillGoodsList = ref([])   // 秒杀商品
const hotGoodsList = ref([])

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
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "母婴",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "百货",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "视频",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "收集",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "医药",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "水果",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "女装",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "电器",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "男装",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "鞋包",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "车品",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "电脑",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "家装",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "运动",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "美妆",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "家具",
    },
    {
      "icon_url": "src/assets/images/payment_success.png",
      "name": "内衣",
    },
  ]

  categoryList.value = data2

  var data3 = [
    {
      "id": "1",
      "retail_price": "100",
      "counter_price": "500",
      "pic_url": "src/assets/images/order_no_data.png",
      "name": "goods1",
      "description": "goods1",
    },
    {
      "id": "2",
      "retail_price": "200",
      "counter_price": "1000",
      "pic_url": "src/assets/images/trumpet.png",
      "name": "goods2",
      "description": "goods2",
    },
    {
      "id": "3",
      "retail_price": "300",
      "counter_price": "3000",
      "pic_url": "src/assets/images/trumpet.png",
      "name": "goods3",
      "description": "goods3",
    },
  ]

  seckillGoodsList.value = data3


  hotGoodsList.value = data3

  isShowLoading.value = false
})


</script>