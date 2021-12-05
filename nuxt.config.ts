import colors from "vuetify/es5/util/colors";
import { NuxtConfig } from "@nuxt/types";

const config: NuxtConfig = {
	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		titleTemplate: "%s - SKS-F",
		title: "*mysterious*",
		meta: [
			{ charset: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ hid: "description", name: "description", content: "Sicherheitskoordinationssystem für den Flugbetrieb" }
		],
		link: [
			{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
		]
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [
	],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
	],

	serverMiddleware: [
		{path: "/api", handler: "~/server/api/index.ts"}
	],

	auth: {
		strategies: {
			local: {
				token: {
					property: "token",
					global: true
				},
				user: {
					property: "user",
				// autoFetch: true
				},
				endpoints: {
					login: { url: "/login", method: "post" },
					// logout: { url: "/logout", method: "post" },
					logout: false,
					user: { url: "/user-info", method: "get" }
				}
			}
		}
	},


	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/typescript
		"@nuxt/typescript-build",
		// https://go.nuxtjs.dev/vuetify
		"@nuxtjs/vuetify"
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/axios
		"@nuxtjs/axios",
		// https://go.nuxtjs.dev/pwa
		"@nuxtjs/pwa",
		"@nuxtjs/auth-next",
		"nuxt-socket-io"
	],

	io: {
		sockets: [
			{
				name: "alarms",
				url: `${(process.env.NODE_ENV === "development") ? "http" : "https"}://localhost:3001`,
				default: true,
				vuex: {
					actions: [
						"alarm --> getAlarms"
					]
				}
			},
		]
	},

	// Axios module configuration: https://go.nuxtjs.dev/config-axios
	axios: {
		baseURL: "/api"
	},

	// PWA module configuration: https://go.nuxtjs.dev/pwa
	pwa: {
		manifest: {
			lang: "en"
		}
	},

	// Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
	vuetify: {
		customVariables: ["~/assets/variables.scss"],
		theme: {
			light: false,
			default: "dark",
			// maybe use theme generator: https://theme-generator.vuetifyjs.com/
			themes: {
				dark: {
					primary: colors.blue.darken2,
					accent: colors.grey.darken3,
					secondary: colors.amber.darken3,
					info: colors.teal.lighten1,
					warning: colors.amber.base,
					error: colors.deepOrange.accent4,
					success: colors.green.accent3
				},
				light:{
					primary: "#ffffff",
					accent: "#3068ab",
					secondary: "#e9eaed",
					info: colors.teal.lighten1,
					warning:"#eeba22" ,
					error: "#cd424f",
					success: colors.green.accent3
				}
			},
			options: {
				themeCache: {
					get: (key: string) => localStorage.getItem(key),
					set: (key: string, value: string) => localStorage.setItem(key, value),
				},
			},
		}
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {
	},

	ssr: false
};

export default config;
