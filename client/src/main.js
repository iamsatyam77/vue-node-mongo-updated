import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Axios from "axios";
import VueAxios from "vue-axios";

import FlashMessage from "@smartweb/vue-flash-message";
import BootstrapVue from "bootstrap-vue";
 
import 'vue-tel-input/dist/vue-tel-input.css';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Vue.component('field-tel-input', TelInput);
Vue.use(VueAxios, Axios);
Vue.use(BootstrapVue);
Vue.use(FlashMessage);

Vue.config.productionTip = false;

const token = localStorage.getItem("token");
if (token) {
  Vue.prototype.$http.defaults.headers.common["x-access-token"] = token;
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
