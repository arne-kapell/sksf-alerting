<template>
      <v-container fluid class="d-flex flex-column" style="text-align: center;">
        <h1 class="text-h3">Currently <v-chip large outlined color="error" class="px-3 text-h4">{{ info.count }}</v-chip> alarm{{ info.count === 1 ? '' : 's' }}</h1>
		<v-card v-for="(item, index) in info.alarms" :key="index" class="mt-3">
			<v-card-title>{{ item.system }}</v-card-title>
		</v-card>
      </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	layout: "main",
	head() {
		return {
			title: "Passenger Information",
		};
	},
	async asyncData({ $axios }) {
		const info = await $axios.$get("/passenger/information");
		console.log(info);
		return { info };
	},
});
</script>
