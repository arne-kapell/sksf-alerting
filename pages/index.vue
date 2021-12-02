<template>
      <v-container fluid class="main-page">
        <v-col class="col-2 pa-0">
          <menu-side/>
        </v-col>
        <v-col class="col-7 offset-1">
          <alarm-liste/>
        </v-col>
      </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import type { NuxtSocket, NuxtSocketOpts } from "nuxt-socket-io";
import { TokenableScheme } from "@nuxtjs/auth-next";

export default Vue.extend({
	middleware: "auth",
	layout: "main",
	data() {
		return {
			light: true,
			socket: null as NuxtSocket | null,
			socketStatus: {}
		};
	},
	mounted() {
		const token = (this.$auth.strategy as TokenableScheme).token.get();
		this.socket = this.$nuxtSocket({
			path: "/socket.io",
			extraHeaders: {
				Authorization: token
			}
		} as NuxtSocketOpts);
		this.$store.dispatch("getAlarms");
	}
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

.main-page{
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: flex-start;
}
#menu-side {
  padding: 0;
  gap: 0;
}
.col-6 {
  max-width: 100%;
  flex: 100%;
}
</style>
