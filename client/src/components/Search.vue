<template>
  <v-autocomplete
    :loading="isLoading"
    :search-input.sync="search"
    :items="items"
    item-text="username"
    autofocus
    class="mx-4"
    outlined
    hide-details
    dense
    append-icon=""
    prepend-inner-icon="mdi-magnify"
    :class="closed ? 'closed' : 'not-closed'"
    placeholder="search"
    hide-no-data
  >
    <template v-slot:item="data">
      <v-list-item
        :key="data.item.username"
        @click="gotoUserStream(data.item.username)"
      >
        <v-list-item-avatar>
          <v-img :src="data.item.profile"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-html="data.item.username"></v-list-item-title>
          <v-list-item-subtitle
            v-html="data.item.liveStatus"
          ></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      query: "",
      closed: false,
      entries: [],
      isLoading: false,
      search: null,
    };
  },
  methods: {
    open() {
      this.closed = false;
      this.query = "";
    },
    close() {
      this.query = "";
      this.closed = true;
    },
    gotoUserStream(user) {
      if (this.$route.params.user !== user) {
        console.log(user);
        this.$router.push({ name: "Stream", params: { user: user } });
        this.mini = true;
      } else {
        this.menu = false;
      }
    },
  },
  computed: {
    items() {
      return this.entries.map((entry) => {
        return Object.assign({}, entry, {
          username: entry.username,
          profile: entry.profile,
          liveStatus: entry.liveStatus,
        });
      });
    },
  },
  watch: {
    search(val) {
      this.entries = [];
      console.log(val);

      // If search value is null return
      if (val === null) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetch(`${process.env.VUE_APP_API}/api/search/${val}`, requestOptions)
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          }
          throw "ERROR";
        })
        .then((resJSON) => {
          console.log(resJSON);
          this.entries = resJSON;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style scoped>
.closed {
  max-width: 48px;
  border: 0px !important;
  transition: max-width 0.3s;
}
.not-closed {
  max-width: 250px;
  transition: max-width 0.1s;
}
.v-text-field {
  border: 10px;
}
</style>

// @focus="open" // @blur="close"
