<template>
      <v-container fluid class="main-page">
        <v-col class="col-2 pa-0">
          <menu-side/>
        </v-col>
        <v-col class="col-7 offset-1">
          <alarm-liste/>
        </v-col>
      </v-container>
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
			light: true
		};
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
.col-6 {
  max-width: 100%;
  flex: 100%;
}
</style>
