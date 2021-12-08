<template>
  <v-navigation-drawer mobile-breakpoint="">
    <v-divider></v-divider>
      <v-list >
        <v-list-item-group v-model="selectedItem" color="accent">
          <v-list-item
            v-for="(item, i) in dataForUser.filter(item => (item))"
            :key="i"
            :to="item.path"
          >
            <v-list-item-icon class="pa-md-4 mx-lg-auto">
              <v-icon v-text="item.icon" color="info"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text" color="info"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
export default {
	name: "MenuSide",
	data: () => ({
		selectedItem: 1,
		items: [
			{ 
				text: "Dashboard", 
				icon: "mdi-view-dashboard-variant-outline",
				path: "/"
			},
			{
				text: "Checklists",
				icon: "mdi-clipboard-list-outline",
				path: "/checklists"
			},
			{ 
				text: "Users",
				icon: "mdi-account-multiple-plus-outline",
				path: "/account"
			}
		],
    
	}),
	computed: {
		dataForUser() {
			return this.items.map(item => item.text !== "Users" || this.$auth.user.privileged ? item : null);
		}
	}
};
</script>
