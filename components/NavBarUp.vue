<template>
  <nav class="d-flex flex-grow-1 align-center">
      <v-toolbar-title class="text--center" >
        <span>{{ title }}</span>
      </v-toolbar-title>
      <v-spacer />
      <v-chip color="green" class="mr-2">
      <v-icon left>mdi-account-circle-outline</v-icon>
        {{ user.mail }}
      </v-chip> 
    <v-btn @click="logout()" color="error" id="NavBarBtn">
        <span>Logout</span>
      </v-btn>
      <!-- <v-avatar color="primary" size="45"> -->
      <!-- {{ user.mail[0]  + "@" + user.mail.split('@')[0][0] }}
    </v-avatar> -->
</nav>  
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	components: {},
	data() {
		return {
			title: "SKS-F",
		};
	},
	methods: {
		async logout(){
			await this.$auth.logout();
			this.$router.push("/login");
		},		
	},
	computed:{
		user() {
			return this.$auth.user;
		},
	},
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

