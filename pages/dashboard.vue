<template>
    <v-app>
            <v-main>
                <v-container>
                     <v-card light>dashboard</v-card>
                </v-container>
            </v-main>
    </v-app>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	middleware: "auth",
	name: "dashboard",
	data() {
		return {
			drawer: false
		};
	},
	methods: {
		toggleDrawer() {
			this.drawer = !this.drawer;
		}
	}
});
</script>