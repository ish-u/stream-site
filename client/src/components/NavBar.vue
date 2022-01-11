<template>
  <nav>
    <v-app-bar app flat outlined style="background: white">
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = true">
      </v-app-bar-nav-icon>
      <v-app-bar-title>
        <span class="black white--text pa-2" @click="goToHomeView">
          stream site
        </span>
      </v-app-bar-title>
      <template v-if="!$vuetify.breakpoint.smAndDown">
        <v-row
          class="hidden-sm-and-down"
          v-if="!isSignedIn"
          align="center"
          justify="end"
          align-content="center"
        >
          <search />
          <v-btn depressed rounded class="ma-2" dark @click="goToSignInView">
            <span> Sign In</span>
          </v-btn>
          <v-btn depressed rounded class="ma-2" dark @click="goToSignUpView">
            <span> Sign Up </span>
          </v-btn>
        </v-row>
        <v-row
          v-if="isSignedIn"
          class="ma-0 pa-0"
          align-content="center"
          justify="end"
          align="center"
        >
          <search />
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :offset-y="true"
            :nudge-bottom="16"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                color="indigo"
                dark
                v-bind="attrs"
                v-on="on"
                class="mr-4"
              >
                <v-avatar>
                  <img :src="user.profile" alt="" />
                </v-avatar>
              </v-btn>
            </template>
            <v-card width="200" outlined elevation="0">
              <v-list>
                <v-list-item @click="goToProfileView">
                  <v-list-item-avatar>
                    <img :src="user.profile" alt="John" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ user.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      user.liveStatus
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-divider></v-divider>
              <v-list>
                <v-list-item @click="signOut">
                  <v-list-item-avatar>
                    <v-icon> mdi-logout </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>Sign Out</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-row>
      </template>
    </v-app-bar>

    <!-- Top Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <template v-slot:prepend v-if="isSignedIn">
        <v-list-item two-line @click="goToProfileView">
          <v-list-item-avatar>
            <img :src="user.profile" />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.liveStatus }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-list dense>
        <search />
      </v-list>

      <template>
        <v-list nav dense v-if="!isSignedIn">
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
        </v-list>

        <v-list nav dense v-if="isSignedIn">
          <v-list-item-group v-model="group">
            <v-list-item @click="signOut">
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Sign Out</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
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
            <v-list-item-title class="text--primary"
              >Following</v-list-item-title
            >
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-list-item
        class="px-2"
        v-for="u in following"
        :key="u._id"
        @click="gotoUserStream(u.username)"
      >
        <v-list-item-avatar>
          <img :src="u.profile" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ u.username }}</v-list-item-title>
          <v-list-item-subtitle>{{ u.liveStatus }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import Search from "./Search.vue";
export default {
  name: "NavBar",
  components: {
    Search: Search,
  },
  data() {
    return {
      drawer: false,
      group: null,
      sideDrawer: false,
      mini: true,
      menu: false,
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
    goToProfileView() {
      if (this.$route.name !== "Profile") {
        this.$router.push({ name: "Profile" });
      } else {
        this.menu = false;
      }
    },
    gotoUserStream(user) {
      if (this.$route.params.user !== user) {
        console.log(user);
        this.$router.push({ name: "Stream", params: { user: user } });
        this.mini = true;
      } else {
        this.menu = false;
      }
    },
    signOut() {
      this.$store.dispatch("removeAccessToken");
      this.$router.push({ name: "Sign In" });
      this.$store.commit("SET_USER_DATA", null);
      this.$store.commit("SET_FOLLOWING", []);
    },
  },
  computed: {
    isSignedIn() {
      return this.$store.getters.isLoggedIn;
    },
    user() {
      return this.$store.state.user;
    },
    following() {
      return this.$store.state.following;
    },
  },
};
</script>

<style></style>
