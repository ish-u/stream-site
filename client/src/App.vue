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
  created() {
    if (this.$store.getters.isLoggedIn && this.$store.state.user === null) {
      try {
        this.$store.dispatch("getUserData").then(() => {
          this.$store.dispatch("getFollowing");
        });
      } catch (err) {
        console.log(err);
      }
    }
  },
  mounted() {
    this.updateStore = setInterval(() => {
      this.$store.dispatch("getUserData");
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.updateStore);
  },
  computed: {
    loading: function () {
      return this.$store.state.loading;
    },
  },
};
</script>
