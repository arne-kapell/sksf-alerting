<template>
  <div id="root" >
    <nav-bar-up/>
    <menu-side/>
  </div>
 
</template>

<script lang="ts">
import NavBarUp from '../components/NavBarUp.vue'
import MenuSide from '../components/MenuSide.vue'
export default {
    name: 'App',
    components:  {
      MenuSide,
      NavBarUp
        },
  
     data() {
    return {
    dark: true
    }
    },
    methods: {
        toggleMode () {
        //this.dark = !this.dark
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