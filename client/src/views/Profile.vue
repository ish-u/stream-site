<template>
  <v-container>
    <v-row justify="center mt-10">
      <v-card outlined elevation="4" width="fit-content">
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
        <v-sheet
          width="inherit"
          height="max-content"
          color="white lighten-1"
          elevation="4"
        >
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
                <v-subheader class="text-h5"> Stream Title </v-subheader>
              </v-col>
              <v-col xl="7" lg="7" md="7" sm="8" cols="12">
                <v-text-field
                  outlined
                  type="text"
                  placeholder="Enter Stream Title"
                  hide-details="true"
                  append-icon="mdi-content-save"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col xl="4" lg="4" md="4" sm="8" cols="12">
                <v-card outlined>
                  <v-card-title> Stream Status </v-card-title>
                  <v-card-text>
                    <span class="text-h4"> Live</span>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col xl="4" lg="4" md="4" sm="8" cols="12">
                <v-card outlined>
                  <v-card-title>View Count </v-card-title>
                  <v-card-text>
                    <span class="text-h4"> 300k</span>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-container>
    </v-row>

    <!-- Stream Key Block -->
    <v-row class="mt-10">
      <v-container fluid>
        <v-sheet
          width="inherit"
          height="max-content"
          color="white lighten-1"
          elevation="4"
        >
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
                  :append-icon="showStreamKey ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showStreamKey ? 'text' : 'password'"
                  outlined
                  @click:append="showStreamKey = !showStreamKey"
                  v-model="user.streamKey"
                  hint="At least 8 characters"
                  hide-details="true"
                  readonly
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col class="d-flex" style="justify-content: center">
                <v-btn depressed dark x-large> Reset Stream Key </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-sheet>
      </v-container>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Profile",
  data() {
    return {
      showStreamKey: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
};
</script>

<style></style>
