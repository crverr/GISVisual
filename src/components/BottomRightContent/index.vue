<template>
  <div class="visual_content" style="display: block">
    <div class="table_view">
      <div class="head">
        <span class="col"></span>
        <span class="col">OLS模型</span>
        <span class="col">GWR模型</span>
        <span class="col"></span>
      </div>
      <div class="marquee-view">
        <div class="line">
          <span class="col">R2</span>
          <span class="col">0.4412</span>
          <span class="col">0.6525</span>
          <span class="icon-dot"></span>
        </div>
        <div class="line">
          <span class="col">R2</span>
          <span class="col">0.4412</span>
          <span class="col">0.6525</span>
          <span class="icon-dot green"></span>
        </div>
        <div class="line">
          <span class="col">R2</span>
          <span class="col">0.4412</span>
          <span class="col">0.6525</span>
          <span class="icon-dot"></span>
        </div>
        <div class="line">
          <span class="col">R2</span>
          <span class="col">0.4412</span>
          <span class="col">0.6525</span>
          <span class="icon-dot"></span>
        </div>
      </div>
    </div>

    <div class="table_view">
      <div class="head">
        <span class="col"></span>
        <span class="col">正系数比例</span>
        <span class="col">标准回归系数</span>
        <span class="col"></span>
      </div>
      <div class="marquee-view">
        <div class="line">
          <span class="col">地铁站</span>
          <span class="col">99.89%</span>
          <span class="col">0.2321</span>
          <span></span>
        </div>
        <div class="line">
          <span class="col">地铁站</span>
          <span class="col">99.89%</span>
          <span class="col">0.2321</span>
          <span></span>
        </div>
        <div class="line">
          <span class="col">地铁站</span>
          <span class="col">99.89%</span>
          <span class="col">0.2321</span>
          <span></span>
        </div>
        <div class="line">
          <span class="col">地铁站</span>
          <span class="col">99.89%</span>
          <span class="col">0.2321</span>
          <span></span>
        </div>
        <div class="line">
          <span class="col">地铁站</span>
          <span class="col">99.89%</span>
          <span class="col">0.2321</span>
          <span></span>
        </div>
        <div class="line">
          <span class="col">地铁站</span>
          <span class="col">99.89%</span>
          <span class="col">0.2321</span>
          <span></span>
        </div>
        <div class="line">
          <span class="col">地铁站</span>
          <span class="col">99.89%</span>
          <span class="col">0.2321</span>
          <span></span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
};
</script>
<style lang="less" scoped>
.visual_content {
  flex: 1;
  display: none;
  .table_view {
    margin-bottom: 6px;
    .head {
      background: rgba(255, 255, 255, 0.1);
      font-size: 14px;
      color: #68d8fe;
      display: flex;
      justify-content: space-around;
      line-height: 2;
    }
    .col {
      width: 30%;
      &:nth-child(1) {
        width: 20%;
      }
      &:nth-child(2) {
        width: 30%;
      }
      &:nth-child(3) {
        width: 30%;
      }
      &:nth-child(4) {
        width: 20%;
      }
    }
    .marquee-view {
      width: 100%;
      .line {
        width: 100%;
        line-height: 1.6;
        color: #61a8ff;
        display: flex;
        justify-content: space-around;
        margin: 0;
        .icon-dot {
          display: inline-block;
          font-weight: bold;
          transform: scale(1.2);
          color: #dc3c33;
          &::before {
            content: "\2191";
          }
        }
        .green {
          color: #36be90;
          &::before {
            content: "\2193";
          }
        }
        &:hover {
          color: #68d8ff;
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }
  }
  .chart_view {
    .btrchart {
      width: 5em;
      height: 5em;
    }
  }
}
</style>