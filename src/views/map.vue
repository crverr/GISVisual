<template>
  <div class="ksh">
    <div>
      <MapCenter />
    </div>
  </div>
</template>

<script>
import MapCenter from "@/views/MapCenter";
export default {
  name: "",
  components: { MapCenter },
  props: {},
  data() {
    return {};
  },
};
</script>
<style lang="less" scoped>
@import "../assets/less/index.less";
</style>