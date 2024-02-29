<template>
  <div class="brand">
    <van-nav-bar
        title="推荐品牌列表"
        :fixed=true
        left-arrow
        @click-left="onClickLeft"
    >
    </van-nav-bar>
    <van-image src="src/assets/images/recommend_brand_banner.png" fit="cover"/>
    <p class="section-tit">相关品牌</p>
    <van-empty description="无品牌记录" v-if="brandList==null||brandList.length === 0"/>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
          v-model:loading="loading"
          :finished="finished"
          loading-text="加载中..."
          finished-text="没有更多了"
          :offset="50"
          @load="loadData('add')"
      >
        <van-grid :border="false" :column-num="2">
          <van-grid-item v-for="(item,index) in brandList" @click="navToDetailPage(item.id)">
            <van-image :src="item.logo" fix="cover"/>
            <p class="title">品牌：{{ item.name }}</p>
            <p class="title2">商品数量：{{ item.productCount }}</p>
          </van-grid-item>
        </van-grid>
      </van-list>
    </van-pull-refresh>
  </div>

</template>

<script setup lang="ts">
import {fetchBrandRecommendList} from "@/api/brand";

const router = useRouter();
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const searchParam = {
  pageNum: 1,
  pageSize: 10,
};
const brandList = ref([]);
const onClickLeft = () => {
  router.go(-1);
}

onMounted(() => {
  // 初始化数据
  loadData();
});

// 刷新
const onRefresh = () => {
  // 清空数据
  finished.value = false;
  // 重新加载
  loading.value = false;
  // 刷新
  refreshing.value = true;
  loadData();
};

const loadData = (type = 'refresh') => {
  if (type === 'refresh') {
    searchParam.pageNum = 1;
    refreshing.value = false;
  } else {
    searchParam.pageNum++;
  }
  fetchBrandRecommendList(searchParam).then(response => {
    let list = response.data;
    let brandListArr = brandList.value;
    if (type === 'refresh') {
      brandList.value = list;
    } else {
      if (list != null && list.length > 0) {
        brandListArr = brandListArr.concat(list);
        brandList.value = brandListArr;
        loading.value = false;
      } else {
        // 没有更多了
        searchParam.pageNum--;
        finished.value = true;
      }
    }
  })
}

const navToDetailPage = (id) => {
  router.push({name: "brandDetail", params: {id: id}});
}

</script>
<style lang="less">
.title {
  font-size: 14px;
  color: #303133;
  line-height: 20px;
  text-align: left;
}

.title2 {
  font-size: 10px;
  color: #909399;
  line-height: 20px;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  text-align: left;
}

.section-tit {
  font-size: 22px;
  color: #303133;
  background: #fff;
  margin-top: 16px;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
}

</style>