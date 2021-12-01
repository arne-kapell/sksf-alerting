<template>
  <nav>
    <v-app-bar  color=primary light app>
      <!-- <v-app-bar-nav-icon class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-toolbar-title class="text--center" >
        <span>Projekt</span>
      </v-toolbar-title>
      <v-spacer> </v-spacer>
    <v-btn color="accent" to="/login" padding="3px" id="NavBarBtn">
        <span>Logout</span>
      </v-btn>
     <v-btn color="warning" fab light id="NavBarBtn">
          <v-icon >mdi-account</v-icon>
      </v-btn> 
    </v-app-bar> 
<!-- 
    <v-navigation-drawer v-model="drawer" fixed app color="orange darker-2" dark>
      <v-list>
          <v-list-item-group>
          <v-list-item to="">
            <v-list-item-action >
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>   
          </v-list-item>
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-view-list</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Checkliste-Bearbeitung</v-list-item-title>
            </v-list-item-content>   
          </v-list-item>
            <v-list-item to="">
            <v-list-item-action>
              <v-icon>mdi-wrench</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Krisenwerkzeuge</v-list-item-title>
            </v-list-item-content>   
          </v-list-item>
            <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-account-details</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Account</v-list-item-title>
            </v-list-item-content>   
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
-->
</nav>  
</template>

<script lang="ts">
  export default {
      name:"NavBarUp",
      data(){
          return{
              drawer: true
          }
      }
  }
</script>
<style>
  #NavBarBtn{
    margin-left: 20px;
    margin-right: 20px;
  }
  #accIcon{
    width: 5px ;
  }
  .v-toolbar-title{
    font-weight: 400;
    font-size:  3rem;
    color: 'accent';
  }
</style>
