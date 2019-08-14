import Vue from 'vue'
import Router from 'vue-router'

import login  from '@/view/login/login'
import shouye from '@/view/shouye/shouye'
import datamenu from '@/view/shouye/datamenu'
import datamain from '@/view/shouye/datamain'
import system from '@/view/shouye/system'
import user from '@/view/shouye/user/user'
import juese from '@/view/shouye/role/juese'
import quanxian from '@/view/shouye/menu/quanxian'
Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      meta:{
        require:false//该路径的访问不需要登录
      }
    },{
      path: '/view/shouye/shouye',
      name: 'shouye',
      component: shouye,
      meta:{
        require:true
      },
      children:[
        {
          path:"/datamain",
          component:datamain,
          children: [
            {path:'/system',component:system,meta:{require:false}},
            {path:'/user/user',component:user,meta:{require:true}},
            {path:'/role/juese',component:juese,meta:{require:true}},
            {path:'/menu/quanxian',component:quanxian,meta:{require:true}}
          ]
        }
      ]
    },
    {
      path:"/datamenu",
      component:datamenu,
      meta:{require:true}
    },

  ]
})
