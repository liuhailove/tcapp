<!-- 人气推荐 -->
<template>
  <div class="productListClass">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
          v-model:loading="loading"
          :finished="finished"
          loading-text="加载中..."
          finished-text="没有更多了"
          :offset="50"
          @load="onLoad"
      >
        <van-card
            v-for="(item,index) in recommendProductList"
            class="hot-goods-item"
            :price="item.price"
            :desc="item.subTitle"
            :title="item.name"
            :tag="index<3?'hot':''"
            :thumb="item.pic"
            @click="gotoProductDetail(item.id)">
          <template #tags>
            <van-tag plain type="danger">多色可选</van-tag>
          </template>
        </van-card>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script setup lang="ts">
import {fetchRecommendProductList} from "@/api/home";
import {useRouter} from "vue-router";
// 路由
let router = useRouter()
const loading = ref(false);
const finished = ref(false);
const recommendProductList = ref([]);
const refreshing = ref(false);
const recommendParams = {
  pageNum: 1,
  pageSize: 10,
};
// 加载
const onLoad = async () => {
  loading.value = false;
  await loadData();
};

// 刷新
const onRefresh = () => {
  // 清空数据
  finished.value = false;
  // 重新加载
  loading.value = false;
  //
  refreshing.value = true;
  loadData();
};

// 异步数据加载
const loadData = async () => {
  if (refreshing.value) {
    recommendProductList.value = [];
    refreshing.value = false;
    recommendParams.pageNum = 1;
  }
  let addProductList;
  fetchRecommendProductList(recommendParams).then(response => {
    addProductList = response.data;
    if (addProductList.length == 0) {
      //没有更多了
      recommendParams.pageNum--;
      finished.value = true;
    } else {
      recommendParams.pageNum++;
      let latestRecommendProductList = recommendProductList.value;
      latestRecommendProductList = latestRecommendProductList.concat(addProductList);
      recommendProductList.value = latestRecommendProductList;
      loading.value = false;
    }
  });
};

const gotoProductDetail = (productId) => {
  router.push({
    name: 'product',
    params: {
      productId: productId
    }
  })
};
</script>

<style scoped>
.productListClass {
  height: 100vh;
  overflow-y: auto;
}
</style>

<!--<style lang="less">-->
<!--page {-->
<!--  .cate-section {-->
<!--    position: relative;-->
<!--    z-index: 5;-->
<!--    border-radius: 16 upx 16 upx 0 0;-->
<!--    margin-top: -20 upx;-->
<!--  }-->

<!--  .carousel-section {-->
<!--    padding: 0;-->

<!--    .titleNview-placing {-->
<!--      padding-top: 0;-->
<!--      height: 0;-->
<!--    }-->

<!--    .carousel {-->
<!--      .carousel-item {-->
<!--        padding: 0;-->
<!--      }-->
<!--    }-->

<!--    .swiper-dots {-->
<!--      left: 45 upx;-->
<!--      bottom: 40 upx;-->
<!--    }-->
<!--  }-->
<!--}-->


<!--page {-->
<!--  background: #f5f5f5;-->
<!--}-->


<!--/* 猜你喜欢 */-->
<!--.guess-section {-->
<!--  display: flex;-->
<!--  flex-wrap: wrap;-->
<!--  padding: 0 30 upx;-->
<!--  background: #fff;-->

<!--  .guess-item {-->
<!--    display: flex;-->
<!--    flex-direction: column;-->
<!--    width: 48%;-->
<!--    padding-bottom: 40 upx;-->

<!--    &:nth-child(2n+1) {-->
<!--      margin-right: 4%;-->
<!--    }-->
<!--  }-->

<!--  .image-wrapper {-->
<!--    width: 100%;-->
<!--    height: 330 upx;-->
<!--    border-radius: 3px;-->
<!--    overflow: hidden;-->

<!--    image {-->
<!--      width: 100%;-->
<!--      height: 100%;-->
<!--      opacity: 1;-->
<!--    }-->
<!--  }-->

<!--  .image-wrapper-brand {-->
<!--    width: 100%;-->
<!--    height: 150 upx;-->
<!--    border-radius: 3px;-->
<!--    overflow: hidden;-->

<!--    image {-->
<!--      width: 100%;-->
<!--      height: 100%;-->
<!--      opacity: 1;-->
<!--    }-->
<!--  }-->

<!--  .title {-->
<!--    font-size: 32 upx;-->
<!--    color: #303133;-->
<!--    line-height: 80 upx;-->
<!--  }-->

<!--  .title2 {-->
<!--    font-size: 24 upx;-->
<!--    color: #909399;-->
<!--    line-height: 40 upx;-->
<!--  }-->

<!--  .price {-->
<!--    font-size: 32 upx;-->
<!--    color: #fa436a;-->
<!--    line-height: 1;-->
<!--  }-->
<!--}-->

<!--.hot-section {-->
<!--  display: flex;-->
<!--  flex-wrap: wrap;-->
<!--  padding: 0 30 upx;-->
<!--  background: #fff;-->

<!--  .guess-item {-->
<!--    display: flex;-->
<!--    flex-direction: row;-->
<!--    width: 100%;-->
<!--    padding-bottom: 40 upx;-->
<!--  }-->

<!--  .image-wrapper {-->
<!--    width: 30%;-->
<!--    height: 250 upx;-->
<!--    border-radius: 3px;-->
<!--    overflow: hidden;-->

<!--    image {-->
<!--      width: 100%;-->
<!--      height: 100%;-->
<!--      opacity: 1;-->
<!--    }-->
<!--  }-->

<!--  .title {-->
<!--    font-size: 32 upx;-->
<!--    color: #303133;-->
<!--    line-height: 80 upx;-->
<!--  }-->

<!--  .title2 {-->
<!--    font-size: 24 upx;-->
<!--    color: #909399;-->
<!--    line-height: 40 upx;-->
<!--    height: 80 upx;-->
<!--    overflow: hidden;-->
<!--    text-overflow: ellipsis;-->
<!--    display: block;-->
<!--  }-->

<!--  .price {-->
<!--    font-size: 32 upx;-->
<!--    color: #fa436a;-->
<!--    line-height: 80 upx;-->
<!--  }-->

<!--  .txt {-->
<!--    width: 70%;-->
<!--    display: flex;-->
<!--    flex-direction: column;-->
<!--    padding-left: 40 upx;-->
<!--  }-->
<!--}-->

<!--</style>-->