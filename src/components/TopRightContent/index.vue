<template>
  <div class="visual_chart sfzcll">
    <a>空间自相关(Moran I)</a>
    <a>高/低聚类(Getis-Ord General G)</a>

    <div class="sfzcll_pos_box">
      <div class="sfzcll_box" v-for="(item, index) in list" :key="index">
        <img class="sfzcll_bkJk" src="@/assets/images/ksh34.png" />
        <img class="sfzcll_bkJk" src="@/assets/images/ksh34.png" />
        <img class="sfzcll_bkJk" src="@/assets/images/ksh34.png" />
        <img class="sfzcll_bkJk" src="@/assets/images/ksh34.png" />
        <h4>{{ item.title }}</h4>
        <div class="sfzcll_smallBk">
          <p>
            Moran I 指数 <span class="ygl">{{ item.childs[0] }}</span>
          </p>
          <p>
            z 得分 <span class="yga">{{ item.childs[1] }}</span>
          </p>
          <p>
            p 值 <span class="ygh">{{ item.childs[2] }}</span>
          </p>
        </div>
        <div class="clear"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      list: [
        {
          title: "房价聚集",
          childs: [0.785247, 185.294957, 0],
        },
        {
          title: "房价聚集",
          childs: [0.785247, 185.294957, 0],
        },
        {
          title: "房价聚集",
          childs: [0.785247, 185.294957, 0],
        },
        {
          title: "房价聚集",
          childs: [0.785247, 185.294957, 0],
        },
        {
          title: "房价聚集",
          childs: [0.785247, 185.294957, 0],
        },
      ],
    };
  },
};
</script>
<style lang="less" scoped>
/* 季度区块 */
.sfzcll {
  position: relative;
  a {
    width: 50%;
    text-align: center;
    line-height: 10px;
    color: #fff;
    display: inline-block;
  }
  .sfzcll_pos_box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    .sfzcll_box {
      box-sizing: border-box;
      width: 50%;
      height: 29%;
      line-height: 5;
      background: rgba(15, 47, 72, 0.8);
      border: 1px solid #1380bd;
      position: relative;
      margin-bottom: 4px;
      margin-right: 4px;
      padding: 4px;
      &:last-of-type {
        margin: 0;
      }
      .sfzcll_bkJk {
        position: absolute;
        &:first-of-type {
          top: -2px;
          left: -2px;
        }
        &:nth-child(2) {
          top: -2px;
          right: -2px;
        }
        &:nth-child(3) {
          bottom: -2px;
          right: -2px;
        }
        &:nth-child(4) {
          bottom: -2px;
          left: -2px;
        }
      }
      h4 {
        color: #fff;
        text-align: left;
        font-size: 14px;
        margin: 0;
      }
      .sfzcll_smallBk {
        height: 100%;
        padding: 2px 0;
        color: #fff;
        text-align: left;
        p {
          line-height: 1.5em;
          margin: 0;
        }
        .ygl {
          color: #00ffc6;
        }
        .ygh {
          color: #ffe400;
        }
        .yga {
          color: #00d8ff;
        }
      }
    }
  }
}
</style>