<template>
  <nav>
    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span>Projekt</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="grey">
        <span>Logout</span>
      </v-btn>
      <v-btn x-medium color="warning" fab dark>
              <v-icon>mdi-account</v-icon>
            </v-btn>
    </v-app-bar>
    <v-content>
      <v-container class="fill-height" fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-navigation-drawer v-model="drawer" enable-resize-watcher temporary app class="primary ">
      <v-list>
          <v-list-item-group>
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Dashboard</v-list-item-title>
            </v-list-item-content>   
          </v-list-item>
          <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Checkliste-Bearbeitung</v-list-item-title>
            </v-list-item-content>   
          </v-list-item>
            <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Krisenwerkzeuge</v-list-item-title>
            </v-list-item-content>   
          </v-list-item>
            <v-list-item link>
            <v-list-item-action>
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Account</v-list-item-title>
            </v-list-item-content>   
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script lang="ts">
export default {
  data() {
    return {
      drawer: false,
      items: [
        {title: 'Dashboard', icon: 'mdi-view-dashboard'},
        {title: 'Checklisten-Bearbeitung', icon: 'mdi-view-dashboard'},
        {title: 'Krisenwerkzeuge', icon: 'mdi-help-box'},
        {title: 'Account', icon: 'mdi-view-dashboard'}
      ]
    };
  },
};
</script>


<style>

</style>