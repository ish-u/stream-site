<template>
  <v-card
    width="90%"
    :class="margin + ' mb-8 py-4 mt-8'"
    dark
    color="teal lighten-2"
    elevation="20"
  >
    <v-container :style="styleContainer" fluid class="slider px-16">
      <v-row style="height: 20%">
        <v-col :class="$vuetify.breakpoint.xs ? 'text-h5' : 'text-h3'">
          {{ title }}
        </v-col>
      </v-row>
      <v-row
        style="height: 80%; flex-direction: column; overflow-x: scroll"
        align="center"
        justify="center"
      >
        <v-col
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            align-content: center;
            cursor: pointer;
          "
          v-for="user in users"
          :key="user.username"
          xl="1"
          lg="3"
          md="3"
          sm="4"
          cols="6"
          @click="gotoUserStream(user.username)"
        >
          <v-img
            lazy-src="https://picsum.photos/id/11/10/6"
            :max-height="dimensions"
            :max-width="dimensions"
            class="rounded-circle"
            :src="user.profile"
            style="background: white"
          ></v-img>
          <span
            :class="$vuetify.breakpoint.xs ? 'mt-6 text-h6' : 'mt-6 text-h5'"
          >
            {{ user.username }}
          </span>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "Slider",
  props: {
    title: String,
    users: {},
  },
  methods: {
    // changing streams
    gotoUserStream(user) {
      if (this.$route.params.user !== user) {
        this.$router.push({ name: "Stream", params: { user: user } });
      }
    },
  },
  computed: {
    margin() {
      switch (this.$vuetify.breakpoint.name) {
        case "md":
        case "lg":
        case "xl":
          return "ml-16";
        default:
          return "";
      }
    },
    styleContainer() {
      switch (this.$vuetify.breakpoint.name) {
        case "xl":
        case "lg":
        case "md":
        case "sm":
          return "height : 50vh";
        default:
          var toReturn =
            this.$vuetify.breakpoint.height < 700
              ? "height : 40vh"
              : "height : 35vh";
          return toReturn;
      }
    },
    // image dimesnions
    dimensions() {
      switch (this.$vuetify.breakpoint.name) {
        case "xl":
          return "240px";
        case "lg":
          return "196px";
        case "md":
          return "172px";
        case "sm":
          return "150px";
        default:
          return "104px";
      }
    },
  },
};
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  height: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.1);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: white;
}
</style>
