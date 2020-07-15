// 插件模块

import axios from 'axios'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

  // const AUTH_TOKEN = localStorage.getItem('token')
  // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN

  // 添加请求拦截器
  axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // config 请求头的信息
    console.log('拦截器触发')
    console.log(config.url)
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers['Authorization'] = AUTH_TOKEN // 给headers添加一个属性
    }

    return config
  }, function (error) {
  // 对请求错误做些什么
    return Promise.reject(error)
  })

  // 添加响应拦截器
  axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
    return response
  }, function (error) {
  // 对响应错误做点什么
    return Promise.reject(error)
  })

  // 在请求发起之前  设置头部
  // 添加实例方法
  Vue.prototype.$http = axios
}

export default MyHttpServer
