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
            src: "this.source",
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
  created() {
    // Setting the default channels
    switch (this.$route.params.user) {
      case "user1":
        //  Disney trailer
        this.options.sources[0].src =
          "http://playertest.longtailvideo.com/adaptive/oceans_aes/oceans_aes.m3u8";
        break;
      case "user2":
        //  Tears of Stell
        this.options.sources[0].src =
          "http://content.jwplatform.com/manifests/vM7nH0Kl.m3u8";
        break;
      case "user3":
        // Sintel (Project Durian)
        this.options.sources[0].src =
          "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
        break;
      case "user4":
        // Big Buck Bunny
        this.options.sources[0].src =
          "https://multiplatform-f.akamaihd.net/i/multi/will/bunny/big_buck_bunny_,640x360_400,640x360_700,640x360_1000,950x540_1500,.f4v.csmil/master.m3u8";
        break;
      default:
        this.options.sources[0].src = `${process.env.VUE_APP_HLS}/${this.$route.params.user}.m3u8`;
        break;
    }
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
