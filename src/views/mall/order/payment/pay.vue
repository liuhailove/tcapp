<!-- 订单支付页面 -->
<template>
  <div class="payment">
    <van-nav-bar
        title="支付订单"
        :fixed="true"
        left-arrow
        @click-left="onClickLeft"/>

    <van-cell-group class="payment-tip">
      <van-cell :border="false" style="text-align: center">
        <img src="@/assets/images/order_submit_success.png" height="64" width="64"/></van-cell>
      <van-cell :border="false" style="font-size: 18px">
        订单提交成功
      </van-cell>
      <van-cell :border="false" style="font-size: 16px">
        请在
        <van-count-down :time="time" format=" HH 时 mm 分 ss 秒"/>
        内完成支付
      </van-cell>
      <van-cell :border="false" style="font-size: 14px">
        支付金额
        <span style="color: #FB0017;font-size: 14px;font-weight: bold;margin-left: 5px">
                    {{ orderInfo.payAmount }}
                </span>
      </van-cell>
    </van-cell-group>

    <!-- 支付方式 -->
    <van-cell-group title="支付方式">
      <van-cell title="支付宝支付" is-link icon="alipay" @click="onClickPayWithAlipay"/>
      <van-cell title="微信支付" is-link icon="wechat" @click="onClickPayWithWechat"/>
      <van-cell title="银联支付" is-link @click="onClickPayWithUnionPay">
        <template #icon>
          <svg-icon iconClass="unionpay"
                    class="unionpay" style="margin:4px 7px 0 0"/>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 路由出口 -->
    <transition name="router-slider"
                mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script setup lang="ts">
// 30分钟
const router = useRouter();
import {fetchOrderDetail, payOrderSuccess} from "@/api/order";
import {API_BASE_URL, USE_ALIPAY} from "@/utils/appConfig";

const route = useRoute();
const time = ref(30 * 60 * 1000);

// 订单ID
const orderId = ref(null);
// 订单信息
const orderInfo = ref({});
// 支付类型
const payType = ref(1);
// 点击返回
const onClickLeft = () => {
  router.back();
}

onMounted(() => {
  // 支付
  onLoadData();
});

const onLoadData = () => {
  orderId.value = route.params.orderId;
  fetchOrderDetail(route.params.orderId).then(response => {
    orderInfo.value = response.data;
  });
}

const onClickPayWithAlipay = () => {
  if (USE_ALIPAY) {
    window.location.href = API_BASE_URL + "/alipay/webPay?outTradeNo=" + orderInfo.value.orderSn + "&subject=" + orderInfo.value.receiverName + "的商品订单" + "&totalAmount=" + orderInfo.value.totalAmount;
  } else {
    payOrderSuccess({
      orderId: orderId.value,
      payType: payType.value,
    }).then(response => {
      router.push({
        name: "paySuccess",
        params: {
          paymentResult: "success",
          paymentMode: "支付宝支付",
          paymentAmount: orderInfo.value.payAmount,
        }
      });
    });
  }
}

const onClickPayWithWechat = () => {

}

const onClickPayWithUnionPay = () => {

}
</script>


<style lang="less" scoped>
.payment {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 200;
  padding-top: 44px;

  &-tip {
    .van-cell__value--alone {
      text-align: center;
      color: #666666;
    }

    .van-count-down {
      display: inline-block;
    }

    .van-cell {
      padding: 5px 16px;
    }
  }

  .van-cell-group__title {
    background: #FFFFFF;
    margin-top: 0.6rem;
  }

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

}
</style>