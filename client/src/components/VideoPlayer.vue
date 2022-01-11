<template>
  <v-card style="height: 100%; width: 100%" outlined class="pa-1">
    <v-btn
      class="mt-2 mr-2"
      @click="$emit('toggleChat')"
      absolute
      right
      small
      fab
      dark
      depressed
      v-if="toggleChatButton"
    >
      <v-icon> mdi-arrow-left </v-icon>
    </v-btn>

    <video
      class="video-js vjs-big-play-centered"
      ref="videoPlayer"
      controls
      autoplay
    ></video>
  </v-card>
</template>

<script>
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default {
  name: "VideoPlayer",
  props: {
    toggleChatButton: Boolean,
  },
  data() {
    return {
      player: null,
      options: {
        // videojs and plugin options
        autoplay: true,
        constrols: true,
        sources: [
          {
            withCredentials: false,
            type: "application/x-mpegURL",
            src: `${process.env.VUE_APP_HLS}/${this.$route.params.user}.m3u8`,
          },
        ],
        controlBar: {
          timeDivider: false,
          durationDisplay: true,
        },
        flash: { vhs: { withCredentials: false } },
        html5: { vhs: { withCredentials: false } },
        poster: "",
      },
    };
  },
  mounted() {
    this.player = videojs(
      this.$refs.videoPlayer,
      this.options,
      function onPlayerReady() {
        console.log("onPlayerReady", this);
      }
    );
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
};
</script>

<style>
.video-js {
  position: relative !important;
  width: 100% !important;
  height: 99% !important;
}
.vjs-poster {
  position: absolute !important;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
