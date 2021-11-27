<template>
  <div id="root" >
    <nav-bar-up>
    </nav-bar-up>
  </div>
</template>

<script lang="ts">


export default {
  data () {
    return {
      dark: true
    }
  },
  methods: {
    toggleMode () {
      this.dark = !this.dark
    }
  }
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
