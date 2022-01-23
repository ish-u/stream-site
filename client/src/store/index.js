import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: localStorage.getItem("accessToken") || null,
    user: null,
    loading: false,
    following: [],
  },
  mutations: {
    SET_ACCESS_TOKEN(state, token) {
      state.accessToken = token;
    },
    SET_USER_DATA(state, user) {
      state.user = user;
    },
    SET_FOLLOWING(state, following) {
      state.following = following;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
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
            context.commit("SET_LOADING", false);

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
        if (this.state.user === null) {
          context.commit("SET_LOADING", true);
        }
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
              context.commit("SET_LOADING", false);
              resolve();
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        });
      }
    },
    getFollowing(context) {
      if (localStorage.getItem("accessToken") !== null) {
        if (this.state.user !== null) {
          return new Promise((resolve, reject) => {
            const requestOptions = {
              method: "GET",
              headers: {
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
              },
            };

            fetch(
              `${process.env.VUE_APP_API}/api/following/${this.state.user.username}`,
              requestOptions
            )
              .then((res) => {
                if (res.status !== 200) {
                  reject(res.status);
                  return;
                }
                return res.json();
              })
              .then((resJSON) => {
                context.commit("SET_FOLLOWING", resJSON);
                resolve();
              })
              .catch((err) => {
                console.log(err);
                reject(err);
              });
          });
        }
      }
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.accessToken !== null;
    },
    followingUsers(state) {
      const users = [];
      for (var i = 0; i < state.following.length; i++) {
        users.push(state.following[i].username);
      }
      return users;
    },
  },
});
