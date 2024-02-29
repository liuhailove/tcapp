<!-- 创建订单 -->
<template>
  <div class="order">
    <van-nav-bar
        title="填写订单"
        :fixed="true"
        left-arrow
        @click-left="onClickLeft"
    />
    <!--    &lt;!&ndash; 收货人信息 &ndash;&gt;-->
    <!--    <van-contact-card-->
    <!--        add-text="选择收货人"-->
    <!--        v-model="isSelected"-->
    <!--        type="edit"-->
    <!--        :name="currentAddress.name"-->
    <!--        :tel="currentAddress.phoneNumber"-->
    <!--        :title="currentAddress.province"-->
    <!--        @click="chooseConcat"-->
    <!--    />-->
    <van-address-list
        v-model="chosenAddressId"
        :list="memberReceiveAddressList"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
    />
    <!-- 商品列表 -->
    <van-cell-group title="购买商品">
      <van-card
          v-for="(item,index) in cartPromotionItemList"
          :key="index"
          :num="item.sku_quantity"
          :desc="item.specs_desc"
          :title="item.productName"
          :thumb="item.productPic">
        <template #tags>
          <van-tag plain type="danger">七天无理由退货</van-tag>
        </template>

        <template #price>
          {{ moneyFormat(item.price) }}
        </template>
        <template #num>
          {{ item.quantity }}
        </template>
      </van-card>
    </van-cell-group>
    <!-- 优惠券 -->
    <van-cell-group style="margin-top: 0.6rem">
      <van-coupon-cell
          :coupons="couponList"
          :chosen-coupon="chosenCoupon"
          @click="showCoupon = true"
      />
      <!-- 优惠券列表 -->
      <van-popup
          v-model:show="showCoupon"
          round
          position="bottom"
          style="height: 90%; padding-top: 4px;">
        <van-coupon-list
            :coupons="couponList"
            :chosen-coupon="chosenCoupon"
            :disabled-coupons="disabledCoupons"
            @change="onChange"
            @exchange="onExchange"
        />
      </van-popup>
    </van-cell-group>
    <!-- 备注 -->
    <van-cell-group style="margin-top: 0.6rem">
      <van-field v-model="buyerMessage"
                 label="备注"
                 type="textarea"
                 placeholder="选填"
                 rows="1"
                 autosize
                 is-link/>
    </van-cell-group>
    <!-- 积分抵扣录入 -->
    <van-cell-group style="margin-top: 0.6rem">
      <van-field v-model="useIntegration"
                 label="使用积分数量"
                 placeholder="选填"
                 rows="1"
                 left-icon="point-gift"
                 @input="handleIntegrationInput"
      />
    </van-cell-group>
    <!-- 商品金额 -->
    <van-cell-group style="margin-top: 0.6rem">
      <van-cell title="商品金额">
        <div class="money">{{ moneyFormat(calcAmount.totalAmount) }}</div>
      </van-cell>
      <van-cell title="运费">
        <div class="money">{{ moneyFormat(calcAmount.freightAmount) }}</div>
      </van-cell>
      <van-cell title="活动优惠">
        <div class="money">-{{ moneyFormat(calcAmount.promotionAmount) }}</div>
      </van-cell>
      <van-cell title="积分抵扣">
        <div class="money">-{{ calcIntegrationAmount(useIntegration) }}</div>
      </van-cell>
    </van-cell-group>

    <van-submit-bar
        button-text="提交订单"
        label="实付"
        @submit="onSubmit"
        :price="calcAmount.payAmount*100"
        class="fixed-submit-bar"
    />
    <!-- 路由出口 -->
    <transition name="router-slider"
                mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script setup lang="ts">

import {generateConfirmOrder, generateOrder} from "@/api/order";
import {showConfirmDialog, showToast, Toast} from "vant";
import {moneyFormat} from "@/utils/filter";
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

const cartIds = ref([]);
const cartPromotionItemList = ref([]);
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
// 是否选中
const isSelected = ref(false);
const chosenAddressId = ref(null);
const disabledList = ref([]);
const couponList = ref([]);
const disabledCoupons = ref([]);

// 引入路由
const router = useRouter();
const route = useRoute();

onMounted(() => {
  // 页面进入随机生成token，放置表单重复提交
  // 购物车进入
  loadData();
});

const initData = () => {
  // let type = route.params.type;
  // if(type===1){ // 立即购买进入
  //
  // }else{ // 购物车进入
  //   goodsList=
  // }
}

const onLoad = (option) => {
  // 商品数据
  // cartIds.value = JSON.parse(option.cartIds);
  // loadData();
};
const loadData = () => {
  // 商品数据
  let cartIdsStr = route.params.cartIds;
  if (cartIdsStr === undefined || cartIdsStr === '') {
    return;
  }
  cartIds.value = String(cartIdsStr).split(',');
  // 生成确认单信息
  generateConfirmOrder(JSON.stringify(cartIds.value)).then(response => {
    let receiveAddressList = [];
    let defaultAddress = getDefaultAddress(response.data.memberReceiveAddressList);
    for (let item of response.data.memberReceiveAddressList) {
      let isDefault = false;
      if (defaultAddress.id === item.id) {
        isDefault = true;
        chosenAddressId.value = item.id;
      }
      receiveAddressList.push({
        id: item.id,
        name: item.name,
        tel: item.phoneNumber,
        address: item.province + " " + item.city + " " + item.region + " " + item.detailAddress,
        isDefault: isDefault,
      });
    }
    memberReceiveAddressList.value = receiveAddressList;
    isSelected.value = true;
    cartPromotionItemList.value = response.data.cartPromotionItemList;
    // 优惠券
    for (let item of response.data.couponHistoryDetailList) {
      let coupon = {
        available: 1,
        condition: "满" + item.coupon.minPoint + "可用",
        reason: formatCouponUseType(item.coupon.useType),
        value: item.coupon.amount * 100,
        name: item.coupon.name,
        startAt: Date.parse(item.coupon.startTime) / 1000,
        endAt: Date.parse(item.coupon.endTime) / 1000,
        valueDesc: item.coupon.amount,
        unitDesc: '元',
        id: item.coupon.id,
      };
      couponList.value.push(coupon);
    }
    // 商品合计
    calcAmount.value = response.data.calcAmount;
    // 积分设置
    integrationConsumeSetting.value = response.data.integrationConsumeSetting;
    // 会员积分
    memberIntegration.value = response.data.memberIntegration;
  });
};

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

const onExchange = (code) => {
  coupons.value.push(code);
}

const onSubmit = () => {
  let orderParam = {
    payType: 0,
    couponId: null,
    cartIds: cartIds.value,
    memberReceiveAddressId: chosenAddressId.value,
    useIntegration: useIntegration.value,
  };
  if (currCoupon !== null && currCoupon.value !== null) {
    orderParam.couponId = currCoupon.value.id;
  }
  generateOrder(orderParam).then(response => {
    let orderId = response.data.order.id;
    showConfirmDialog({
      title: '提示',
      message:
          '订单创建成功，是否要立即支付？',
    })
        .then(() => {
          // on confirm
          router.push({name: "payment", params: {orderId: orderId}});

        })
        .catch(() => {
          // on cancel
        });
  });

}
const onAdd = () => showToast('新增地址');
const onEdit = (item, index) => showToast('编辑地址:' + index);
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

}

</style>