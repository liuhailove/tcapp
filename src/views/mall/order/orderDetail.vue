<!-- 创建订单 -->
<template>
  <van-nav-bar
      title="订单明细"
      :fixed="true"
      left-arrow
      @click-left="onClickLeft"
  />
  <div class="status-section">
   <van-image :src="orderStatus.image" class="icon"/>
    <p class="label-text">{{orderStatus.text}}</p>
  </div>
  <van-cell-group style="margin-top: 0.6rem">
    <van-cell title="姓名">{{ order.receiverName }}</van-cell>
    <van-cell title="电话">{{ order.receiverPhone }}</van-cell>
    <van-cell-group title="地址">
      <div class="address">
        <van-cell title="详细地址" :label-width="labelWidth">{{ order.receiverDetailAddress }}</van-cell>
        <van-cell title="街道" :label-width="labelWidth">{{ order.receiverRegion }}</van-cell>
        <van-cell title="城市" :label-width="labelWidth">{{ order.receiverCity }}</van-cell>
        <van-cell title="省份" :label-width="labelWidth">{{ order.receiverProvince }}</van-cell>
        <van-cell title="邮编" :label-width="labelWidth">Postal Code</van-cell>
      </div>
    </van-cell-group>
  </van-cell-group>
  <!-- 商品列表 -->
  <van-cell-group title="商品信息" style="margin-top: 0.6rem">
    <van-card
        v-for="(item,index) in order.orderItemList"
        :key="index"
        :num="item.sku_quantity"
        :desc="formatProductAttr(item.productAttr)"
        :title="item.productName"
        :thumb="item.productPic">
      <template #tags>
        {{ item.promotionName }}
      </template>
      <template #price>
        {{ moneyFormat(item.productPrice) }}
      </template>
      <template #num>
        {{ item.productQuantity }}
      </template>
    </van-card>
  </van-cell-group>
  <!-- 商品金额 -->
  <van-cell-group style="margin-top: 0.6rem">
    <van-cell title="商品金额">
      <div class="money">{{ order.totalAmount }}</div>
    </van-cell>
    <van-cell title="运费">
      <div class="money">{{ order.freightAmount }}</div>
    </van-cell>
    <van-cell title="活动优惠">
      <div class="money">-{{ order.promotionAmount }}</div>
    </van-cell>
    <van-cell title="优惠券">
      <div class="money">-{{ order.couponAmount }}</div>
    </van-cell>
    <van-cell title="积分抵扣">
      <div class="money">-{{ order.integrationAmount }}</div>
    </van-cell>
    <van-cell title="备注">
      <div class="money">{{ order.note }}</div>
    </van-cell>
  </van-cell-group>

  <!--订单明细-->
  <van-cell-group style="margin-top: 0.6rem">
    <van-cell title="订单编号">
      <div class="money">{{ order.orderSn }}</div>
    </van-cell>
    <van-cell title="提交时间">
      <div class="money">{{ formatDateTime(order.createTime) }}</div>
    </van-cell>
    <van-cell title="支付方式">
      <div class="money">{{ formatPayType(order.payType) }}</div>
    </van-cell>
    <van-cell title="实付金额" v-if="order.status===1|| order.status===2 || order.status===3">
      <div class="money">{{ order.payAmount }}</div>
    </van-cell>
    <van-cell title="付款时间" v-if="order.status===1|| order.status===2 || order.status===3">
      <div class="money">{{ formatDateTime(order.paymentTime) }}</div>
    </van-cell>
  </van-cell-group>

  <van-cell-group class="footer" v-if="order.status===1 || order.status===2 || order.status===3">
    <van-cell>
      <template #default>
        <van-button plain type="default" v-if="order.status===0" size="small" @click="cancelOrder(order.id)">
          取消订单
        </van-button>
        <van-button plain type="danger" v-if="order.status===0" size="small" @click="payOrder(order.id)">
          立即付款
        </van-button>
        <van-button plain type="default" v-if="order.status===1" size="small">
          提醒发货
        </van-button>
        <van-button plain type="default" v-if="order.status===2" size="small">
          查看物流
        </van-button>
        <van-button plain type="default" v-if="order.status===2" size="small" @click="receiveOrder(order.id)">
          确认收货
        </van-button>
        <van-button plain type="default" v-if="order.status===3" size="small">
          申请售后
        </van-button>
        <van-button plain type="default" v-if="order.status===3" size="small">
          评价商品
        </van-button>
        <van-button plain type="default" v-if="order.status===3" size="small">
          再次购买
        </van-button>
        <van-button plain type="default" v-if="order.status===4" size="small">
          删除
        </van-button>
        <van-button plain type="danger" v-if="order.status===0" size="small" @click="payOrder(order.id)">
          应付金额
          <van-field>{{ order.payAmount }}</van-field>
        </van-button>
      </template>
    </van-cell>
  </van-cell-group>
  <!-- 路由出口 -->
  <transition name="router-slider"
              mode="out-in">
    <router-view></router-view>
  </transition>
