<template>
    <v-app>
            <v-main>
                <v-container>
                    <v-card light>dashboard</v-card>
					<div v-for="a in alarms" :key="a.uid">
                    <v-card light>
						category: {{a.category}}
						datetime: {{a.datetime}}
						risk: {{a.risk}}
						source: {{(a.source) ? a.source.name : ""}}
						checklist: {{a.checklist}}
					</v-card>
					</div>
					<v-btn type="reset" @click="logout">logout</v-btn>
                </v-container>
            </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import type { NuxtSocket, NuxtSocketOpts } from "nuxt-socket-io";
import { TokenableScheme } from "@nuxtjs/auth-next";

export default Vue.extend({
	middleware: "auth",
	name: "dashboard",
	data() {
		return {
			drawer: false,
			socket: null as NuxtSocket | null,
			socketStatus: {}
		};
	},
	computed: {
		// eslint-disable-next-line no-undef
		alarms(): Alarm[] {
			return this.$store.state.alarms;
		}
	},
	methods: {
		async logout() {
			await this.$auth.logout();
			this.$router.push("/login");
		},
		toggleDrawer() {
			this.drawer = !this.drawer;
		}
	},
	mounted() {
		const token = (this.$auth.strategy as TokenableScheme).token.get();
		console.log(token);
		this.socket = this.$nuxtSocket({
			path: "/socket.io",
			extraHeaders: {
				Authorization: token
			}
		} as NuxtSocketOpts);
		this.$store.dispatch("getAlarms");
	},
	updated() {
		console.log(this.alarms);
	}
});
</script>