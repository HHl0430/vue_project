<template>
  <div class="x-bar">
   
  </div>
</template>
<script>
import HighCharts from "highcharts";
export default {
  // 验证类型
  props: {
    id: {
      type: String
    },
    option: {
      type: Object
    }
  },
  mounted() {},
  watch: {
    option: {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        HighCharts.chart(this.id, newVal);
      }
    }
  }
};
</script>