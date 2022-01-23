<template>
  <v-card outlined style="height: 100%">
    <v-card-title>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            style="position: absolute"
            left
            @click="$emit('toggleChat')"
            tag="collapse chat"
            v-bind="attrs"
            v-on="on"
          >
            mdi-arrow-right
          </v-icon>
        </template>
        <span>Collapse Chat</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <span class="text-h6 font-weight-light">Chat</span>
      <v-spacer></v-spacer>
    </v-card-title>
    <v-card-text style="height: 80%; overflow-y: scroll">
      <v-list id="chat" style="height: max-content">
        <v-list-item> Welcome to {{ this.streamingUser }}'s chat </v-list-item>

        <v-list-item v-for="message in messages" :key="message.id">
          <v-list-item-content>
            <v-list-item-title
              >{{ message.user }} &nbsp;
              <span class="text--secondary text-caption">
                {{ message.time.getHours() }}:{{ message.time.getMinutes() }}
              </span>
            </v-list-item-title>
            <span class="text-body-2 text--secondary">
              {{ message.message }}
            </span>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-text-field
        class="mx-3"
        v-model="message"
        outlined
        hide-details
        dense
        :disabled="this.$store.state.user === null"
        append-outer-icon="mdi-send"
        @click:append-outer="sendMessaage"
        @keypress.enter="sendMessaage"
        placeholder="chat!"
      >
      </v-text-field>
    </v-card-actions>
  </v-card>
</template>

<script>
import Vue from "vue";
export default {
  name: "Chat",
  props: {
    streamingUser: String,
  },
  data() {
    return {
      messages: [],
      message: "",
      sideDrawer: false,
      mini: true,
    };
  },
  sockets: {
    pongServer: function () {},
    recieveMessage: function (message) {
      this.messages.push({ ...message, time: new Date() });
      this.scrollInView();
    },
  },
  methods: {
    pingServer() {
      // Send the "pingServer" event to the server.
      this.$socket.emit("pingServer", "PING!");
    },
    sendMessaage() {
      if (this.user !== null && this.message !== "") {
        this.$socket.emit(
          "sendMessage",
          this.message,
          this.streamingUser,
          this.user.username
        );
        var newMessage = {
          id: Math.random() * Math.random(),
          user: this.user.username,
          message: this.message,
          time: new Date(),
        };
        this.messages.push(newMessage);
        this.scrollInView();
        this.message = "";
      }
    },
    scrollInView() {
      Vue.nextTick(() => {
        const element = document.getElementById("chat").lastElementChild;
        element.scrollIntoView();
      });
    },
  },
  created() {
    this.$socket.emit("join-room", this.streamingUser);
  },
  beforeDestroy() {
    this.$socket.emit("leave-room", this.streamingUser);
  },

  computed: {
    user() {
      return this.$store.state.user;
    },
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
</style>
