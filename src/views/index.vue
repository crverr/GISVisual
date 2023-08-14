<template>
  <div class="ksh">
	<Loading ref="childLoad" v-if="loading" />
    <div class="head_top" style="cursor:pointer;" onclick="location.href='https://paycloud.vip'">
		<img class="img-responsive" src="@/assets/images/jcdsj_logo.png">
		
	</div>
	<div class="visual">
		<div class="visual_left">
			<div class="visual_box">
				<div class="visual_title">
					<span>交通流量</span>
					<img src="@/assets/images/ksh33.png">
				</div>
				<div class="visual_chart" id="main1">
				</div>
			</div>
			<div class="visual_box">
				<div class="visual_title">
					<span>交通工具流量</span>
					<img src="@/assets/images/ksh33.png">
				</div>
				<div class="visual_chart" id="main2">
					
				</div>
			</div>
			<div class="visual_box">
				<div class="visual_title">
					<span>收费站车流量</span>
					<img src="@/assets/images/ksh33.png">
				</div>
				<div class="visual_chart sfzcll">
					<a>运输方式</a>
					<a>客运量</a>
					<a>货运量</a>
					<div class="sfzcll_pos_box">
						<div class="sfzcll_box">
							<img class="sfzcll_bkJk" src="@/assets/images/ksh34.png">
							<img class="sfzcll_bkJk" src="@/assets/images/ksh34.png">
							<img class="sfzcll_bkJk" src="@/assets/images/ksh34.png">
							<img class="sfzcll_bkJk" src="@/assets/images/ksh34.png">
							<label><img src="@/assets/images/ksh35.png">公路运输</label>
							<div class="sfzcll_smallBk">
								<div class="ygl">
									<span>4347.2万</span>人
								</div>
							</div>
							<div class="sfzcll_smallBk">
								<div class="ygh">
									<span>4347.2万</span>人
								</div>
							</div>
							<div class="clear"></div>
						</div>
						<div class="sfzcll_box">
							<img class="sfzcll_bkJk" src="@/assets/images/ksh34.png">
							<img class="sfzcll_bkJk" src="@/assets/images/ksh34.png">
							<img class="sfzcll_bkJk" src="@/assets/images/ksh34.png">
							<img class="sfzcll_bkJk" src="@/assets/images/ksh34.png">
							<label><img src="@/assets/images/ksh35.png">公路运输</label>
							<div class="sfzcll_smallBk">
								<div class="ygl">
									<span>4347.2万</span>人
								</div>
							</div>
							<div class="sfzcll_smallBk">
								<div class="ygh">
									<span>4347.2万</span>人
								</div>
							</div>
							<div class="clear"></div>
						</div>
						<div class="sfzcll_box">
							<img class="sfzcll_bkJk" src="@/assets/images/ksh34.png">
							<img class="sfzcll_bkJk" src="@/assets/images/ksh34.png">
							<img class="sfzcll_bkJk" src="@/assets/images/ksh34.png">
							<img class="sfzcll_bkJk" src="@/assets/images/ksh34.png">
							<label><img src="@/assets/images/ksh35.png">公路运输</label>
							<div class="sfzcll_smallBk">
								<div class="ygl">
									<span>4347.2万</span>人
								</div>
							</div>
							<div class="sfzcll_smallBk">
								<div class="ygh">
									<span>4347.2万</span>人
								</div>
							</div>
							<div class="clear"></div>
						</div>
					</div>
					
				</div>
			</div>
		</div>
		<div class="visual_con">
			<div class="visual_conTop">
				<div class="visual_conTop_box visual_conTop1">
					<div>
						<h3>当前警情数(起)</h3>
						<p>67</p>
						<div class="conTop_smil">
							<a class="sz">日环比:<span>+3%</span><i class="fa fa-long-arrow-up"></i></a>
							<a class="xd">周环比:<span>-2%</span><i class="fa fa-long-arrow-down"></i></a>
						</div>
					</div>
				</div>
				<div class="visual_conTop_box visual_conTop2">
					<div>
						<h3>区域拥堵指数</h3>
						<p>1.4</p>
						<div class="conTop_smil">
							<a class="">缓行</a>
							<a class="">平均车速<span>120</span>KM/H</i></a>
						</div>
					</div>
				</div>
				<div class="visual_conTop_box visual_conTop1">
					<div>
						<h3>当前警情数(起)</h3>
						<p>99</p>
						<div class="conTop_smil">
							<a class="sz">日环比:<span>+3%</span><i class="fa fa-long-arrow-up"></i></a>
							<a class="xd">周环比:<span>-2%</span><i class="fa fa-long-arrow-down"></i></a>
						</div>
					</div>
				</div>
				<div class="visual_conTop_box visual_conTop2">
					<div>
						<h3>当前警情数(起)</h3>
						<p>7421</p>
						<div class="conTop_smil">
							<a class="null">null</a>
							<a class="xd">月环比:<span>-2%</span><i class="fa fa-long-arrow-down"></i></a>
						</div>
					</div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="visual_conBot">
				<img class="visual_conBot_l" src="@/assets/images/ksh42.png">
				<img class="visual_conBot_2" src="@/assets/images/ksh43.png">
				<img class="visual_conBot_3" src="@/assets/images/ksh44.png">
				<img class="visual_conBot_4" src="@/assets/images/ksh45.png">
				<div class="visual_chart_text">
					<h1>出行服务+大数据</h1>
					<h2>交通大数据分析平台</h2>
				</div>
                <!-- 大地图 -->
				<div class="visual_chart" id="main8"></div>
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
				</div>
			</div>
		</div>
		<div class="visual_right">
			<div class="visual_box">
				<div class="visual_title">
					<span>本月发生事件</span>
					<img src="@/assets/images/ksh33.png">
				</div>
				<div class="swiper-container visual_swiper1 visual_chart">
					<div class="swiper-wrapper">
						<div class="swiper-slide"  id="main3"></div>
						<div class="swiper-slide"  id="main31"></div>
					</div>
				</div>
			</div>
			<div class="visual_box visualSfzsfl">
				<div class="visual_title">
					<span>收费站收费量</span>
					<img src="@/assets/images/ksh33.png">
				</div>
				<div class="visual_chart" id="main9">
					
				</div>
				<div class="visual_table">
						<table>
							<tr>
								<td>小型车</td>
								<td>中型车</td>
								<td>大型车</td>
							</tr>
							<tr>
								<td>2486万</td>
								<td>2486万</td>
								<td>2486万</td>
							</tr>
							<tr>
								<td>2486万</td>
								<td>2486万</td>
								<td>2486万</td>
							</tr>
							<tr>
								<td>2486万</td>
								<td>2486万</td>
								<td>2486万</td>
							</tr>
							<tr>
								<td>2486万</td>
								<td>2486万</td>
								<td>2486万</td>
							</tr>
						</table>
					</div>
			</div>
			<div class="visual_box">
				<div class="visual_title">
					<span>收费站收费排行</span>
					<img src="@/assets/images/ksh33.png">
				</div>
				<div class="swiper-container visual_swiper2 visual_chart">
					<div class="swiper-wrapper">
						<div class="swiper-slide"  id="main4"></div>
						<div class="swiper-slide"  id="main41"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="clear"></div>
	</div>
  </div>
</template>

<script>
// @ is an alias to /src
import Loading from '@/components/Loading'

export default {
  name: "index",
  components: {Loading},
  data() {
    return {
        loading: true
    }
  },
  mounted() {
    console.log("index mounted");
    this.hiddenLoading()
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
