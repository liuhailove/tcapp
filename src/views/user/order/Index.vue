<template>
  <div class="order">
    <van-nav-bar
        title="我的订单"
        :fixed=true
        left-arrow
        @click-left="onClickLeft"
    />
    <van-tabs class="order-category" v-model="activeName" @click="onClickOrder" sticky>
      <van-tab title="全部" :name="-1">
        <OrderList :orderList="orderList"></OrderList>
      </van-tab>
      <van-tab title="待付款" :name="0">
        <OrderList :orderList="orderList"></OrderList>
      </van-tab>
      <van-tab title="待发货" :name="1">
        <OrderList :orderList="orderList"></OrderList>
      </van-tab>
      <van-tab title="待收货/使用" :name="2">
        <OrderList :orderList="orderList"></OrderList>
      </van-tab>
      <van-tab title="待评价" :name="3">
        <OrderList :orderList="orderList"></OrderList>
      </van-tab>
      <van-tab title="售后" :name="4">
        <OrderList :orderList="orderList"></OrderList>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script setup lang="ts">
import OrderList from '@/views/user/order/components/OrderList/Index.vue';
import {fetchOrderList} from "@/api/order";

const router = useRouter();
const route = useRoute();
const activeName = ref(-1);
const orderList = ref([]);
const orderParam = ref({
  status: -1,
  pageNum: 1,
  pageSize: 5,
});
onMounted(() => {
  // 初始化数据
  loadData();
});

const loadData = (type = 'refresh') => {
  let orderParamVal = orderParam.value;
  if (type === 'refresh') {
    orderParamVal.pageNum = 1;
  } else {
    orderParamVal.pageNum++;
  }
  if (route.params.active !== null) {
    orderParamVal.status = activeName.value;
  }
  fetchOrderList(orderParamVal).then(response => {
    let list = response.data.list;
    if (type === 'refresh') {
      orderList.value = list;
    } else {
      if (list != null && list.length > 0) {
        orderList.value = orderList.value.concat(list);
      } else {
        orderParamVal.pageNum--;
      }
      orderParam.value = orderParamVal;
    }
  })
}

const onClickLeft = () => {
  router.go(-1)
};
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
</style>