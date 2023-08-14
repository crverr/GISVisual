<template>
  <div id="load">
    <div class="load_img">
      <!-- 加载动画 -->
      <transition name="rotate" appear>
        <img v-show="showLoading" src="@/assets/images/jzxz1.png" />
      </transition>
      <transition name="rotate2" appear>
        <img v-show="showLoading" src="@/assets/images/jzxz2.png" />
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading",
  data(){
    return {
        showLoading: true
    }
  },
  mounted() {
    console.log("loading mounted");
  },
  methods: {
    removeLoading() {
        setTimeout(()=>{
            this.showLoading = false
        }, 1000)
    }
  }
};
</script>
<style lang="less" scoped>
/* 加载旋转动画 */
#load {
  width: 100%;
  height: 100%;
  position: absolute;
  background: url(~@/assets/images/data08.png) no-repeat #061537;
  background-size: cover;
  top: 0;
  left: 0;
  z-index: 999;

  .load_img {
    position: absolute;
    left: calc(50% - 182px);
    top: calc(50% - 182px);

    img {
      position: absolute;
      left: 0;
      top: 0;
    }

    .rotate-enter-active,
    .rotate-leave-active {
      animation: xz1 8s infinite linear;
      transition: opacity 1s;
    }
    .rotate2-enter-active,
    .rotate2-leave-active {
      animation: xz2 8s infinite linear;
      transition: opacity 1s;
    }
    .rotate-leave,
    .rotate2-leave {
      opacity: 1;
    }
    .rotate-leave-to,
    .rotate2-leave-to {
      opacity: 0;
    }

    @keyframes xz1 {
      from {
        transform: rotate(0deg);
      }

      50% {
        transform: rotate(180deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    @keyframes xz2 {
      from {
        transform: rotate(0deg);
      }

      50% {
        transform: rotate(-180deg);
      }

      to {
        transform: rotate(-360deg);
      }
    }
    @keyframes xz3 {
      0% {
        transform: rotate(0eg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
}
</style>