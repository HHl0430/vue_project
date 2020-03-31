
import Vue from 'vue'
import Vuex from 'vuex'

//注册vuex到vue中
Vue.use(Vuex)

//你的内容
const state = {
  isShowSpin: false,
  //图片查看
  uploadUrl: 'http://58.246.190.150:8055', //本地服务器图片地址
  uploadSever: "http://58.246.190.150:8086/pay/api", //本地服务器

  //接口ip图片上传ip
  // uploadSever: "http://172.16.8.19:8893/crowdfunding",//  王线上测试 使用线上图片地址
  // uploadSever: "http://172.16.8.19:8011/api",//  王本地测试 使用本地服务器图片地址


  // uploadSever: 'https://zjw.cfspservice.com/api/pay', //线上服务地址
  // uploadUrl: 'https://zjw.cfspservice.com:8055', //线上图片地址

  aciveNav: 'homePage',
}

const getters = {

}

const actions = {

}

const mutations = {
  setSpinfalse(state, active) {
    state.isShowSpin = false
  },
  //设置nav选中的值
  setAciveNav(state, active) {
    state.aciveNav = active
  },
  setSpintrue(state, active) {
    state.isShowSpin = true
  },

}

//vuex实例输出
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
