<template>
  <v-app>
    <app-bar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from "./components/NavBar.vue";
export default {
  name: "App",
  components: {
    "app-bar": AppBar,
  },

  created() {
    if (this.$store.getters.isLoggedIn && this.$store.state.user === null) {
      try {
        this.$store.dispatch("getUserData");
      } catch (err) {
        console.log(err);
      }
    }
  },
};
</script>
