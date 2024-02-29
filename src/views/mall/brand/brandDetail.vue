<template>
  <van-nav-bar
      title="品牌详情"
      :fixed=true
      left-arrow
      @click-left="onClickLeft"
  >
  </van-nav-bar>
  <!-- 顶部大图 -->
  <div class="top-image">
    <div class="image-wrapper">
      <van-image :src="brand.bigPic" fit="cover"/>
    </div>
  </div>
  <!-- 品牌信息 -->
  <div class="info">
    <div class="image-wrapper">
      <van-image :src="brand.logo"/>
    </div>
    <div class="title">
      <div class="title">{{ brand.name }}</div>
      <div class="title2">品牌首字母：{{ brand.firstLetter }}</div>
    </div>
    <div class="yticon">
      <van-icon name="like" :color="favoriteStatus===true?'#ff5000':''" @click="favorite"/>
    </div>
  </div>
  <!-- 品牌故事 -->
  <div class="section-tit">品牌故事</div>
  <div class="brand-story">
    <div class="text">{{ brand.brandStory }}</div>
  </div>
  <div class="section-tit">相关商品</div>
  <van-empty description="无商品记录" v-if="productList==null||productList.length === 0"/>

  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
        v-model:loading="loading"
        :finished="finished"
        loading-text="加载中..."
        finished-text="没有更多了"
        :offset="50"
        @load="loadData('add')"
    >
      <van-card
          v-for="(item,index) in productList"
          class="hot-goods-item"
          :price="item.price"
          :desc="item.subTitle"
          :title="item.name"
          :tag="index<3?'hot':''"
          :thumb="item.pic"
          @click="gotoProductDetail(item.id)">
        <template #tags>
          <van-tag plain type="primary">已售 {{ item.sale }}</van-tag>
        </template>
      </van-card>
    </van-list>
  </van-pull-refresh>
</template>

<script setup lang="ts">
import {fetchBrandProductList, getBrandDetail} from "@/api/brand";
import {showSuccessToast} from "vant";
import {createBrandAttention, deleteBrandAttention} from "@/api/memberBrandAttention";

const router = useRouter();
const route = useRoute();
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const searchParam = {
  pageNum: 1,
  pageSize: 10,
  brandId: -1,
};
const loaded = ref(true);
const productList = ref([]);
const favoriteStatus = ref(false);
const brand = ref({});
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
  // 品牌Id
  let brandId = route.params.id;
  getBrandDetail(brandId).then(response => {
    brand.value = response.data;
  });

  if (type === 'refresh') {
    searchParam.pageNum = 1;
    refreshing.value = false;
  } else {
    searchParam.pageNum++;
  }
  searchParam.brandId = Number(brandId);
  fetchBrandProductList(searchParam).then(response => {
    let list = response.data.list;
    if (type === 'refresh') {
      productList.value = list;
    } else {
      if (list != null && list.length > 0) {
        productList.value = productList.concat(list);
        loading.value = false;
      } else {
        // 没有更多了
        searchParam.pageNum--;
        finished.value = true;
      }
    }
  })
}

// 收藏
const favorite = () => {
  if (favoriteStatus.value) {
    // 取消收藏
    deleteBrandAttention({
      brandId: brand.value.id,
    }).then(response => {
      showSuccessToast('取消收藏成功');
      favoriteStatus.value = !favoriteStatus.value;
    })
  } else {
    //收藏
    let brandAttention = {
      brandId: brand.value.id,
      brandName: brand.value.name,
      brandLogo: brand.value.logo,
      brandCity: ""
    }
    createBrandAttention(brandAttention).then(response => {
      showSuccessToast('收藏成功');
      favoriteStatus.value = !favoriteStatus.value;
    });
  }
}

const gotoProductDetail = (productId) => {
  router.push({
    name: 'product',
    params: {
      productId: productId
    }
  })
};

</script>
<style lang="less">
.title {
  font-size: 12px;
  color: #303133;
  line-height: 18px;
  text-align: left;
}


.section-tit {
  font-size: 10px;
  color: #303133;
  background: #fff;
  margin-top: 10px;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
}

.top-image {
  height: 200px;

  .image-wrapper {
    display: flex;
    justify-content: center;
    align-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
    }
  }
}

.info {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background: #fff;
  margin-top: 5px;

  .image-wrapper {
    width: 100px;
    height: 80px;
    background: #fff;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .title {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    margin-left: 30px;
    color: #303133;
  }

  .title2 {
    font-size: 12px;
    color: #909399;
    line-height: 20px;
    height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    text-align: left;
  }

  .yticon {
    font-size: 30px;
    color: #606266;
    margin: 0 10px 0 30px;

    &.active {
      color: #ff4443;
    }
  }
}

.brand-story {
  display: flex;
  padding: 10px;
  background: #fff;
  font-size: 12px;

  .text {
    font-size: 12px;
    color: #909399;
    line-height: 20px;
    height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
    text-align: left;
  }
}


</style>