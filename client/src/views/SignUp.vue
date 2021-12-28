<template>
  <v-row style="height: 100%" no-gutters>
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
        <v-col offset-lg="1">
          <span :class="!$vuetify.breakpoint.mdAndDown ? 'text-h4' : 'text-h5'"
            >welcome to</span
          >
          <br />
          <span :class="!$vuetify.breakpoint.mdAndDown ? 'text-h1' : 'text-h2'"
            >stream site</span
          >
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
          <span class="text-h3">Sign Up</span>
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
            something went wrong
          </v-alert>

          <v-text-field label="name" type="text" outlined v-model="name">
          </v-text-field>
          <v-text-field
            label="username"
            type="text"
            outlined
            prefix="@"
            v-model="username"
            @input="checkUsername"
            :error-messages="usernameTaken ? 'Username Taken' : ''"
          >
          </v-text-field>
          <v-text-field label="email" type="email" outlined v-model="email">
          </v-text-field>
          <v-text-field
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            label="password"
            :type="showPassword ? 'text' : 'password'"
            outlined
            @click:append="showPassword = !showPassword"
            v-model="password"
            hint="At least 8 characters"
          >
          </v-text-field>
          <br />
          <v-btn depressed dark x-large :loading="loading" @click="signUp"
            >Sign Up</v-btn
          >
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "SignUp",
  data: () => {
    return {
      showPassword: false,
      name: "",
      username: "",
      email: "",
      password: "",
      usernameTaken: false,
      loading: false,
      alert: false,
    };
  },
  methods: {
    async signUp() {
      if (!this.usernameTaken) {
        this.loading = true;
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: this.name,
            username: this.username,
            email: this.email,
            password: this.password,
          }),
        };
        await fetch(`${process.env.VUE_APP_API}/api/signup`, requestOptions)
          .then((res) => {
            if (res.status === 200) {
              this.$router.push({ name: "Sign In" });
            } else {
              this.alert = true;
            }
          })
          .catch((err) => {
            this.alert = true;
            console.log(err);
          });
      }
    },
    // check if  the username is already taken or not
    async checkUsername() {
      if (this.username.length) {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
        await fetch(
          `${process.env.VUE_APP_API}/api/checkUsername/${this.username}`,
          requestOptions
        ).then((res) => {
          console.log(res.status);
          if (res.status === 200) {
            this.usernameTaken = false;
          } else {
            this.usernameTaken = true;
          }
        });
      }
    },
  },
};
</script>

<style></style>
