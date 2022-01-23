<template>
  <v-row
    :style="!$vuetify.breakpoint.smAndDown ? 'height: 100%' : 'height: 90%'"
    no-gutters
  >
    <v-col
      xl="6"
      lg="6"
      md="6"
      sm="12"
      xs="12"
      class="px-12 black white--text"
      style="height: inherit"
      :style="
        !$vuetify.breakpoint.smAndDown ? 'height: inherit' : 'display:none'
      "
    >
      <v-row style="height: inherit" align-content="center">
        <v-col offset="1">
          <span :class="!$vuetify.breakpoint.mdAndDown ? 'text-h4' : 'text-h5'">
            welcome to
          </span>
          <br />
          <span :class="!$vuetify.breakpoint.mdAndDown ? 'text-h1' : 'text-h2'">
            stream site
          </span>
        </v-col>
      </v-row>
    </v-col>
    <v-col
      xl="6"
      lg="6"
      md="6"
      sm="12"
      xs="12"
      class="px-12"
      style="height: 100%"
    >
      <v-row
        style="height: inherit"
        class="flex"
        align-content="center"
        justify="center"
      >
        <v-col xl="8" lg="8" md="8" sm="10" xs="12">
          <span class="text-h3">Sign In</span>
          <br />
          <br />
          <v-alert
            v-model="alert"
            dense
            outlined
            type="error"
            transition="scale-transition"
            dark
            dismissible
          >
            Wrong Credentials
          </v-alert>
          <v-text-field
            label="username"
            type="text"
            outlined
            prefix="@"
            v-model="username"
          >
          </v-text-field>
          <v-text-field
            label="password"
            type="password"
            outlined
            v-model="password"
          >
          </v-text-field>
          <v-btn depressed dark x-large @click="signIn" :loading="loading"
            >Sign In</v-btn
          >
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "SignIn",
  data() {
    return {
      username: "",
      password: "",
      alert: false,
      loading: false,
    };
  },
  methods: {
    signIn() {
      this.loading = true;
      // dispatching the getAccessToken Action to obtain the Access Token
      // for making furthur requests
      this.$store
        .dispatch("getAccessToken", {
          username: this.username,
          password: this.password,
        })
        .then(() => {
          try {
            this.$store.dispatch("getUserData");
          } catch (err) {
            console.log(err);
          }
          this.$router.push({ name: "Home" });
        })
        .catch((err) => {
          console.log("SIGN IN ", err);
          this.loading = false;
          this.alert = true;
          return;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style></style>
