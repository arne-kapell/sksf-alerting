<template>
  <v-app id="root" >
    <HomePage />
      <AlarmListe/>
      <CheckListe/>
  </v-app>
</template>

<script lang="ts">


import CheckListe from "./components/CheckListe.vue";
import AlarmListe from "./components/AlarmListe.vue";
export default {
  components: {
    AlarmListe,
    CheckListe
    },
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
