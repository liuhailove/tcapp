<template>
  <div class="coupon">
    <van-nav-bar
        title="优惠券列表"
        :fixed=true
        left-arrow
        @click-left="onClickLeft"
    />
    <van-tabs v-model="active" sticky offset-top="46">
      <van-tab title="可用">
        <van-cell-group class="coupon-item" v-for="(item,index) in couponList">
          <van-row style="padding-bottom:5px">
            <van-col span="8" class="coupon-item-left">
              <van-row class="coupon-item-amount">
                {{ item.value }}
                <span>{{ item.unitDesc }}</span>
              </van-row>
              <van-row class="coupon-item-desc">
                {{ item.valueDesc }}
              </van-row>
            </van-col>
            <van-col span="12" class="coupon-item-middle">
              <van-row class="coupon-item-name">
                {{ item.name }}
              </van-row>
              <van-row class="coupon-item-valid">
                {{ item.startAt }}- {{ item.endAt }}
              </van-row>
            </van-col>
            <van-col span="4" class="coupon-item-right">
              <van-button type="danger" size="mini" to="/">去使用</van-button>
            </van-col>
          </van-row>
          <van-row class="coupon-item-description">
            {{ item.description }}
          </van-row>
        </van-cell-group>
      </van-tab>
      <van-tab title="不可用">
        <van-cell-group class="coupon-item-disabled" v-for="(item,index) in disabledCouponList">
          <van-row style="padding-bottom:5px">
            <van-col span="8" class="coupon-item-disabled-left">
              <van-row class="coupon-item-amount">
                {{ item.value }}
                <span>{{ item.unitDesc }}</span>
              </van-row>
              <van-row class="coupon-item-desc">
                {{ item.valueDesc }}
              </van-row>
            </van-col>
            <van-col span="16" class="coupon-item-middle">
              <van-row class="coupon-item-name">
                {{ item.name }}
              </van-row>
              <van-row class="coupon-item-valid">
                {{ item.startAt }}- {{ item.endAt }}
              </van-row>
            </van-col>

          </van-row>
          <van-row class="coupon-item-description">
            {{ item.reason }}
          </van-row>
        </van-cell-group>
      </van-tab>
    </van-tabs>


  </div>
</template>

<script setup>
let router = useRouter()
const active = ref(0)
const chosenCoupon = ref(-1)
const disabledCouponList = ref([
  {
    value: 1000,
    unitDesc: "无门槛券",
    valueDesc: "价值1000元",
    name: "平台券",
    startAt: "2021-04-08",
    endAt: "2025-01-01",
    description: "真正的优惠",
  },
  {
    value: 2000,
    unitDesc: "无门槛券",
    valueDesc: "价值200元",
    name: "商家券",
    startAt: "2021-04-08",
    endAt: "2025-01-01",
    description: "真正的优惠",
  },
  {
    value: 3000,
    unitDesc: "无门槛券",
    valueDesc: "价值300元",
    name: "商家券",
    startAt: "2021-04-08",
    endAt: "2025-01-01",
    description: "真正的优惠",
  },
])
const couponList = ref([
  {
    value: 100,
    unitDesc: "无门槛券",
    valueDesc: "价值100元",
    name: "商家券",
    startAt: "2021-04-08",
    endAt: "2025-01-01",
    description: "真正的优惠",
  },
  {
    value: 200,
    unitDesc: "无门槛券",
    valueDesc: "价值200元",
    name: "商家券",
    startAt: "2021-04-08",
    endAt: "2025-01-01",
    description: "真正的优惠",
  },
  {
    value: 300,
    unitDesc: "无门槛券",
    valueDesc: "价值300元",
    name: "商家券",
    startAt: "2021-04-08",
    endAt: "2025-01-01",
    description: "真正的优惠",
  },
])
const onClickLeft = () => {
  router.back()
}

const onChange = (index) => {
  chosenCoupon.value = index
  router.back()
}
</script>

<style lang="less">
.coupon {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 2000;
  padding-top: 46px;
  overflow-y: auto;

  &-item {
    margin: 10px 10px 0 10px;
    border-radius: 10px;
    padding: 15px;

    &-left {
      position: relative;
      min-width: 96px;
      padding: 0 8px;
      color: #ee0a24;
      text-align: center;
    }

    &-amount {
      margin-bottom: 6px;
      font-weight: 500;
      font-size: 30px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      span {
        font-weight: normal;
        font-size: 40%;
      }
    }

    &-desc {
      font-size: 12px;
      line-height: 16px;
      white-space: pre-wrap;
    }


    &-name {
      margin: 10px auto;
      font-weight: bold;
      font-size: 14px;
      line-height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &-valid {
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &-description {
      padding: 8px 16px;
      font-size: 12px;
      border-top: 1px dashed #ebedf0;
    }

    &-right {
      margin-top: 8px
    }

    &-disabled {
      margin: 10px 10px 0 10px;
      border-radius: 10px;
      padding: 15px;

      &-left {
        position: relative;
        min-width: 96px;
        padding: 0 8px;
        text-align: center;
        color: #323233
      }
    }
  }
}

</style>