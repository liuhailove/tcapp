<template>
  <!--精选品类-->
  <van-grid :border="false" :column-num="3" :gutter="1" :center="false" :row-height="150">
    <van-grid-item icon="home-o" text="直播精选" badge="推">
      <div class="spike">
        <div class="spike-header">
          <span class="spike-header-title">直播精选</span>
          <div class="spike-header-countdown">
            <div class="spike-header-countdown-lt">
              直播优选
            </div>
          </div>
        </div>
        <div class="spike-content">
          <!-- 精选商品 -->
          <div class="goods-wrapper">
            <van-card
                price="2.00"
                desc="描述信息"
                title="商品标题"
                thumb="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
                class="van-card-full"
            >
              <template #tags>
                <van-tag plain type="primary">标签</van-tag>
                <van-tag plain type="primary">标签</van-tag>
              </template>
            </van-card>
          </div>
        </div>
      </div>
    </van-grid-item>
    <van-grid-item text="低价秒杀">
      <div class="spike">
        <div class="spike-header">
          <span class="spike-header-title">低价秒杀</span>
          <div class="spike-header-countdown">
            <div class="spike-header-countdown-lt">
              '10点场'
            </div>
            <div class="spike-header-countdown-rt">
              <van-count-down :time="time" format="HH:mm:ss"/>
            </div>
          </div>
          <div class="spike-header-more" @click="handleMoreClick">
            <span class="spike-header-more-text">查看全部</span>
            <van-icon name="play" size="14"/>
          </div>
        </div>
        <div class="spike-content">
          <!-- 秒杀商品 -->
          <div class="goods-wrapper">
            <van-card
                price="2.00"
                desc="描述信息"
                title="商品标题"
                thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
                class="van-card-full"
            >
              <template #tags>
                <van-tag plain type="primary">标签</van-tag>
                <van-tag plain type="primary">标签</van-tag>
              </template>
            </van-card>
          </div>
        </div>
      </div>
    </van-grid-item>
    <van-grid-item text="品牌馆">
      <div class="spike">
        <div class="spike-header">
          <span class="spike-header-title">品牌馆</span>
        </div>
        <div class="spike-content">
          <!-- 秒杀商品 -->
          <div class="goods-wrapper">
            <van-card
                price="2.00"
                desc="描述信息"
                title="商品标题"
                thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
                class="van-card-full"
            >
              <template #tags>
                <van-tag plain type="primary">标签</van-tag>
                <van-tag plain type="primary">标签</van-tag>
              </template>
            </van-card>
          </div>
        </div>
      </div>

    </van-grid-item>
  </van-grid>

</template>

<script>


export default {

  props: {
    seckillGoodsList: Array,
  },
  watch: {
    spikeInfo: function (newValue, oldValue) {
      this.seckillGoodsList = newValue
    }
  },
  data() {
    return {
      seckillInfoData: {},
      time: 30 * 60 * 1000 * 100,
      goodsList: [
        {
          id: 1,
          pic_url: '',
          retail_price: 100,
          counter_price: 200,
        },
        {
          id: 2,
          pic_url: '',
          retail_price: 100,
          counter_price: 200,
        },
        {
          id: 3,
          pic_url: '',
          retail_price: 100,
          counter_price: 200,
        },
      ]
    }
  },
  methods: {
    handleMoreClick() {
    }
  }
}
</script>

<style lang="less" scoped>
.spike {
  position: relative;
  background: #ffffff;
  height: 140px;
  //margin-top: 2px;

  &-header {
    padding: 0 2px;

    &-title {
      display: inline-block;
      height: 26px;
      line-height: 26px;
      font-size: 14px;
      float: left;
      font-weight: bold;
    }

    &-countdown {
      float: left;

      &-lt {
        margin-top: 1px;
        margin-left: 10px;
        font-size: 12px;
        border: 1px solid #FB0017;
        border-right: none;
        border-bottom-left-radius: 22px;
        border-top-left-radius: 22px;
        height: 18px;
        line-height: 18px;
        padding: 0 3px;
        color: #ffffff;
        background: #FB0017;
        float: left;
      }

      &-rt {
        margin-top: 1px;
        font-size: 12px;
        float: left;
        border: 1px solid #FB0017;
        border-bottom-right-radius: 22px;
        border-top-right-radius: 22px;
        height: 18px;
        line-height: 18px;
        padding: 0 3px;
      }
    }

    &-more {
      float: right;

      &-text {
        height: 20px;
        line-height: 20px;
        font-size: 14px;
      }

      .van-icon {
        margin-left: 2px;
        height: 24px;
        line-height: 24px;
        float: right;
      }
    }
  }

  &-content {
    .van-card-full {
      background-color: #ffffff;
    }
  }
}

.goods-wrapper {
  width: 100%;
  padding-top: 25px;
  overflow: hidden;
  position: absolute;

  .goods-content {
    display: flex;
    justify-content: flex-start;

    .goods-item {
      align-items: center;
      margin-left: 10px;

      &-img {
        width: 80px;
        height: 80px;
        margin: 0 auto;
      }

      &-name {

      }

      &-price {
        text-align: center;

        &-spike {
          font-size: 14px;
          color: #FB0017;
        }

        &-original {
          font-size: 12px;
          text-decoration: line-through;
          color: #999999;
        }
      }
    }
  }
}
</style>