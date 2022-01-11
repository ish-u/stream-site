<template>
  <v-container
    fluid
    :class="!$vuetify.breakpoint.smAndDown && isSignedIn ? 'pl-16' : ''"
    style="height: 100%"
  >
    <template v-if="!loading && exists">
      <v-row>
        <v-col :style="`height:${height}`">
          <video-player
            v-if="showLive"
            :toggleChatButton="!showChat"
            @toggleChat="toggleChat"
          />
          <v-card
            class="d-flex"
            v-else
            fluid
            style="height: 100%; justify-content: center; align-items: center"
            outlined
          >
            <v-btn
              class="mt-2 mr-2"
              absolute
              right
              x-small
              fab
              dark
              depressed
              v-if="!showChat"
              @click="toggleChat"
            >
              <v-icon> mdi-arrow-left </v-icon>
            </v-btn>
            <v-progress-circular
              v-if="showLiveProgress"
              indeterminate
              color="red"
            ></v-progress-circular>

            <span v-else class="text-h3">OFFLINE</span>
          </v-card>
          <user-info :user="userData" @updateUser="getUser" />
        </v-col>
        <v-col
          :style="
            !$vuetify.breakpoint.smAndDown
              ? 'display:block; height:90vh'
              : 'display:none'
          "
          cols="3"
          v-show="showChat"
        >
          <chat
            v-if="!loading && exists"
            :streamingUser="userData.username"
            @toggleChat="toggleChat"
          />
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
import Chat from "../components/Chat.vue";

export default {
  name: "Stream",
  components: {
    error: Error404,
    VideoPlayer,
    UserInfo,
    Chat,
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
      showChat: true,
    };
  },
  methods: {
    getUsername() {
      return this.username;
    },
    toggleChat() {
      this.showChat = !this.showChat;
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
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "30vh";
        default:
          return "75vh";
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
