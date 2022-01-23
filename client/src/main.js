import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import io from "socket.io-client";
import VueSocketIO from "vue-socket.io";

// vue-socket-io connection string
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: io("http://localhost:3000"),
    vuex: {
      store,
      mutationPrefix: "SOCKET_",
    },
    options: {}, //Optional options
  })
);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
