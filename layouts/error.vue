<template>
	<v-container fluid class="d-flex flex-column justify-center align-center px-5" style="text-align: center; height: 100%;">
		<h1 class="text-h1">
			{{ error.statusCode }}
		</h1>
		<h1 v-if="error.statusCode === 404" class="text-h4">
			Page not found
		</h1>
		<h1 v-else-if="error.statusCode === 401" class="text-h4">
			Access denied
		</h1>
		<h1 v-else class="text-h4">
			Unknown error ({{ error.message }})
		</h1>
		<v-btn v-if="isDashboard" color="accent" class="mt-5" @click="reload">
			Reload
		</v-btn>
		<v-btn v-else to="/" color="accent" class="mt-5">
			Return to Dashboard
		</v-btn>
	</v-container>
</template>

<script>
export default {
	layout: "main",
	props: {
		error: {
			type: Object,
			default: null
		}
	},
	head () {
		const title = "Error " + this.error.statusCode;
		return {
			title
		};
	},
	computed: {
		isDashboard () {
			return this.$route.path === "/";
		}
	},
	methods: {
		reload () {
			this.$router.push({
				path: this.$route.path,
				query: {
					...this.$route.query,
					reload: Date.now()
				}
			});
		}
	}
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
