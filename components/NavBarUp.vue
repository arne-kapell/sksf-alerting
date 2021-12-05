<template>
  <nav class="d-flex flex-grow-1 align-center">
    <v-toolbar-title class="text--center text-h3">
      <span>{{ title }}</span>
    </v-toolbar-title>
    <v-spacer />
    <v-badge dot overlap bordered :color="socketStatus ? 'success' : 'warning' " class="mr-2">
      <v-chip color="green">
        <v-icon left>mdi-account-circle-outline</v-icon>
        {{ (user.name) || user.mail }}
      </v-chip> 
    </v-badge>
    <v-btn @click="logout()" color="error" id="NavBarBtn">
      <span>Logout</span>
    </v-btn>
  </nav>  
</template>

<script lang="ts">
import { Auth } from "@nuxtjs/auth-next";
import Vue from "vue";
export default Vue.extend({
	props: {
		socketStatus: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			title: "SKS-F",
		};
	},
	methods: {
		async logout(){
			await this.$auth.logout();
		},		
	},
	computed:{
		user() {
			return (this.$auth as Auth).user;
		}
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

