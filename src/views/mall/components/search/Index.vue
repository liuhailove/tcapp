<template>
  <div class="searchContainer">
      <van-search
          v-model="searchValue"
          input-align="center"
          show-action
          label="商品"
          placeholder="请输入搜索商品关键词"
      >
        <template #left-icon>
          <van-icon name="search" class="search-icon"/>
        </template>
        <template #right-icon>
          <van-button size="small" icon="scan" color="#7232dd" plain></van-button>
          <van-button size="small" hairline icon="cart-o" color="#7232dd"></van-button>
        </template>
        <template #action>
          <van-button size="small" color="linear-gradient(to right, #ff6034, #ee0a24)" style="width: 50px">搜索
          </van-button>
        </template>
      </van-search>
  </div>
</template>
<script setup>
const searchValue = ref('手机号码充值');
</script>
<style lang="less">
.searchContainer {
  margin-top: 2px;
}
</style>