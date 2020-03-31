import axios from 'axios'
import Vue from 'vue'
import Router from '../router'
import store from '../store'
let baseUrl = store.state.uploadSever
// let baseUrl = 'http://58.246.190.150:8086/pay/api' //外网
let uploadUrl = store.state.uploadUrl //图片路径
const service = axios.create({
    // baseURL: 'http://58.246.190.150:8086/test/api', //服务器
    baseURL: baseUrl, //服务器
    timeout: 30000 // request timeout
})

let loadingInstance

// request interceptor
service.interceptors.request.use(
    config => {

        var Token = window.localStorage.getItem("Token")
        if (Token) {
            config.headers['Admin-Token'] = Token.replace('"', '').replace('"', '')
        } else if (!((config.data && config.data.check === false) ||
            (config.params && config.params.check === false))) {
            Router.push({
                path: '/login'
            })
        }
        if (!(
            (config.data && config.data.loading === false) ||
            (config.params && config.params.loading === false)
        )) {
            store.commit('setSpintrue')
        }
        return config
    },
    error => {
        Promise.reject(error)
    }
)

function pageScrollLeft(res) {
    if (res.data && res.data.list && res.data.total) {
    }
}
service.interceptors.response.use(
    response => {
        if (response.data.code == 9003) {
            Router.push({
                path: '/login'
            })
        }
        if (response.status == 200) {
            pageScrollLeft(response.data)
            store.commit('setSpinfalse')
        }
        Vue.nextTick(function () {

        })
        return response
    },
    error => {
        Vue.nextTick(function () {
            store.commit('setSpinfalse')
        })
        return Promise.reject(error)
    }
)
export default {
    baseUrl,
    service,
    uploadUrl
}