<template>
  <nav>
    <v-toolbar color="primary">
      <v-toolbar-title>
        <span>Projekt</span>
      </v-toolbar-title>
      <v-spacer>
        
      </v-spacer>
      <v-btn>
        <span> Logout </span>
      </v-btn>
    </v-toolbar>
<!-- 
    <v-navigation-drawer v-model="drawer" app class="grey">
      <p>Test</p>
    </v-navigation-drawer>   -->
  </nav>
</template>

<script>
  export default {
      name:"NavBarUp",
      data(){
          return{
              drawer: true
          }
      }
  }
</script>