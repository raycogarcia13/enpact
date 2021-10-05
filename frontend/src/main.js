import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios from '@/plugins/axios'
import store from '@/store/index'
import router from '@/router'

Vue.config.productionTip = false
Vue.use({
  install (Vue) {
    Vue.prototype.$axios = axios
  }
})

store.dispatch('app/initApp');

new Vue({
  vuetify,
  // store,
  router,
  render: h => h(App)
}).$mount('#app')
