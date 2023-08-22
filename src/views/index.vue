<template>
  <div class="ksh clear">
    <!-- 加载 -->
    <!-- <Loading ref="childLoad" v-if="loading" /> -->

    <div
      class="head_top"
      style="cursor: pointer"
      onclick="location.href='https://paycloud.vip'"
    >
      <img class="img-responsive" src="@/assets/images/jcdsj_logo.png" />
    </div>

    <div class="visual clear">
      <MapCenter />
      <div class="visual_left">
        <VisualBox v-for="(item, index) in titlesL" :key="index" :item="item" />
      </div>
      <div class="visual_con">
        <div class="visual_conTop">
          <div v-for="(value, key, index) in resultMap" :key="key">
            <div
              :class="
                index % 2 === 0
                  ? 'visual_conTop_box visual_conTop1'
                  : 'visual_conTop_box visual_conTop2'
              "
            >
              <div>
                <h3>{{ key }}</h3>
                <p>{{ value }}</p>
              </div>
            </div>
          </div>
          <div class="clear"></div>
        </div>
      </div>
      <div class="visual_right">
        <VisualBox v-for="(item, index) in titlesR" :key="index" :item="item" />
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Loading from "@/components/Loading";
import MapCenter from "@/views/MapCenter";
import VisualBox from "@/components/VisualBox";
import { format } from "echarts";
import axios from "axios";
export default {
  name: "index",
  components: { Loading, MapCenter, VisualBox },
  data() {
    return {
      loading: true,
      titlesL: [
        ["每月交易量及交易均价", 1],
        ["各区房价分布", 2],
        ["房产单价Top10", 3],
      ],
      titlesR: [
        ["全局空间分析", 4],
        ["影响房价的TOP因素", 5],
        ["变量统计分析", 6],
      ],
      resultMap: {},
	}
  },
  mounted() {
    // this.hiddenLoading()
    this.fetchDataNumber();
  },
  methods: {
    hiddenLoading() {
      //loading动画淡出
      this.$refs["childLoad"].removeLoading();
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
    fetchDataNumber() {
      axios({
        url: "/sb/getDataNumber",
        method: "GET",
      })
        .then((res) => {
          if (res.data.code === "200") {
            this.resultMap = res.data.data;
          } else {
            console.error("未能获取数据，系统错误！");
          }
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    },
  },
};
</script>
<style lang="less">
@import "../assets/less/index.less";
</style>
