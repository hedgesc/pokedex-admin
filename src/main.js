import Vue from "vue";
import Toasted from "vue-toasted";
import App from "./App.vue";
import router from "./router";
import store from "./store";

const toastedOptions = {
  duration: 5000,
  position: "bottom-right",
  router
};

Vue.use(Toasted, toastedOptions);

import "open-iconic/font/css/open-iconic-bootstrap.css";
import "./styles/custom.scss";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
