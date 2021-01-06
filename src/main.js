import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from './axios/api'

Vue.config.productionTip = false

Vue.use(elementUI)
Vue.use(antd)
Vue.prototype.$axios = axios
// if(process.env.VUE_APP_MODE==='development'){
//   //开发环境下的执行操作
// }else if(process.env.VUE_APP_MODE==='test'){
//   //测试环境下的执行操作
// }else{
//   //生产环境下的执行操作
// }

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
