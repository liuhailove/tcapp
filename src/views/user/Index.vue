<template>
  <!-- 顶部导航组件 -->
  <LevelNavBar/>
  <!-- 用户信息组件 -->
  <AccountInfo/>
  <!-- 底部栏组件 -->
  <BottomBar/>
</template>

<script setup>
import LevelNavBar from '@/views/user/components/navbar/Index.vue';

import AccountInfo from '@/views/user/components/account/Index.vue';

import BottomBar from '@/views/user/components/bottombar/Index.vue';

</script>

<style scoped></style>
