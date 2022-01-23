<template>
  <v-app v-if="!loading">
    <app-bar />
    <v-main>
      <transition name="fa" mode="out-in">
        <router-view />
      </transition>
    </v-main>
  </v-app>
  <v-skeleton-loader class="mx-auto" type="card" v-else></v-skeleton-loader>
</template>

<script>
import AppBar from "./components/NavBar.vue";
export default {
  name: "App",
  components: {
    "app-bar": AppBar,
  },
  data() {
    return {
      updateStore: null,
    };
  },
  sockets: {
    connect: function () {
      if (this.isSignedIn) {
        this.addClient();
      }
    },
    liveStatus: function (status) {
      if (this.isSignedIn) {
        this.$store.state.user.liveStatus = status.status;
      }
    },
    updateClientView: function (view) {
      console.log(view);

      if (this.isSignedIn) {
        this.$store.state.user.viewers = view.count;
      }
    },
  },
  methods: {
    async addClient() {
      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: JSON.stringify({
          client: this.$socket.id,
        }),
      };
      await fetch(`${process.env.VUE_APP_API}/api/add-client`, requestOptions)
        .then((res) => {
          if (res.status === 200) {
            return;
          }
          throw "ERROR";
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    if (this.$store.getters.isLoggedIn && this.$store.state.user === null) {
      try {
        this.$store.dispatch("getUserData").then(() => {
          this.$store.dispatch("getFollowing");
          this.$socket.emit("add-client", this.$store.state.user.username);
        });
      } catch (err) {
        console.log(err);
      }
    }
  },
  computed: {
    loading: function () {
      return this.$store.state.loading;
    },
    isSignedIn() {
      return this.$store.getters.isLoggedIn && this.user !== null;
    },
  },
};
</script>