</template>

<script setup lang="ts">
import {fetchOrderDetail, generateOrder} from "@/api/order";
import {showConfirmDialog, showToast} from "vant";
import {moneyFormat} from "@/utils/filter";
import {formatDate} from "@/utils/date";

const orderId = ref(null);
const order = ref({});
const orderStatus = ref({});
// 联系人
const concat = ref({
  type: 'add',
  name: undefined,
  tel: undefined,
  id: undefined,
  address: undefined
});
// 优惠券
const coupons = ref([]);
// 被选择的券
const chosenCoupon = ref(-1);
const currCoupon = ref(null);
// 是否显示优惠券
const showCoupon = ref(false);
// 运费
const freight = ref(8);
// 商品列表
const goodsList = ref([]);
// 勾选商品总价
const selectedTotalPrice = ref(0);
const buyerMessage = ref(undefined);
// 收货地址
const memberReceiveAddressList = ref([]);
// 当前地址
const currentAddress = ref({});
// 订单金额
const calcAmount = ref({});
// 使用积分
const useIntegration = ref(0);
// 积分使用设置
const integrationConsumeSetting = ref({});
// 会员积分
const memberIntegration = ref(0);
const chosenAddressId = ref(null);
const disabledList = ref([]);
const couponList = ref([]);
const disabledCoupons = ref([]);

// 引入路由
const router = useRouter();
const route = useRoute();

onMounted(() => {
  orderId.value = route.params.orderId;
  console.info(route.params.orderId);
  loadData();
});

const loadData = () => {
  fetchOrderDetail(route.params.orderId).then(response => {
    order.value = response.data;
    setOrderStatus(order.value.status);
  });

};

// 设置订单状态信息
const setOrderStatus = (status) => {
  switch (status) {
    case 0:
      orderStatus.value = {
        text: '等待付款',
        image: '/src/assets/images/icon_wait.png'
      }
      break;
    case 1:
      orderStatus.value = {
        text: '等待发货',
        image: '/src/assets/images/icon_deliver.png'
      }
      break;
    case 2:
      orderStatus.value = {
        text: '等待收货',
        image: '/src/assets/images/icon_receive.png'
      }
      break;
    case 3:
      orderStatus.value = {
        text: '交易完成',
        image: '/src/assets/images/icon_finish.png'
      }
      break;
    case 4:
      orderStatus.value = {
        text: '交易关闭',
        image: '/src/assets/static/icon_close.png'
      }
      break;
  }
}

const formatCouponUseType = (useType) => {
  if (useType == 0) {
    return "全场通用";
  } else if (useType == 1) {
    return "指定分类商品可用";
  } else if (useType == 2) {
    return "指定商品可用";
  }
  return null;
};

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
  return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
}

