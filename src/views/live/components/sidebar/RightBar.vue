<template>
  <!-- 右侧边栏 -->
  <div class="right-info">
    <img @click.stop="jump()" alt="">
    <!-- 未关注显示 -->
    <div @click="handleAddCol()" class="addCol">
      <van-icon name="plus" size="14" :color="'#1989fa'"/>
    </div>
    <div>
      <van-icon @click.stop="handleLike(i)" name="like" size="30"
                :color=" '#f9476f'"/>
      <p>100</p>
    </div>
    <div>
      <van-icon @click.stop="handleChat()" name="chat" size="30" :color="'#B3C0D1'"/>
      <p>200</p>
    </div>
    <div>
      <van-icon @click.stop="handlecollection(i)" name="star" size="30"
                :color="'#ffb701'"/>
      <p>300</p>
    </div>
    <div>
      <van-icon @click.stop="handleShare()" name="share" size="30" color="#1989fa"/>
      <p>66</p>
    </div>
  </div>
  <ShareSheet :shareSheetShow="shareShow"/>
  <Chat :chatIsShow="chatShow"/>
</template>
<script>

import {watchEffect} from 'vue';
import ShareSheet from '@/views/live/components/share/Share.vue';
import Chat from '@/views/live/components/chat/Chat.vue';


export default {

  props: {
    sidebarVisible: {
      type: Boolean,
      required: true
    }
  },
  components: {
    ShareSheet,
    Chat
  },
  setup(props) {
    const shareShow = ref(false);
    let chatShow = ref(false)     //显示或隐藏评论窗口

    const leftSidebarVisible = ref(props.sidebarVisible);

    watchEffect(() => {
      console.info("watchEffect:" + props.sidebarVisible)
      leftSidebarVisible.value = props.sidebarVisible;
    });

    // 点击分享图标
    const handleShare = () => {
      console.info("handleShare:" + shareShow.value)
      shareShow.value = !shareShow.value;
    }
    // 点击评论图标
    const handleChat = () => {
      chatShow.value = !chatShow.value
    }

    const handleAddCol = () => {
    }
    const handleLike = (i) => {
    }
    const handlecollection = (i) => {
    }
    const jump = () => {
    }
    return {
      leftSidebarVisible,
      shareShow,
      chatShow,
      handleAddCol,
      handleShare,
      handleChat,
      handleLike,
      handlecollection,
      jump
    };
  }
}
</script>

<style scoped lang="less">
// 右侧边栏
.right-info {
  position: absolute;
  right: 10px;
  top: 28%;
  height: 300px;
  display: flex;
  flex-direction: column; //设置排列方向为纵向
  align-items: center;
  justify-content: space-between;

  img {
    border: 3px solid #fff;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    object-fit: cover;
  }

  .addCol {
    position: absolute;
    top: 15%;
    left: 35%;
    width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 50%;
    background-color: #f9476f;
    text-align: center;

    :deep(.van-icon-plus) {
      vertical-align: 15%;
    }
  }

  p {
    font-size: 12px;
    color: black;
    margin: 0;
    text-align: center;
  }

}
</style>