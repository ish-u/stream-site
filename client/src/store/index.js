import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: localStorage.getItem("accessToken") || null,
    user: null,
  },
  mutations: {
    SET_ACCESS_TOKEN(state, token) {
      state.accessToken = token;
    },
    SET_USER_DATA(state, user) {
      state.user = user;
    },
  },
  actions: {
    getAccessToken(context, payload) {
      const { username, password } = payload;
      return new Promise((resolve, reject) => {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        };
        fetch(`${process.env.VUE_APP_API}/api/signin`, requestOptions)
          .then((res) => {
            if (res.status !== 200) {
              reject(res.status);
              return;
            }
            return res.json();
          })
          .then((resJSON) => {
            localStorage.setItem("accessToken", resJSON.token);
            context.commit("SET_ACCESS_TOKEN", resJSON.token);
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    removeAccessToken(context) {
      localStorage.removeItem("accessToken");
      context.commit("SET_ACCESS_TOKEN", null);
    },
    getUserData(context) {
      if (localStorage.getItem("accessToken") !== null) {
        return new Promise((resolve, reject) => {
          const requestOptions = {
            method: "GET",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("accessToken"),
              "Content-Type": "application/json",
            },
          };

          fetch(`${process.env.VUE_APP_API}/api/me`, requestOptions)
            .then((res) => {
              if (res.status !== 200) {
                reject(res.status);
                return;
              }
              return res.json();
            })
            .then((resJSON) => {
              context.commit("SET_USER_DATA", resJSON);
              resolve();
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        });
      }
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.accessToken !== null;
    },
  },
});
