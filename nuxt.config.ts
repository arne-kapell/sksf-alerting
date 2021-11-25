import { defineNuxtConfig } from 'nuxt3';

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
	// buildModules: [
	// 	'@nuxtjs/vuetify'
	// ],
	css: ['vuetify/lib/styles/main.sass'],
    build: {
        transpile: ['vuetify']
    }
});
