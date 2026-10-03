import Vue from 'vue'
import Toasted from 'vue-toasted'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'open-iconic/font/css/open-iconic-bootstrap.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import 'vue-loading-overlay/dist/vue-loading.css'
import './styles/custom.scss'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

const toastedOptions = {
  duration: 5000,
  position: 'bottom-right',
  router
}

Vue.use(Toasted, toastedOptions)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
