// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import MyHttpServer from './plugins/http'
import moment from 'moment'
// 不要忘记引入css文件
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式
import '@/assets/css/reset.css'

import router from './router'

// 适用于vue插件Vue.use()
Vue.use(ElementUI)
Vue.use(MyHttpServer)

Vue.config.productionTip = false

// 全局过滤器 - 处理日期
Vue.filter('fmtdata', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  // 简写 template: '<App><App/>'
  template: '<App/>'
})