const formatPayType = (payType) => {
  if (payType == 0) {
    return "未支付";
  } else if (payType == 1) {
    return "支付宝支付";
  } else if (payType == 2) {
    return "微信支付";
  }
  return null;
}
// 获取默认收货地址
const getDefaultAddress = (memberReceiveAddressList) => {
  for (let item of memberReceiveAddressList) {
    if (item.defaultStatus === 1) {
      return item;
    }
  }
  if (memberReceiveAddressList != null && memberReceiveAddressList.length > 0) {
    return memberReceiveAddressList[0];
  }
  return {};
}

const formatOrderStatus = (status) => {
  let desc;
  if (status === 1) {
    desc = '等待付款'
  } else if (status === 2) {
    desc = '等待发货'
  } else if (status === 3) {
    desc = '等待收货'
  } else if (status === 4) {
    desc = '交易完成'
  } else if (status === 5) {
    desc = '交易关闭'
  }
  return desc;
}

// 点击返回
const onClickLeft = () => {
  router.go(-1)
}

// 选择地址
const chooseConcat = () => {
  router.push({path: '/order/address',})
}

const onChange = (index) => {
  showCoupon.value = false;
  chosenCoupon.value = index;
  currCoupon.value = couponList.value[chosenCoupon.value];
  calcPayAmount();
}
// 积分转金额
const calcIntegrationAmount = (integration) => {
  if (integrationConsumeSetting.value === undefined || integrationConsumeSetting.value === null) {
    return 0;
  }
  if (integrationConsumeSetting.value.couponStatus == 0) {
    return 0;
  }
  return integration / integrationConsumeSetting.value.deductionPerAmount;
}

const handleIntegrationInput = () => {
  if (useIntegration.value > memberIntegration.value) {
    useIntegration.value = memberIntegration.value;
    showToast({
      message: `您的积分只有${memberIntegration.value}`,
      duration: 1000
    });
  }
  calcPayAmount();
}

//计算支付金额
const calcPayAmount = () => {
  var calcAmountVal = calcAmount.value;
  var payAmount = calcAmountVal.totalAmount - calcAmountVal.promotionAmount - calcAmountVal.freightAmount;
  // 是否有使用优惠券
  if (chosenCoupon.value > -1) {
    payAmount = payAmount - couponList.value[chosenCoupon.value].value / 100;
  }
  if (useIntegration.value != 0) {
    payAmount = payAmount - calcIntegrationAmount(useIntegration.value);
  }
  calcAmount.value.payAmount = payAmount;
}

</script>


<style lang="less" scoped>
.order {
  padding-top: 3rem;

  /*转场动画*/

  .router-slider-enter-active,
  .router-slider-leave-active {
    transition: all 0.3s;
  }

  .router-slider-enter,
  .router-slider-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }

  .van-cell:not(:last-child)::after {
    left: 0 !important;
  }

  .custom-submit-bar {
    z-index: 999; /* 自定义的 z-index 值 */
  }

  .fixed-submit-bar {
    position: fixed; /* 使用固定定位 */
    bottom: 0; /* 将组件固定在底部 */
    left: 0; /* 可根据需要调整位置 */
    width: 100%; /* 设置组件宽度占满父元素 */
    z-index: 1000;
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

  .promotion {
    font-size: 24px;
    color: #fa436a;
  }

}

.footer {
  position: fixed;
  flex-direction: row-reverse;
  left: 0;
  bottom: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  width: 100%;
  height: 90px;
  justify-content: space-between;
  font-size: 30px;
  background-color: #fff;
  color: #606266;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, .1);

  .price-content {
    padding-left: 30px;
  }

  .price-tip {
    color: #fa436a;
    margin-left: 8px;
  }

  .price {
    font-size: 36px;
    color: #fa436a;
  }

  .submit {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 280px;
    height: 100%;
    color: #fff;
    font-size: 32px;
    background-color: #fa436a;
  }
}

.address-info {
  margin-top: 10px;
}

.status-section {
  height: 100px;
  background-color: #fa436a;
  display: flex;
  align-items: center;
  padding: 40px;

  .icon {
    width: 48px;
    height: 48px;
  }

  .label-text {
    color: #fff;
    margin-left: 20px;
  }
}

</style>