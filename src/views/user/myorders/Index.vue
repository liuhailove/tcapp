<template>
  <div class="myorders">
    <div class="myorders-header">
      <van-nav-bar
          title="我的订单"
          :fixed="true"
          left-arrow
          @click-left="onClickLeft"/>
    </div>
    <div class="myorders-conetnt">
      <!-- 搜索框 -->
      <order-search/>
      <!--订单导航-->
      <order-nav/>
    </div>
  </div>

</template>
<script setup>
import OrderSearch from "@/views/user/myorders/components/search/Index.vue";
import OrderNav from "@/views/user/myorders/components/OrderNav/Index.vue";

const router = useRouter()
const onClickLeft = () => {
  router.go(-1)
}

</script>

<style lang="less">
.myorders {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 2000;
  padding-top: 44px;
  overflow: auto;

  &-header {
    //height: 30px;
  }

  &-conetnt {
    //margin-top: 2px;
  }
}
</style>