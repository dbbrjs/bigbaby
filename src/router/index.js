import Vue from 'vue'
import Router from 'vue-router'
// import Login from '../components/login/login'
// @->src   @自动指向src
import Login from '@/components/login/login'
import Home from '../components/home/home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home
    }
  ]
})
