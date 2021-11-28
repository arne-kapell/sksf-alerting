<template>
  <v-app id="root" >
    <HomePage />
      <AlarmListe/>
  </v-app>
</template>

<script lang="ts">

import NavBar from "./components/NavBar.vue";
import AlarmListe from "./components/AlarmListe.vue";
export default {
  components: {AlarmListe},
}
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
  background-color: #f4f7fc;
}
</style>
