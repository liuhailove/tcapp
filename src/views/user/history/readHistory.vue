<template>
  <div class="order">
    <van-nav-bar
        title="我的足迹"
        :fixed="true"
        right-text="清空"
        left-arrow
        @click-left="onClickLeft"
        @click-right="clear"
    />
    <van-empty description="无浏览历史" v-if="productList==null||productList.length === 0"/>

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
            :price="item.productPrice"
            :desc="item.productSubTitle"
            :title="item.productName"
            :tag="index<3?'hot':''"
            :thumb="item.productPic"
            @click="gotoProductDetail(item.productId)">
          <template #footer>
            <span>{{ formatDateTime(item.createTime) }}</span>
          </template>
        </van-card>
      </van-list>
    </van-pull-refresh>

  </div>
</template>
<script setup lang="ts">
import {clearReadHistory, fetchReadHistoryList} from "@/api/memberReadHistory";
import {showConfirmDialog} from "vant";
import {formatDate} from "@/utils/date";

const router = useRouter();
const productList = ref([]);
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const searchParam = {
  pageNum: 1,
  pageSize: 5,
};
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
  fetchReadHistoryList(searchParam).then(response => {
    let list = response.data.list;
    if (type === 'refresh') {
      productList.value = list;
    } else {
      if (list != null && list.length > 0) {
        productList.value = productList.value.concat(list);
        loading.value = false;
      } else {
        // 没有更多了
        searchParam.pageNum--;
        finished.value = true;
      }
    }
  })
}

// 清空浏览历史
const clear = () => {
  showConfirmDialog({
    title: '提示',
    message:
        '是否要清空所有浏览记录？',
  }).then(() => {
    // on confirm
    clearReadHistory(
    ).then(response => {
      loadData();
    });
  }).catch(() => {
    // on cancel
  });
}

const formatDateTime = (time) => {
  if (time == null || time === '') {
    return 'N/A';
  }
  let date = new Date(time);
  return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
}
const onClickLeft = () => {
  router.go(-1)
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
<style lang="less" scoped>
.content {
  background: #f8f8f8;
}

.hot-section {
  display: flex;
  flex-wrap: wrap;
  padding: 0 30px;
  margin-top: 16px;
  background: #fff;

  .guess-item {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding-bottom: 40px;
  }

  .image-wrapper {
    width: 30%;
    height: 250px;
    border-radius: 3px;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
      opacity: 1;
    }
  }

  .title {
    font-size: 32px;
    color: #303133;
    line-height: 80px;
  }

  .title2 {
    font-size: 24px;
    color: #909399;
    line-height: 40px;
    height: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }

  .price {
    font-size: 32px;
    color: #fa436a;
    line-height: 80px;
  }

  .txt {
    width: 70%;
    display: flex;
    flex-direction: column;
    padding-left: 40px;
  }

  .hor-txt {
    display: flex;
    justify-content: space-between;
  }

  .time {
    font-size: 24px;
    color: #303133;
    line-height: 80px;
  }
}

.order {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 10px;
  background-color: #f5f5f5;
  z-index: 2000;
  padding-top: 44px;
  overflow: auto;
}


</style>
