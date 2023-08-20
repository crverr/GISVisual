<template>
  <div class="visual_box">
    <img class="visual_box_1" src="@/assets/images/ksh42.png" />
    <img class="visual_box_2" src="@/assets/images/ksh43.png" />
    <img class="visual_box_3" src="@/assets/images/ksh44.png" />
    <img class="visual_box_4" src="@/assets/images/ksh45.png" />
    <div class="visual_title">
      <span>{{ item[0] }}</span>
      <img src="@/assets/images/ksh33.png" />
    </div>

    <div class="visual_chart" ref="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { option1, option2 } from "./visual";
export default {
  name: "",
  components: {},
  props: ["item"],
  data() {
    return {
    };
  },
  mounted() {
    this.getRender()
  },
  methods: {
    getRender() {
      //初始化echarts实例
      const element = this.$refs.chart // document.getElementById('chart')

      const echart = echarts.init(element);
      
      //配置参数
      switch(this.item[1]) {
        case 1:
          echart.setOption(option1)
          break
        case 2:
          echart.setOption(option2)
          break
      }
      
     
    },
  },
};
</script>
<style lang="less" scoped>
.visual_box {
  height: 33.3%;
  background-color: rgba(16, 54, 87, 0.8);
  position: relative;
  .visual_title {
    position: relative;
    height: 35px;
    margin: 5px 0;
    text-align: left;
    padding-left: 4px;
    span {
      color: #fff;
      font-size: 18px;
      line-height: 35px;
    }
    img {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
    }
  }
  .visual_chart {
    height: calc(100% - 35px);
  }

  & > img {
    position: absolute;
    width: 25px;
    height: 25px;
    z-index: 999;
  }
  .visual_box_1 {
    left: 0;
    top: 0;
  }
  .visual_box_2 {
    right: 0;
    top: 0;
  }
  .visual_box_3 {
    right: 0;
    bottom: 0;
  }
  .visual_box_4 {
    left: 0;
    bottom: 0;
  }
}
</style>