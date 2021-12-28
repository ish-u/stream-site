<template>
  <v-container fluid>
    <v-row class="black--text ma-6" align="center" justify="center">
      <v-col offset="1">
        <span :class="!$vuetify.breakpoint.smAndDown ? 'text-h4' : 'text-h6'">
          welcome to
        </span>
        <br />
        <span :class="!$vuetify.breakpoint.smAndDown ? 'text-h1' : 'text-h3'">
          stream site
        </span>
      </v-col>
      <v-col offset="1" v-if="!$vuetify.breakpoint.smAndDown">
        <v-sheet
          light
          color="teal lighten-3"
          elevation="8"
          height="400"
          width="400"
        >
          <v-row
            class="ma-0"
            style="height: inherit; width: inherit"
            justify="center"
            align-content="center"
            align="center"
          >
            <v-img
              src="https://images.pexels.com/photos/7172701/pexels-photo-7172701.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt=""
              max-height="200"
              max-width="200"
            ></v-img>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  computed: {
    isSignedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
};
</script>
