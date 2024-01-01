<template>
  <div>
    <van-action-bar class="van-action-bar">
      <van-action-bar-icon icon="orders-o" text="我的订单"/>
      <van-action-bar-icon icon="chat-o" text="客服消息" dot/>
      <van-action-bar-icon icon="cart-o" text="购物车" badge="5"/>
      <van-action-bar-icon icon="shop-o" text="店铺" badge="12"/>
      <van-action-bar-button type="warning" text="加入购物车"/>
      <van-action-bar-button type="danger" text="立即购买"/>
    </van-action-bar>
  </div>
</template>


<style lang="less" scoped>
.van-action-bar {
  height: 140px;

  &-item {
    color: #fff;
    font-size: 20px;
    text-align: center;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

</style>