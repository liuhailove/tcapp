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
import ShareSheet from '@/views/home/components/share/Share.vue';
import Chat from '@/views/home/components/chat/Chat.vue';


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

    return {
      leftSidebarVisible,
      shareShow,
      chatShow,
      handleShare,
      handleChat
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

//
//// 视频介绍
//.video-text {
//  position: absolute;
//  left: 10px;
//  bottom: 12%;
//  color: #fff;
//  font-size: 16px;
//
//  .title {
//    display: flex;
//    align-items: baseline; //第一行文字基线对齐
//
//    h4 {
//      margin: 0 10px 10px 0;
//    }
//
//    i {
//      color: gray;
//    }
//  }
//
//
//  p {
//    margin: 0;
//    width: 250px;
//    overflow: hidden;
//    font-size: 14px;
//    font-family: cursive; //草书字体
//    word-wrap: break-word; //强制换行
//  }
//}
</style>