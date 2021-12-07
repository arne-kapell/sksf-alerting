<template>
      <!-- <v-container fluid class="full-height"> -->
        <v-row class="ma-0" style="height: 100%">
          <v-col class="col-2 pa-0" style="height: 100%">
            <menu-side/>
          </v-col>
          <v-col class="col-10 my-4">
            <alarm-liste/>
          </v-col>
        </v-row>
      <!-- </v-container> -->
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
	middleware: "auth",
	layout: "main",
	head() {
		return {
			title: "Dashboard",
		};
	},
	data() {
		return {
			light: true,
			interval: null as NodeJS.Timer
		};
	},
	mounted() {
		this.interval = setInterval(() => {
			this.$store.dispatch("getAlarms");
		}, 10000);
	},
	beforeDestroy() {
		clearInterval(this.interval);
	}
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

.main-page{
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: flex-start;
}
#menu-side {
  padding: 0;
  gap: 0;
}
</style>
