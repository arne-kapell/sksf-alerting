<template>
  <div id="root" >
    <HomePage />
      <CheckListe/>
  </div>
</template>

<script lang="ts">


import CheckListe from "./components/CheckListe.vue";
export default {
  components: {CheckListe},
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

}
</style>
