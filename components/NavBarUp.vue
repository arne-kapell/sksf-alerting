<template>
  <nav>
    <v-app-bar  color="warning" dark app>     
      <v-toolbar-title class="text--center ">
        <span>Projekt</span>
      </v-toolbar-title>
      <v-spacer> </v-spacer>
 <v-btn @click="logout()">Logout</v-btn>    
     <v-btn color="warning" fab dark>
              <v-icon>mdi-account</v-icon>
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
			dark: true,
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
