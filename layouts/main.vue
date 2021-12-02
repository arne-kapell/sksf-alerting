<template>
  <v-app>
    <v-app-bar app :elevation="5">
		<div class="d-flex justify-space-between align-center" style="width: 100%">
			<v-tooltip bottom v-if="$route.path !== '/'">
				<template v-slot:activator="{ on }">
					<v-btn v-on="on" @click="$router.push('/')">
						<v-icon large>mdi-view-dashboard-variant</v-icon>
					</v-btn>
				</template>
				<span>Go to dashboard</span>
			</v-tooltip>
			<nav-bar-up v-if="$auth.user && $auth.loggedIn" class="mx-2"/>
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<v-btn v-on="on" @click="toggleTheme"><v-icon large>mdi-theme-light-dark</v-icon></v-btn>
				</template>
				<span>{{ $vuetify.theme.dark ? "Switch to light mode" : "Switch to dark mode" }}</span>
			</v-tooltip>
		</div>
	</v-app-bar>
	<v-main>
        <Nuxt />
	</v-main>
    <v-footer :elevation="10" app class="d-flex justify-center" style="text-align: center;">
      <span>Sicherheitskoordinationssystem für den Flugbetrieb (SKS-F) | &copy; {{ new Date().getFullYear() }} TINF20CS1</span>
    </v-footer>
  </v-app>
</template>

<script>
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
			title: "Vuetify.js"
		};
	},
	computed: {
		dark () {
			return this.$vuetify.theme.dark;
		}
	},
	methods: {
		toggleTheme () {
			console.log(this.$vuetify.theme.dark);
			this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
		}
	}
};
</script>