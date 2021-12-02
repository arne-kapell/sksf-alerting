<template>
  <nav class="d-flex flex-grow-1 align-center">
      <v-toolbar-title class="text--center" >
        <span>{{ title }}</span>
      </v-toolbar-title>
      <v-spacer />
    <v-btn @click="logout()" color="accent" id="NavBarBtn">
        <span>Logout</span>
      </v-btn>
     <v-btn text color="warning" fab light id="NavBarBtn">
          <v-icon left > mdi-account </v-icon>
          <span v-for="user in User" :key="user.uid" >mail: {{user.mail}}</span>
          
      </v-btn>
</nav>  
</template>

<script lang="ts">
import { mapGetters, mapActions} from "vuex";
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
    user(): User[]{
      return this.$store.state.user;
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

