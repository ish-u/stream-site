<template>
  <v-card width="inherit" outlined class="mt-4 pa-0">
    <v-container fluid class="ma-0 pa-0">
      <v-row>
        <v-col>
          <v-list width="inherit">
            <v-list-item>
              <v-list-item-avatar
                :height="!$vuetify.breakpoint.mobile ? '72' : '48'"
                :width="!$vuetify.breakpoint.mobile ? '72' : '48'"
                :style="
                  user.liveStatus === 'ONLINE'
                    ? 'border: green solid;'
                    : 'border: solid grey;'
                "
              >
                <v-img :src="user.profile"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  :class="!$vuetify.breakpoint.mobile ? 'text-h4' : 'text-h5'"
                >
                  {{ user.name }}
                </v-list-item-title>
                <v-list-item-subtitle
                  :class="!$vuetify.breakpoint.mobile ? 'text-h6' : ''"
                  >{{ user.streamTitle }}</v-list-item-subtitle
                >
              </v-list-item-content>
              <v-list-item-action v-if="!$vuetify.breakpoint.mobile">
                <v-chip> {{ user.followers.length }} Followers </v-chip>
              </v-list-item-action>

              <v-list-item-action>
                <v-btn
                  :disabled="user.username === currentUser"
                  color="black"
                  class="ma-2 white--text"
                  :small="$vuetify.breakpoint.mobile"
                  @click="toggleFollow"
                  >{{ following ? "Following" : "Follow" }}
                  <v-icon v-if="!following" dark right> mdi-heart </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "UserInfo",
  props: {
    user: Object,
  },
  methods: {
    async follow() {
      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      };
      await fetch(
        `${process.env.VUE_APP_API}/api/follow/${this.user.username}`,
        requestOptions
      )
        .then((res) => {
          if (res.status === 200) {
            this.$store.dispatch("getFollowing");
            this.$emit("updateUser");
            return;
          }
          throw "ERROR";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async unfollow() {
      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      };
      await fetch(
        `${process.env.VUE_APP_API}/api/unfollow/${this.user.username}`,
        requestOptions
      )
        .then((res) => {
          if (res.status === 200) {
            this.$store.dispatch("getFollowing");
            this.$emit("updateUser");
            return;
          }
          throw "ERROR";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async toggleFollow() {
      if (this.following) {
        await this.unfollow();
      } else {
        await this.follow();
      }
    },
  },
  computed: {
    following() {
      return this.$store.getters.followingUsers.includes(this.user.username);
    },
    currentUser() {
      return this.$store.state.user !== null && this.$store.state.user.username;
    },
  },
};
</script>

<style></style>
