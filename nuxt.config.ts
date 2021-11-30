import { defineNuxtConfig } from 'nuxt3';

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
    // eslint-disable-next-line no-mixed-spaces-and-tabs
	 //buildModules: [
		//'@nuxtjs/vuetify',
	//],
	css: ['vuetify/lib/styles/main.sass'],
    build: {
        transpile: ['vuetify']
    }
});
