
<template>
  <v-data-table :dense="dense" :loading="loading" :multi-sort="multiSort" :headers="headers.length ? headers : autoHeaders" :items="items">

  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	name: "ListComponent",
	props: {
		dense: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		},
		multiSort: {
			type: Boolean,
			default: false
		},
		items: {
			type: Array,
			default: (): {a: number, b: number}[] => [{a: 1, b: 2}]
		},
		itemKey: {
			type: String,
			default: "uid"
		},
		headers: {
			type: Array,
			default: (): {text: string, value: string}[] => []
		}
	},
	data() {
		return {
			autoHeaders: [] as {text: string, value: string}[],
		};
	},
	methods: {
		headerFactory() {
			if (this.items.length >= 1) {
				this.autoHeaders = Object.keys(this.items[0] as Record<string, unknown>).map(key => ({ text: key.toUpperCase(), value: key }));
			}
		}
	},
	watch: {
		items: {
			handler() {
				this.headerFactory();
			},
			deep: true
		}
	}
});
</script>

<style>

</style>