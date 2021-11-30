
<template>
  <div id="root" >
    <nav-bar-up/>
    <menu-side/>
  </div>
 
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	layout: "main",
	data() {
		return {
			dark: true
		};
	}
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
#root {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow-y: scroll;
}
</style>