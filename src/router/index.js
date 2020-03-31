import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import homePage from '@/pages/homePage/index'
import login from '@/pages/login/login'
import register from '@/pages/register/index'
import personalCenter from '@/pages/personalCenter/index'
import userInfo from '@/pages/personalCenter/userInfo'
import releaseProject from '@/pages/platform/releaseProject/releaseForm'
import myProject from '@/pages/platform/myProject/myProjectList'
import userMyProject from '@/pages/user/myProject'
import setMyProject from '@/pages/platform/myProject/myProjectSet'
import projectDetail from '@/pages/platform/myProject/projectDetail'
import projectListDetail from '@/pages/finance/projectListDetail'
import userProjectDetail from '@/pages/user/userProjectDetail'
import projectList from '@/pages/finance/projectList'
import userControl from '@/pages/userControl/userControl'
import vxUserControl from '@/pages/userControl/vxUserControl'
import statisticalChart from '@/pages/statistical/statisticalChart'
import userChart from '@/pages/statistical/userChart'
Vue.use(Router)


//meat.type是权限对应的码，没有则为公共页面 0：用户 1：平台 2：财务
export default new Router({
  mode: 'hash',
  base: '/pay/',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: login,
    },
    {
      path: '/register',
      name: 'register',
      component: register,
    },
    {
      path: '/',
      name: 'index',
      component: index,
      children: [
        {
          path: '/statistical/statisticalChart',
          name: 'statisticalChart',
          component: statisticalChart,
        },
        {
          path: '/statistical/userChart',
          name: 'userChart',
          component: userChart,
        },

        {
          path: '/userControl',
          name: 'userControl',
          component: userControl,
          meta: {
            type: '0',
          },
        },
        {
          path: '/vxUserControl',
          name: 'vxUserControl',
          component: vxUserControl,
          meta: {
            type: '0',
          }
        },
        {
          path: '/finance/projectListDetail',
          name: 'projectListDetail',
          component: projectListDetail,
          meta: {
            type: '2',
          },
        },
        {
          path: '/finance/projectList',
          name: 'projectList',
          component: projectList,
          meta: {
            type: '2',
          },
        },
        {
          path: '/user/userMyProject',
          name: 'userMyProject',
          component: userMyProject,
          meta: {
            type: '1',
          },
        },
        {
          path: '/user/userProjectDetail',
          name: 'userProjectDetail',
          component: userProjectDetail,
          meta: {
            type: '1',
          },
        },
        {
          path: '/platform/releaseProject',
          name: 'releaseProject',
          component: releaseProject,
          meta: {
            type: '0',
          },
        },
        {
          path: '/platform/platformMyProject',
          name: 'myProject',
          component: myProject,
          meta: {
            type: '0',
          },
        },
        {
          path: '/platform/setMyProject',
          name: 'setMyProject',
          component: setMyProject,
          meta: {
            type: '0',
          },
        },
        {
          path: '/platform/projectDetail',
          name: 'projectDetail',
          component: projectDetail,
          meta: {
            type: '0',
          },
        },
        {
          path: '/homePage',
          name: 'homePage',
          component: homePage,
        },

        {
          path: '/personalCenter',
          name: 'personalCenter',
          component: personalCenter,
          meta: {
            type: '1',
          },
        },
        {
          path: '/userInfo',
          name: 'userInfo',
          component: userInfo
        }
      ]
    },
  ]
})
