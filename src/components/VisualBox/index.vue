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
import { option1, option2,option3,option5,option4 } from "./visual";
import axios from 'axios'; // 引入 axios
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
      const element = this.$refs.chart;
      const echart = echarts.init(element);

      // 配置参数
      switch (this.item[1]) {
        case 1:
          axios.get('/sb/getMonthData')
              .then(response => {
                const responseData = response.data;
                const numMonth = responseData.map(item => item.numMonth);
                const avgTotalMonth = responseData.map(item => item.avgTotalMonth);
                option1.series[0].data = numMonth;
                option1.series[1].data = avgTotalMonth;
                echart.setOption(option1);
              }).catch(error => {
            console.error('An error occurred while fetching data:', error);
          });
          break;
        case 2:
          // 更新图表配置
          // 使用 axios 获取后台数据
          axios.get('/sb/getAvg')
              .then(response => {
                const responseData = response.data;

                // 从 responseData 提取区县和均价数据
                const counties = responseData.map(item => item.county);
                const avgPrices = responseData.map(item => item.avg_totalprice);
                // 更新 xAxis 数据
                option2.xAxis[0].data = counties;

                // 更新 series 数据
                option2.series[0].data = avgPrices;

                // 更新 legend 数据
                option2.legend.data = ["房产总价均价 单位万元"];

                // 更新 legend 数据
                option2.series[0].name = "房产总价均价 单位万元";

                // 设置纵轴的名称
                option2.yAxis[0].name = "均价";

                // 设置图表配置
                echart.setOption(option2);
              })
              .catch(error => {
                console.error('An error occurred while fetching data:', error);
              });
          break;
        case 3:
          // 更新图表配置
          // 使用 axios 获取后台数据
          axios.get('/sb/getTop')
              .then(response => {
                const responseData = response.data;
                // 根据相关性2降序排列数据
                responseData.sort((a, b) => a.avg_unitprice - b.avg_unitprice);
                // 从 responseData 提取区县和均价数据
                const counties = responseData.map(item => item.county);
                const streets = responseData.map(item => item.street);
                const xiaoqus = responseData.map(item => item.xiaoqu);
                const avg_unitprice = responseData.map(item => item.avg_unitprice);
                // 将 counties、streets 和 xiaoqus 拼接为地名
                const combinedNames = counties.map((county, index) => {
                  const street = streets[index];
                  const xiaoqu = xiaoqus[index];
                  return `${county} ${street} ${xiaoqu}`;
                });
                // 更新 xAxis 数据
                option3.yAxis.data = combinedNames;

                // 更新 series 数据
                option3.series[0].data = avg_unitprice;

                echart.setOption(option3);
              })
          break;
        case 4:

          break;
        case 5:
          axios.get('/sb/getCorrelation')
              .then(response => {
                const responseData = response.data;
                // 提取相关性数据和显著性数据
                const data = responseData.map(item => ({
                  variable: item.variable,
                  correlation1: item.correlation1,
                  significance1: item.significance1,
                  correlation2: item.correlation2,
                  significance2: item.significance2
                }));
                // 根据相关性2降序排列数据
                data.sort((a, b) => a.correlation2 - b.correlation2);
                // 获取横坐标数据和纵坐标数据
                const variables = data.map(item => item.variable);
                const correlation1Values = data.map(item => item.correlation1);
                const correlation2Values = data.map(item => item.correlation2);
                option5.yAxis[0].data = variables;
                option5.series[0].data = correlation2Values
                option5.series[1].data = correlation1Values
                echart.setOption(option5);
              })
          break;
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