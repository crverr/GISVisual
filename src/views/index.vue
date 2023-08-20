<template>
  <div class="ksh">
	<!-- 加载 -->
	<!-- <Loading ref="childLoad" v-if="loading" /> -->

    <div class="head_top" style="cursor:pointer;" onclick="location.href='https://paycloud.vip'">
		<img class="img-responsive" src="@/assets/images/jcdsj_logo.png">
	</div>
	
	<div class="visual">
		<MapCenter />
		<div class="visual_left">
			<VisualBox v-for="(item,index) in titlesL" :key="index" :item="item" />
		</div>
		<div class="visual_con">
			<div class="visual_conTop">
				<div class="visual_conTop_box visual_conTop1">
					<div>
						<h3>房产信息总数</h3>
						<p>2342</p>
						<!-- <div class="conTop_smil">
							<a class="sz">日环比:<span>+3%</span><i class="fa fa-long-arrow-up"></i></a>
							<a class="xd">周环比:<span>-2%</span><i class="fa fa-long-arrow-down"></i></a>
						</div> -->
					</div>
				</div>
				<div class="visual_conTop_box visual_conTop2">
					<div>
						<h3>上海人口总数</h3>
						<p>124956</p>
						<!-- <div class="conTop_smil">
							<a class="">缓行</a>
							<a class="">平均车速<span>120</span>KM/H</i></a>
						</div> -->
					</div>
				</div>
				<div class="visual_conTop_box visual_conTop1">
					<div>
						<h3>上海平均房价</h3>
						<p>9129</p>
						<!-- <div class="conTop_smil">
							<a class="sz">日环比:<span>+3%</span><i class="fa fa-long-arrow-up"></i></a>
							<a class="xd">周环比:<span>-2%</span><i class="fa fa-long-arrow-down"></i></a>
						</div> -->
					</div>
				</div>
				<div class="visual_conTop_box visual_conTop2">
					<div>
						<h3>上海XXXXX</h3>
						<p>74211</p>
						<!-- <div class="conTop_smil">
							<a class="null">null</a>
							<a class="xd">月环比:<span>-2%</span><i class="fa fa-long-arrow-down"></i></a>
						</div> -->
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="visual_conBot">
				<!-- <img class="visual_conBot_0 visual_conBot_l" src="@/assets/images/ksh42.png">
				<img class="visual_conBot_0 visual_conBot_2" src="@/assets/images/ksh43.png">
				<img class="visual_conBot_0 visual_conBot_3" src="@/assets/images/ksh44.png">
				<img class="visual_conBot_0 visual_conBot_4" src="@/assets/images/ksh45.png"> -->
				<!-- <div class="visual_chart_text">
					<h1>出行服务+大数据</h1>
					<h2>交通大数据分析平台</h2>
				</div> -->
                <!-- 大地图 -->
				
				<!-- <div class="visual_chart" id="main8"></div>
				<div class="visual_conBot_bot">
					<div class="visualSssf_left">
						<h3>今日实时收费</h3>
						<a style="display:block">全省数据</a>
						<a>大同北</a>
						<a>大同南</a>
						<a>朔州</a>
						<a>吕梁北</a>
						<a>吕梁南</a>
						<a>太原</a>
						<a class="active">晋中</a>
						<a>太旧</a>
						<a>长治</a>
					</div>
					<div class="visualSssf_right">
						<div class="visualSssf_right_box" id="main5"></div>
						<div class="visualSssf_right_box" id="main6"></div>
						<div class="visualSssf_right_box" id="main7"></div>
					</div>
					<div class="clear"></div>
				</div> -->
			</div>
		</div>
		<div class="visual_right">
			<VisualBox v-for="(item,index) in titlesR" :key="index" :item="item" />
		</div>
		<div class="clear"></div>
	</div>
  </div>
</template>

<script>
// @ is an alias to /src
import Loading from '@/components/Loading'
import MapCenter from '@/views/MapCenter'
import VisualBox from '@/components/VisualBox'
import { format } from 'echarts';
export default {
  name: "index",
  components: {Loading, MapCenter,VisualBox},
  data() {
    return {
        loading: true,
		titlesL: [["各区每月房价均价", 1], ["各区房价分布",2], ["房价Top",3]],
		titlesR: [["空间分布模式",4], ["影响房价的TOP因素",5], ["变量统计分析",6]],
    }
  },
  mounted() {
    // this.hiddenLoading()
  },
  methods: {
    hiddenLoading() {
        //loading动画淡出
        this.$refs["childLoad"].removeLoading()
        setTimeout(()=>{
            this.loading = false
        }, 2000)
    }
  }
};
</script>
<style lang="less">
@import "../assets/less/index.less";
</style>
