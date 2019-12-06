import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue)
Vue.config.productionTip = false

import App from './App.vue'
import router from './router/index'

import './styles/_custom.scss'

new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')
