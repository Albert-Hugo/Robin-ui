import Vue from 'vue'
import Router from 'vue-router'
import StoreDetail from '@/components/StoreDetail'
import Keys from '@/components/Keys'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StoreDetail',
      component: StoreDetail
    },
    {
      path: '/keys',
      name: 'Keys',
      component: Keys
    }
  ]
})
