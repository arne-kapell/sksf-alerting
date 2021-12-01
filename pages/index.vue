<template>
  <div id="root" >
    <v-app>
      <v-container class="main-page container--fluid">
        <NavBarUp/>
        <v-col class="col-2" id="menu-side">
          <MenuSide/>
        </v-col>
        <v-col class="col-7 offset-1">
          <AlarmListe/>
        </v-col>
      </v-container>
    </v-app>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import MenuSide from "~/components/MenuSide.vue";
export default Vue.extend({
	components: {MenuSide},
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
  background-color: white;
}

.main-page{
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: start;
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
