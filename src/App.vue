<template>
  <div id="app">
    <router-view />
    <Spin size="large" fix v-if="this.$store.state.isShowSpin"></Spin>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
.ivu-spin-fix {
  z-index: 999 !important;
}

</style>
