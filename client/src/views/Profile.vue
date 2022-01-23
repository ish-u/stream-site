<template>
  <v-container>
    <v-row justify="center" class="mt-10">
      <v-card outlined elevation="0" width="fit-content">
        <v-img
          :src="user.profile"
          height="192"
          width="192"
          style="margin: 20px auto; border: solid black 1px"
          class="rounded-circle"
        >
        </v-img>
        <v-card-text>
          <v-row align="center" class="mx-0" justify="center">
            <v-col
              cols="12"
              class="text-h1 d-flex"
              style="justify-content: center"
            >
              {{ user.username }}
            </v-col>
            <v-col
              cols="12"
              class="text-h6 d-flex"
              style="justify-content: center"
            >
              <v-row class="my-2">
                <v-col cols="6" class="d-flex" style="justify-content: center">
                  {{ user.followers.length }} Followers
                </v-col>
                <v-col cols="6" class="d-flex" style="justify-content: center">
                  {{ user.following.length }} Following
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>

    <!-- Stream Key Block -->
    <v-row class="mt-10">
      <v-container fluid>
        <v-card outlined width="inherit" height="max-content">
          <v-container class="py-8">
            <v-row justify="center" v-if="loadingTitle">
              <v-col cols="10">
                <v-skeleton-loader
                  style="height: 10vh"
                  type="image"
                ></v-skeleton-loader>
              </v-col>
            </v-row>
            <v-row justify="center" v-if="!loadingTitle">
              <v-col
                xl="3"
                lg="3"
                md="6"
                sm="6"
                cols="10"
                class="d-flex"
                style="justify-content: center"
                align-self="center"
              >
                <v-subheader class="text-h5"> Stream Title </v-subheader>
              </v-col>
              <v-col xl="7" lg="7" md="7" sm="8" cols="12">
                <v-text-field
                  outlined
                  type="text"
                  placeholder="Enter Stream Title"
                  hide-details="true"
                  v-model="user.streamTitle"
                  append-icon="mdi-content-save"
                  @click:append="changeStreamTitle"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col xl="4" lg="4" md="4" sm="8" cols="12">
                <v-card outlined>
                  <v-card-title> Stream Status </v-card-title>
                  <v-card-text>
                    <span :class="liveStatusClass"> {{ user.liveStatus }}</span>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col xl="4" lg="4" md="4" sm="8" cols="12">
                <v-card outlined>
                  <v-card-title>View Count </v-card-title>
                  <v-card-text>
                    <span class="text-h4"> {{ user.viewers }} </span>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-container>
    </v-row>

    <!-- Stream Key Block -->
    <v-row class="mt-10">
      <v-container fluid>
        <v-card width="inherit" height="max-content" outlined>
          <v-container class="py-8">
            <v-row justify="center">
              <v-col
                xl="3"
                lg="3"
                md="6"
                sm="6"
                cols="10"
                class="d-flex"
                style="justify-content: center"
                align-self="center"
              >
                <v-subheader class="text-h5"> Stream Key </v-subheader>
              </v-col>
              <v-col xl="7" lg="7" md="7" sm="8" cols="12">
                <v-text-field
                  :type="showStreamKey ? 'text' : 'password'"
                  outlined
                  v-model="user.streamKey"
                  hint="At least 8 characters"
                  hide-details="true"
                  readonly
                >
                  <template slot="append">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" @click="copy" left>
                          mdi-content-copy
                        </v-icon>
                      </template>
                      <span>Copy Stream Key</span>
                    </v-tooltip>

                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          v-bind="attrs"
                          v-on="on"
                          @click="showStreamKey = !showStreamKey"
                          right
                          >{{
                            showStreamKey ? "mdi-eye" : "mdi-eye-off"
                          }}</v-icon
                        >
                      </template>
                      <span>
                        {{
                          !showStreamKey ? "Show Stream Key" : "Hide Stream Key"
                        }}
                      </span>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col class="d-flex" style="justify-content: center">
                <v-btn
                  depressed
                  dark
                  x-large
                  :loading="loadingStreamKey"
                  @click="resetStreamKey"
                >
                  Reset Stream Key
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-container>
    </v-row>

    <!-- <v-row>
      <v-col>
        <v-carousel v-model="model">
          <v-carousel-item v-for="(color, i) in colors" :key="color">
            <v-sheet :color="color" height="100%" tile>
              <v-row class="fill-height" align="center" justify="center">
                <div class="text-h2">Slide {{ i + 1 }}</div>
              </v-row>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {
      showStreamKey: false,
      loadingTitle: false,
      loadingStreamKey: false,
      // model: 0,
      // colors: ["primary", "secondary", "yellow darken-2", "red", "orange"],
    };
  },
  methods: {
    async changeStreamTitle() {
      this.loadingTitle = true;
      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      };
      await fetch(
        `${process.env.VUE_APP_API}/api/set-title/${this.user.streamTitle}`,
        requestOptions
      )
        .then((res) => {
          console.log(res.status);
          if (res.status === 200) {
            return res.json();
          } else {
            throw "Error";
          }
        })
        .then((resJSON) => {
          this.user.streamTitle = resJSON.title;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loadingTitle = false;
        });
    },
    async resetStreamKey() {
      this.loadingStreamKey = true;
      const requestOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      };
      await fetch(
        `${process.env.VUE_APP_API}/api/reset-stream-key`,
        requestOptions
      )
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw "Error";
          }
        })
        .then((resJSON) => {
          this.user.streamKey = resJSON.streamKey;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loadingStreamKey = false;
        });
    },
    copy() {
      navigator.clipboard.writeText(this.user.streamKey);
      // const input = this.$refs[field].$refs.input;
      // input.select();
      // document.execCommand("copy");
      // input.setSelectionRange(0, 0); // unselect
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    liveStatusClass() {
      if (this.user.liveStatus === "ONLINE") {
        return "text-h4 green--text";
      } else {
        return "text-h4 dark-grey--text";
      }
    },
  },
};
</script>

<style></style>
