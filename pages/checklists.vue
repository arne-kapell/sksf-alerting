<template>
  <v-row class="ma-0" style="height: 100%">
      <v-col class="col-2 pa-0">
        <MenuSide/>
      </v-col>
      <v-col class="col-10 my-4">
        <check-liste/>
      </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	middleware: "auth",
	layout: "main",
	head() {
		return { title: "Checklists" };
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
