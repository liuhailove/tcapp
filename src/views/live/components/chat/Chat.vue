<template>
  <!-- 评论窗口 -->
  <van-action-sheet v-model:show="chatShow" :overlay="false" title="评论">
    <div class="chatContent" v-for="(item,i) in chatArr" :key="i">
      <img :src="item.chatImg" alt=""/>
      <div>
        <i>{{ item.name }}}</i>
        <span v-if="item.flag">作者</span>
        <p v-if="item.chatTextShow" style="color: gray">！[该评论已被隐藏]</p>
        <p v-else>{{ item.chatText }}</p>
      </div>
      <div>
        <van-icon @click="handleChatLike(item)" :name="item.chatLikeShow?'like':'like-o'"
                  size="16" :color="item.chatLikeShow ? '#f9476f' : ''"/>
        &nbsp;&nbsp;
        <van-icon @click="item.chatTextShow = !item.chatTextShow" :name="item.chatTextShow ? 'eye' : 'closed-eye'"
                  size="16"/>
      </div>
    </div>
    <div class="chatSplit"></div>
    <div class="chatValue">
      <div>
        <van-icon name="photo-o" @click="showToast('暂未开放')"/>
        <input type="text" @keyup.enter="publish()" v-model.trim="chatText" placeholder="善语结善缘，恶言伤人心">
        <div @click="publish()">
          <p>发送</p>
        </div>
      </div>
    </div>
  </van-action-sheet>
</template>

<script setup>

import {watchEffect} from "vue";
import { showToast } from 'vant'

const props = defineProps({
  chatIsShow: {
    type: Boolean,
    default: false
  }
})
const chatShow = ref(props.chatIsShow);   //显示或隐藏分享面板

let chatIndex = ref(0)        //当前视频的评论索引
let chatText = ref('')        //评论内容
let isFlag = ref(false)       //是否是当前用户评论

// 当前视频的评论
let chatArr =
    [{
      chatImg: "",
      name: "chat1",
      flag: true,
      chatLikeShow: true,
      chatText: "你好",
    },
      {
        chatImg: "",
        name: "chat2",
        flag: true,
        chatLikeShow: true,
        chatText: "你好2",
      },
      {
        chatImg: "",
        name: "chat3",
        flag: true,
        chatLikeShow: false,
        chatText: "你好3",
      }
    ]

watchEffect(() => {
  console.info("watchEffect chatIsShow:" + props.chatIsShow)
  chatShow.value = props.chatIsShow;
});

</script>

<style scoped lang="less">

// 评论窗口内样式
.chatContent {
  padding: 10px 15px 20px;
  // margin-bottom: 40px;
  display: flex;
  justify-content: space-between;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  div {
    padding-left: 10px;
    font-size: 12px;

    span {
      margin-left: 5px;
      display: inline-block;
      width: 33px;
      height: 19px;
      line-height: 19px;
      border-radius: 5px;
      color: #fff;
      transform: scale(0.9);
      text-align: center;
      background-color: #f9476f;
    }

    p {
      width: 230px;
      font-size: 14px;
      word-wrap: break-word; //强制换行
    }
  }
}

.chatSplit {
  margin-bottom: 50px;
}

// 发布评论
.chatValue {
  text-align: center;
  background-color: #ffffff;
  padding: 8px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;

  div {
    height: 50px;
    background-color: #f2f2f2;
    border-radius: 25px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    input {
      width: 240px;
      height: 30px;
      border: 0;
      background-color: #f2f2f2;
      font-size: 16px;
    }

    // placeholder颜色
    input::-webkit-input-placeholder {
      color: #aab2bd;
      font-size: 16px;
    }

    div {
      background-color: #f9476f;
      width: 60px;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      font-size: 16px;
      color: #fff;
      text-align: center;
    }
  }
}

</style>