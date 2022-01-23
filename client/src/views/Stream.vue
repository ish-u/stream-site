<template>
  <v-container
    fluid
    :class="!$vuetify.breakpoint.smAndDown && isSignedIn ? 'pl-16' : ''"
    style="height: 100%"
  >
    <template v-if="!loading && exists">
      <v-row>
        <v-col :style="`height:${height}`">
          <!-- VIDEO PLAYER COMPONENT -->
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
            <!-- Chat Show Hide Button -->
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

            <!-- Progress Bar - shown for inital load of any Stream  -->
            <v-progress-circular
              v-if="showLiveProgress"
              indeterminate
              color="red"
            ></v-progress-circular>

            <!-- OFFLINE text which is displayed when the User liveStatus is OFFLINE -->
            <span v-else class="text-h3">OFFLINE</span>
          </v-card>

          <!-- USER INFO COMPONENT -->
          <user-info :user="userData" :view="viewers" @updateUser="getUser" />
        </v-col>

        <v-col
          :style="
            !$vuetify.breakpoint.smAndDown
              ? 'display:block; height:90vh'
              : 'display:none'
          "
          cols="3"
          class="chat"
          v-show="showChat"
        >
          <!-- CHAT COMPONENT -->
          <chat
            v-if="!loading && exists"
            :streamingUser="userData.username"
            @toggleChat="toggleChat"
          />
        </v-col>
      </v-row>
    </template>

    <!-- ERROR COMPONENT -->
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
      viewers: 0,
    };
  },
  sockets: {
    // Updating the LIVE STATUS of the Stream
    liveStatus: function (message) {
      this.userData.liveStatus = message.status;
      if (message.status === "ONLINE") {
        this.showLiveProgress = true;
        setTimeout(() => {
          this.showLiveProgress = false;
          this.showLive = true;
        }, 5000);
      } else {
        this.showLive = false;
      }
    },
    // Updating the Title of the Stream
    newTitle: function (title) {
      this.userData.streamTitle = title.newTitle;
    },
    // Updating the View Count of the Stream
    updateView: function (view) {
      console.log(view, this.viewers);
      this.viewers = view.count;
    },
  },
  methods: {
    getUsername() {
      return this.username;
    },
    toggleChat() {
      this.showChat = !this.showChat;
    },
    // Get the User Data whose Stream Page is Opened
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
  },
  destroyed() {
    this.$socket.emit("leave-room", this.userData.username);
  },
  computed: {
    // for the height of the video player
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
    // reseting the player on the chnage of 'User'
    $route(to, from) {
      console.log(to, from);
      if (to.params.user !== from.params.user) {
        this.showLive = false;
        this.showLiveProgress = true;
        this.username = to.params.user;
        this.getUser();
      }
    },
  },
};
</script>

<style scoped>
.chat {
  display: none;
}
</style>
