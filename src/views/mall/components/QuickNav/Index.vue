<template>
  <div id="quickNav">
    <van-grid clickable :column-num="10" :border="false">
      <van-grid-item icon="orders-o" text="我的订单" to="/" />
      <van-grid-item icon="gold-coin-o" text="手机充值" to="/" />
      <van-grid-item icon="shop-o" text="同辰超市" to="/" badge="券" />
      <van-grid-item icon="chat-o" text="客服消息" to="/" badge="99+" />
      <van-grid-item icon="logistics" text="商品物流" to="/"/>
      <van-grid-item icon="cash-back-record-o" text="退货售后" to="/"/>
      <van-grid-item icon="shop-collect-o" text="关注店铺" to="/"/>
      <van-grid-item icon="new-arrival-o" text="试用领取" to="/"/>
      <van-grid-item icon="hot-sale-o" text="热卖" dot to="/"/>
      <van-grid-item icon="start-o" text="收藏" url="https://github.com" />
    </van-grid>
  </div>
</template>

