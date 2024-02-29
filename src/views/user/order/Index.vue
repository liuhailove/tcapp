<template>
  <div class="order">
    <van-nav-bar
        title="我的订单"
        :fixed=true
        left-arrow
        @click-left="onClickLeft"
    />
    <div class="searchContainer">
      <van-search
          v-model="searchValue"
          input-align="center"
          show-action
          placeholder="搜索订单"
      >
        <template #left-icon>
          <van-icon name="search" class="search-icon"/>
        </template>
        <template #action>
          <van-icon name="ellipsis" @click="handleMoreFeatures"/>
        </template>
      </van-search>
    </div>
    <van-tabs class="order-category" v-model="activeName" @click-tab="onClickOrder" sticky>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
            v-model:loading="loading"
            :finished="finished"
            loading-text="加载中..."
            finished-text="没有更多了"
            :offset="50"
            @load="loadData('add')"
        >
          <van-tab title="全部" :name="-1">
            <OrderList :orderList="orderList" @child-event="loadData"></OrderList>
          </van-tab>
          <van-tab title="待付款" :name="0">
            <OrderList :orderList="orderList" @child-event="loadData"></OrderList>
          </van-tab>
          <van-tab title="待发货" :name="1">
            <OrderList :orderList="orderList" @child-event="loadData"></OrderList>
          </van-tab>
          <van-tab title="待收货/使用" :name="2">
            <OrderList :orderList="orderList" @child-event="loadData"></OrderList>
          </van-tab>
          <van-tab title="待评价" :name="3">
            <OrderList :orderList="orderList" @child-event="loadData"></OrderList>
          </van-tab>
          <van-tab title="售后" :name="4">
            <OrderList :orderList="orderList" @child-event="loadData"></OrderList>
          </van-tab>
        </van-list>
      </van-pull-refresh>
    </van-tabs>
    <div class="moreFeatures">
      <!-- 底部弹出 -->
      <van-popup
          v-model:show="showBottom"
          round
          closeable
          close-icon="close"
          position="bottom"
          :style="{ height: '40%' }"
      >
        <div class="popup-header">
          <span class="popup-title">更多功能</span>
          <!--        <van-icon name="cross" class="popup-close" @click="hideMoreFeatures" />-->
        </div>
        <div class="popup-content">
          <!-- 弹出框导航项内容 -->
          <van-grid :column-num="5" :border="false" :square="false" :justify="'start'">
            <van-grid-item v-for="(gridItem,idx) in navItems"
                           :key="idx"
                           :icon="gridItem.icon"
                           :text="gridItem.text"
                           :badge="gridItem.badge"
                           @click="handleGridClick(gridItem.to)"
                           :style="{height: '10%'}"
            />
          </van-grid>
          <van-divider/>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script setup lang="ts">
import OrderList from '@/views/user/order/components/OrderList/Index.vue';
import {fetchOrderList} from "@/api/order";

const searchValue = ref('');
const showBottom = ref(false)
const router = useRouter();
const route = useRoute();
const activeName = ref(-1);
const orderList = ref([]);
const orderParam = ref({
  status: -1,
  pageNum: 1,
  pageSize: 5,
});
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
onMounted(() => {
  if (route.params.active !== null) {
    orderParam.value.status = activeName.value;
  }
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
  let orderParamVal = orderParam.value;
  if (type === 'refresh') {
    orderParamVal.pageNum = 1;
    refreshing.value = false;
  } else {
    orderParamVal.pageNum++;
  }
  fetchOrderList(orderParamVal).then(response => {
    let list = response.data.list;
    if (type === 'refresh') {
      orderList.value = list;
    } else {
      if (list != null && list.length > 0) {
        orderList.value = orderList.value.concat(list);
        loading.value = false;
      } else {
        // 没有更多了
        orderParamVal.pageNum--;
        finished.value = true;
      }
      orderParam.value = orderParamVal;
    }
  })
}

const onClickLeft = () => {
  router.go(-1)
};

const onClickOrder = (tab, index) => {
  orderParam.value.status = tab.name;
  finished.value = false;
  loading.value = false;
  loadData();
}

const handleMoreFeatures = () => {
  showBottom.value = true
}

const handleGridClick = (toUrl) => {
  router.push({path: toUrl})
}

const navItems = ref([
  {
    icon: "setting-o",
    text: "授权设置",
    to: "/user/config",
    badge: ""
  },
  {
    icon: "location-o",
    text: "我的地址",
    to: "/user/address",
    badge: ""
  },
  {
    icon: "cart-o",
    text: "购物车",
    to: "/",
    badge: "10"
  },
  {
    icon: "chat-o",
    text: "客服消息",
    to: "/",
    badge: "99"
  },
  {
    icon: "shop-collect-o",
    text: "同辰商城",
    to: "/",
    badge: ""
  },
  {
    icon: "coupon-o",
    text: "卡券红包",
    to: "/user/coupon",
    badge: ""
  },
  {
    icon: "comment-o",
    text: "评价中心",
    to: "/",
    badge: ""
  },
  {
    icon: "cash-back-record-o",
    text: "同辰月付",
    to: "/",
    badge: ""
  },
  {
    icon: "hot-sale-o",
    text: "热卖",
    to: "/",
    badge: ""
  },
  {
    icon: "star-o",
    text: "我的收藏",
    to: "/user/productCollection",
    badge: ""
  },
  {
    icon: "browsing-history-o",
    text: "浏览历史",
    to: "/user/readHistory",
    badge: ""
  },
  {
    icon: "like-o",
    text: "我的关注",
    to: "/user/brandAttention",
    badge: ""
  },
]);
</script>
<style lang="less" scoped>

.order {
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

.searchContainer {
  margin-bottom: auto;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background-color: #f5f5f5;
}

.popup-title {
  font-size: 16px;
  font-weight: bold;
}

.popup-close {
  font-size: 20px;
  color: #999;
}

.nav-container {
  height: 20px
}

</style>