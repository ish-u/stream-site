<template>
  <nav relative>
    <v-app-bar app elevation="4" color="dark">
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = true">
      </v-app-bar-nav-icon>
      <v-app-bar-title>
        <span class="black white--text pa-2" @click="goToHomeView">
          stream site
        </span>
      </v-app-bar-title>
      <template v-if="!$vuetify.breakpoint.smAndDown">
        <v-row class="flex hidden-sm-and-down" v-if="!isSignedIn" justify="end">
          <v-btn depressed rounded class="ma-2" dark @click="goToSignInView">
            <span> Sign In</span>
          </v-btn>
          <v-btn depressed rounded class="ma-2" dark @click="goToSignUpView">
            <span> Sign Up </span>
          </v-btn>
        </v-row>
        <v-row v-if="isSignedIn" @click="signOut" class="flex" justify="end">
          <v-btn depressed rounded class="ma-2" dark> Logout </v-btn>
        </v-row>
      </template>
    </v-app-bar>

    <!-- Top Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <template v-if="!isSignedIn">
          <v-list-item-group v-model="group">
            <v-list-item @click="goToSignInView">
              <v-list-item-icon>
                <v-icon>mdi-account-arrow-right</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sign In</v-list-item-title>
            </v-list-item>

            <v-list-item @click="goToSignUpView">
              <v-list-item-icon>
                <v-icon>mdi-account-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sign Up</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </template>
      </v-list>

      <template v-slot:append v-if="isSignedIn">
        <div class="pa-2">
          <v-btn
            class="white--text"
            depressed
            width="100%"
            color="black"
            @click="signOut"
          >
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Side Navigation Drawer -->
    <v-navigation-drawer
      v-if="isSignedIn"
      class="mt-16"
      absolute
      permanent
      v-model="sideDrawer"
      :mini-variant="mini"
      :style="!$vuetify.breakpoint.smAndDown ? 'height:90%' : 'display:none'"
    >
      <v-list nav>
        <v-list-item-group>
          <v-list-item @click.stop="mini = !mini">
            <v-list-item-icon>
              <v-icon v-if="!mini">mdi-arrow-left</v-icon>
              <v-icon v-if="mini">mdi-arrow-right</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Following</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Person</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  components: {},
  data() {
    return {
      drawer: false,
      group: null,
      sideDrawer: false,
      mini: true,
    };
  },
  methods: {
    goToHomeView() {
      if (this.$route.name !== "Home") {
        this.$router.push({ name: "Home" });
      }
    },
    goToSignInView() {
      if (this.$route.name !== "Sign In" && !this.isSignedIn) {
        this.$router.push({ name: "Sign In" });
      } else {
        this.drawer = false;
      }
    },
    goToSignUpView() {
      if (this.$route.name !== "Sign Up" && !this.isSignedIn) {
        this.$router.push({ name: "Sign Up" });
      } else {
        this.drawer = false;
      }
    },
    signOut() {
      this.$store.dispatch("removeAccessToken");
      this.$router.push({ name: "Sign In" });
    },
  },
  computed: {
    isSignedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
};
</script>

<style></style>
