import Vue from 'vue'
import Router from 'vue-router'
import opinion from '@/components/opinion'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'opinion',
      component: opinion
    }
  ]
})
