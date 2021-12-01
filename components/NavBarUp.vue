<template>
  <nav>
    <v-app-bar  color=primary light app>
      <!-- <v-app-bar-nav-icon class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-toolbar-title class="text--center" >
        <span>Projekt</span>
      </v-toolbar-title>
      <v-spacer> </v-spacer>
    <v-btn @click="logout()" color="accent" id="NavBarBtn">
        <span>Logout</span>
      </v-btn>
     <v-btn color="warning" fab light id="NavBarBtn">
          <v-icon >mdi-account</v-icon>
      </v-btn> 
 
    </v-app-bar> 

 
</nav>  
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	middleware: "auth",
	layout: "main",
	data() {
		return {
			light: true,
		};
	},
	methods: {
    async logout(){
      await this.$auth.logout();
      this.$router.push("/login");
    },		
	}
});
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

