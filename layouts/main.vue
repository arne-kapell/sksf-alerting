<template>
  <v-app>
    <v-app-bar app :elevation="5">
		<div class="d-flex justify-space-between align-center" style="width: 100%">
			<v-tooltip bottom v-if="!['/','/passenger','/login'].includes($route.path)">
				<template v-slot:activator="{ on }">
					<v-btn v-on="on" @click="$router.push('/')">
						<v-icon large>mdi-view-dashboard-variant</v-icon>
					</v-btn>
				</template>
				<span>Go to dashboard</span>
			</v-tooltip>
			<div v-else />
			<nav-bar-up v-if="$auth.user && $auth.loggedIn" :socketStatus="$auth.user && $auth.loggedIn && socket && socket.connected" class="mx-2"/>
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn v-on="on" @click="toggleTheme" fab small class="pa-2"><v-icon large>mdi-theme-light-dark</v-icon></v-btn>
				</template>
				<span>{{ $vuetify.theme.dark ? "Switch to light mode" : "Switch to dark mode" }}</span>
			</v-tooltip>
		</div>
	</v-app-bar>
	<v-main>
        <Nuxt />
	</v-main>
	<v-container class="alerts mr-3 mb-2">
		<v-alert v-for="(a, i) in alerts" :key="i" :value="a.show | true" elevation="5" dense :type="a.type" :dismissible="a.dismissable | true" :transition="a.show ? 'scroll-x-reverse-transition' : 'scroll-x-transition'">{{ a.text }}</v-alert>
	</v-container>
    <v-footer :elevation="10" app class="d-flex justify-center" style="text-align: center;" outlined>
      <span class="text-overline">Sicherheitskoordinationssystem für den Flugbetrieb (SKS-F) | &copy; {{ new Date().getFullYear() }} TINF20CS1</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { NuxtSocketOpts } from "nuxt-socket-io";
import { Auth, TokenableScheme } from "@nuxtjs/auth-next";
import { Socket } from "socket.io";
export default {
	data () {
		return {
			clipped: false,
			drawer: false,
			fixed: false,
			items: [
				{
					icon: "mdi-apps",
					title: "Welcome",
					to: "/"
				},
				{
					icon: "mdi-chart-bubble",
					title: "Inspire",
					to: "/inspire"
				}
			],
			miniVariant: false,
			right: true,
			rightDrawer: false,
			socket: null as Socket | null,
			socketStatus: {},
			alerts: [] as { type: "error" | "info" | "success" | "warning" | string, text: string, dismissable?: boolean, show?: boolean }[]
		};
	},
	computed: {
		dark () {
			return this.$vuetify.theme.dark;
		}
	},
	methods: {
		toggleTheme () {
			this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
		},
		connectSocket () {
			const token = ((this.$auth as Auth).strategy as TokenableScheme).token.get();
			this.socket = this.$nuxtSocket({
				path: "/socket.io",
				extraHeaders: {
					Authorization: token
				},
				persist: true,
				reconnect: true,
				reconnectAttempts: Infinity
			} as NuxtSocketOpts) as Socket;
		}
	},
	async asyncData ({ store }) {
		await store.dispatch("getAlarms");
	},
	async created () {
		if (this.$auth.user && this.$auth.loggedIn) {
			await this.$store.dispatch("getAlarms");
			this.connectSocket();
		}
	},
	watch: {
		"socket.connected": function(to, from) {
			if (to && !from && this.$auth.loggedIn) {
				this.alerts = this.alerts.map(a => {
					if (a.type === "warning" && a.text === "Disconnected from realtime updates") {
						a.show = false;
					}
					return a;
				});
				const alert = {
					type: "success",
					text: "Connected for realtime updates",
					show: false
				};
				this.alerts.push(alert);
				setTimeout(() => {
					alert.show = true;
					this.alerts.splice(this.alerts.indexOf(alert), 1, alert);
				}, 1);
				setTimeout(() => {
					alert.show = false;
					this.alerts.splice(this.alerts.indexOf(alert), 1, alert);
				}, 2000);
			} else if (!to && from && this.$auth.loggedIn) {
				const alert = {
					type: "warning",
					text: "Disconnected from realtime updates",
					dismissable: true,
					show: false
				};
				this.alerts.push(alert);
				setTimeout(() => {
					alert.show = true;
					this.alerts.splice(this.alerts.indexOf(alert), 1, alert);
				}, 1);
			}
		},
		"$auth.loggedIn": async function(to, from) {
			console.log(to, from);
			if (!to && from) {
				this.socket?.disconnect();
				this.socket = null;
				this.$router.push("/login");
			} else if (to && !from) {
				await this.$store.dispatch("getAlarms");
				this.connectSocket();
			}
		}
	}
};
</script>

<style>
.alerts {
	position: absolute;
	bottom: 0;
	right: 0;
	z-index: 9999;
	max-width: 60%;
	width: max-content;
}
</style>