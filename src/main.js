// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import './assets/react.css'
import store from './store/index'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import "babel-polyfill" //解决ie兼容问题s
import util from '@/utils/utils'
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})
Vue.config.productionTip = false
Vue.use(ViewUI);
Vue.prototype.$util = util;

router.beforeEach((to, from, next) => {

  //防止刷新页面nav不会选中当前页面对应的导航  ****缺点：nav中的name必须要与地址栏的最后一个地址相对应并且不能有重复
  store.commit("setAciveNav", to.path.split('/').pop())
  if (to.path == '/') {
    return next('/login')
  }
  let Token = localStorage.getItem("Token")
  if (!Token && to.path !== '/login' && to.path !== '/register') {
    return next('/login')
  }
  //权限 防止通过路由直接访问页面
  let permissions = localStorage.getItem("permissions")
  //进行拦截
  if (permissions != to.meta.type && to.meta.type) {
    //强制跳转
    if (permissions == 0) {
      return next('/platform/platformMyProject')
    } else if (permissions == 1) {
      return next('/user/userMyProject')
    } else {
      return next('/finance/projectList')
    }

  }
  next()

});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
