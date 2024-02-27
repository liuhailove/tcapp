<template>
  <div id="orderList">
    <div v-if="orderList.length>0">
      <div class="order" v-for="item in orderList">
        <div class="order-header">
          <van-cell
              :value="formatOrderStatus(item.status)"
              @click="showOrderDetail(item.id)">
            <template #title>
                        <span class="custom-title" style="width: 100px">
                            {{ formatOrderNo(item.orderSn) }}
                        </span>
            </template>
          </van-cell>
        </div>

        <div class="order-goods">
          <van-card v-for="orderItem in item.orderItemList"
                    :title="orderItem.productName"
                    :num="orderItem.goodsCount"
                    :price="orderItem.productPrice"
                    :desc="formatProductAttr(orderItem.productAttr)+'x'+orderItem.productQuantity"
                    :thumb="orderItem.productPic">
            <template #tags>
              <van-tag plain type="danger">七天无理由退货</van-tag>
            </template>
          </van-card>
        </div>

        <div class="order-footer">
          <van-cell :title="formatOrderTotalPrice(item.status,item.payAmount)">
            <template #default>
              <van-button plain type="default" v-if="item.status===0" size="small" @click="cancelOrder(item.id)">
                取消订单
              </van-button>
              <van-button plain type="danger" v-if="item.status===0" size="small" @click="payOrder(item.id)">
                立即付款
              </van-button>
              <van-button plain type="default" v-if="item.status===1" size="small">
                提醒发货
              </van-button>
              <van-button plain type="default" v-if="item.status===2" size="small">
                查看物流
              </van-button>
              <van-button plain type="default" v-if="item.status===3" size="small" @click="receiveOrder(item.id)">
                确认收货
              </van-button>
              <van-button plain type="default" v-if="item.status===3" size="small" @click="deleteOrder(item.id)">
                删除
              </van-button>
              <van-button plain type="default" v-if="item.status===4" size="small">
                再次购买
              </van-button>
              <van-button plain type="default" v-if="item.status===4" size="small">
                删除
              </van-button>
            </template>
          </van-cell>
        </div>
      </div>
      <!-- 回到顶部按钮 -->
      <van-back-top style="z-index: 10000"/>
    </div>
    <div v-else class="no-data">
      <div>
        <img src="../../../../../assets/images/empty_shopping_cart.png" height="100" width="140"/>
      </div>
      <div> 还没有任何订单呢</div>
    </div>
  </div>
</template>

<script setup>
import {formatDate} from "@/utils/date";
import {showConfirmDialog} from "vant";
import {cancelUserOrder, confirmReceiveOrder, deleteUserOrder} from "@/api/order";

const router = useRouter();
const props = defineProps({
  orderList: {
    type: Array,
    default: []
  }
});
let $emit = defineEmits(["child-event"]);

// 删除订单
const deleteOrder = (orderId) => {
  showConfirmDialog({
    title: '提示',
    message: '是否要删除该订单？'
  }).then(() => {
    // 删除订单
    deleteUserOrder({orderId: orderId}).then(response => {
      $emit('child-event', 'refresh');
    });
  }).catch(() => {
    // 取消事件
  });
}

// 取消订单
const cancelOrder = (orderId) => {
  showConfirmDialog({
    title: '提示',
    message: '是否要取消该订单？'
  }).then(() => {
    // 取消订单
    cancelUserOrder({orderId: orderId}).then(response => {
      $emit('child-event', 'refresh');
    });
  }).catch(() => {
    // 取消事件
  });
}

// 支付订单
const payOrder = (orderId) => {
  router.push({name: "payment", params: {orderId: orderId}});
}
// 确认收货
const receiveOrder = (orderId) => {
  showConfirmDialog({
    title: '提示',
    message: '是否要确认收货？'
  }).then(() => {
    // 取消订单
    confirmReceiveOrder({orderId: orderId}).then(response => {
      $emit('child-event', 'refresh');
    });
  }).catch(() => {
    // 取消事件
  });
}


// 查看订单详情
const showOrderDetail = (orderId) => {
  router.push({
    name: "orderDetail",
    params: {
      orderId: orderId,
    }
  });
}

const formatOrderStatus = (status) => {
  let desc;
  if (status === 0) {
    desc = '等待付款'
  } else if (status === 1) {
    desc = '等待发货'
  } else if (status === 2) {
    desc = '等待收货'
  } else if (status === 3) {
    desc = '交易完成'
  } else if (status === 4) {
    desc = '交易关闭'
  }
  return desc;
}

const formatOrderNo = (orderNo) => {
  return '订单号：' + orderNo
}

const formatOrderTotalPrice = (status, totalPrice) => {
  let prefix = '已付金额'
  if (status === 1) {
    prefix = '实付金额'
  }
  return prefix + '：¥' + totalPrice
}
const formatProductAttr = (jsonAttr) => {
  let attrArr = JSON.parse(jsonAttr);
  let attrStr = '';
  for (let attr of attrArr) {
    attrStr += attr.key;
    attrStr += ":";
    attrStr += attr.value;
    attrStr += ";";
  }
  return attrStr
}
const formatDateTime = (time) => {
  if (time == null || time === '') {
    return 'N/A';
  }
  let date = new Date(time);
  return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
}
</script>

<style lang="less" scoped>

#orderList {
  .order:not(:first-child) {
    margin-top: 10px;
  }

  .order {
    &-header {
      .van-cell__title {
        -webkit-box-flex: 2;
        -webkit-flex: 2;
      }

      .van-cell__value {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        color: #ee0a24;
      }
    }

    &-goods {
      .van-card:not(:first-child) {
        margin-top: 0;
      }

      .van-card__title {
        font-weight: 700;
      }
    }

    &-footer {
      .van-button {
        margin-left: 5px;
      }
    }
  }

  .no-data {
    text-align: center;
    color: #666666;
    font-size: 16px;

    img {
      margin: 100px 0 10px;
    }
  }

}


</style>