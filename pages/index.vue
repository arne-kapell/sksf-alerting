<template>
  <div id="root" >
    <v-app>
      <v-container class="main-page container--fluid">
        <NavBarUp/>
        <v-col class="col-2" >
          <MenuSide/>
        </v-col>
        <v-col class="col-7 offset-1">
          <AlarmListe/>
        </v-col>
      </v-container>
    </v-app>
  </div>
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
	},
	asyncData: async (ctx) => {
		return {
			user: await ctx.store.dispatch("auth/getUser")
		};
	},
	methods: {
		async getUserInfo() {
			const info = await this.$axios.$get("/user-info");
			console.log(info);
		}
	}
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
#root {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow-y: scroll;
  background-color: white;
}

.main-page{
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: start;
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
