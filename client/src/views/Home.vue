<template>
  <v-container fluid>
    <v-row class="black--text ma-6" align="center" justify="center">
      <v-col :offset="!$vuetify.breakpoint.smAndDown ? 1 : 0">
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
    <v-row justify="center">
      <!-- Featured Streamers Slider -->
      <slider title="Featured Streamer" :users="this.users" />
    </v-row>
  </v-container>
</template>

<script>
import Slider from "../components/Slider.vue";
export default {
  name: "Home",
  components: {
    Slider,
  },
  data() {
    return {
      users: [],
    };
  },
  methods: {
    // get the featured users
    getFeatured() {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetch(`${process.env.VUE_APP_API}/api/search/user`, requestOptions)
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          }
          throw "ERROR";
        })
        .then((resJSON) => {
          this.users = resJSON;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    isSignedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
  created() {
    this.getFeatured();
  },
};
</script>
