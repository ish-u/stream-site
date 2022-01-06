<template>
  <v-container
    fluid
    :class="!$vuetify.breakpoint.smAndDown && isSignedIn ? 'pl-16' : ''"
  >
    <template v-if="!loading && exists">
      <v-row :style="`height:${height}`">
        <v-col
          style="height: inherit; justify-content: center; align-items: center"
          class="d-flex"
          cols="12"
          lg="9"
          sm="12"
          md="9"
          xl="10"
        >
          <video-player v-if="showLive" />
          <v-progress-circular
            v-else-if="showLiveProgress"
            indeterminate
            color="red"
          ></v-progress-circular>
          <span class="text-h3" v-else>OFFLINE</span>
        </v-col>
        <v-col
          cols="12"
          lg="3"
          sm="12"
          md="3"
          xl="2"
          style="height: 90vh"
          v-if="!$vuetify.breakpoint.smAndDown"
        >
          <v-card
            class="d-flex"
            style="
              height: 100%;
              width: inherit;
              justify-content: center;
              align-items: center;
            "
            outlined
          >
            <span class="text-h3"> CHAT </span>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mt-6">
        <v-col style="height: inherit" cols="12" lg="9" sm="12" md="9" xl="10">
          <user-info :user="userData" @updateUser="getUser" />
        </v-col>
      </v-row>
    </template>

    <template v-else-if="!loading && !exists">
      <error />
    </template>
  </v-container>
</template>

<script>
import Error404 from "../views/Error404.vue";
import VideoPlayer from "../components/VideoPlayer.vue";
import UserInfo from "../components/UserInfo.vue";

export default {
  name: "Stream",
  components: {
    error: Error404,
    VideoPlayer,
    UserInfo,
  },
  data() {
    return {
      exists: false,
      loading: true,
      username: this.$route.params.user,
      userData: null,
      updateUser: null,
      showLive: false,
      showLiveProgress: false,
    };
  },
  methods: {
    getUsername() {
      return this.username;
    },
    async getUser() {
      // console.log("UPDATE STREAM");
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      await fetch(
        `${process.env.VUE_APP_API}/api/user/${this.username}`,
        requestOptions
      )
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            this.exists = false;
            throw "ERROR";
          }
        })
        .then((resJSON) => {
          this.exists = true;
          this.userData = resJSON;
          if (resJSON.liveStatus === "ONLINE") {
            this.showLiveProgress = true;
            setTimeout(() => {
              this.showLiveProgress = false;
              this.showLive = true;
            }, 5000);
          } else {
            this.showLive = false;
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  created() {
    this.getUser();
    this.updateUser = setInterval(() => {
      this.getUser();
    }, 10000);
  },
  beforeDestroy() {
    clearInterval(this.updateUser);
  },
  computed: {
    height() {
      console.log(this.$vuetify.breakpoint.name);
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "30vh";
        case "sm":
          return "50vh";
        default:
          return "70vh";
      }
    },
    isSignedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
  watch: {
    $route(to, from) {
      if (to.params.user !== from.params.user) {
        this.username = to.params.user;
        clearInterval(this.updateUser);
        this.getUser();
        this.updateUser = setInterval(() => {
          this.getUser();
        }, 10000);
      }
    },
  },
};
</script>

<style></style>
