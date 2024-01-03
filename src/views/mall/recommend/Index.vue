<!-- 人气推荐 -->
<template>
  <van-grid :column-num="2" >
    <van-grid-item v-for="(item,index) in hotGoodsList">
      <van-card
          class="hot-goods-item"
          :price="item.retail_price"
          :desc="item.description"
          :title="item.name"
          :tag="index<3?'hot':''"
          :thumb="item.pic_url"
          @click="gotoGoodsDetail(item.id)">
        <template #tags>
          <van-tag plain type="danger">多色可选</van-tag>
        </template>
      </van-card>
    </van-grid-item>
  </van-grid>
</template>

<script setup lang="ts">
const hotGoodsList = ref([
  {
    "id": "1",
    "retail_price": "100",
    "counter_price": "500",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg",
    "name": "goods1",
    "description": "goods1",
  },
  {
    "id": "2",
    "retail_price": "200",
    "counter_price": "1000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg",
    "name": "goods2",
    "description": "goods2",
  },
  {
    "id": "3",
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg",
    "name": "goods3",
    "description": "goods3",
  },
  {
    "id": "4",
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/apple-4.jpeg",
    "name": "goods4",
    "description": "goods4",
  },
  {
    "id": "5",
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/apple-5.jpeg",
    "name": "goods5",
    "description": "goods5",
  },
  {
    "id": "6",
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/apple-6.jpeg",
    "name": "goods6",
    "description": "goods6",
  },
  {
    "id": "7",
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/apple-7.jpeg",
    "name": "goods7",
    "description": "goods7",
  },
  {
    "id": "8",
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/apple-8.jpeg",
    "name": "goods7",
    "description": "goods7",
  },
  {
    "id": "9",
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
    "name": "goods9",
    "description": "goods9",
  },
  {
    "id": "10",
    "retail_price": "300",
    "counter_price": "3000",
    "pic_url": "https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg",
    "name": "goods10",
    "description": "goods10",
  },
])

const gotoGoodsDetail=(id)=>{

}
</script>
<style lang="less" scoped>
.hot {
  //padding: 0 10px;
  //margin-top: 10px;


  &-header {
    vertical-align: middle;

    &-title {
      display: inline-block;
      font-size: 14px;
      height: 30px;
      line-height: 30px;
    }

    &-more {
      .van-icon {
        margin-left: 5px;
        height: 30px;
        line-height: 30px;
        float: right;
      }
    }
  }
}
</style>