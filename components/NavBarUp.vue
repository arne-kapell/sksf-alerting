<template>
  <nav>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon class="grey--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span>Projekt</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="grey">
      <span>Logout</span>
      </v-btn>
      <v-btn color="grey">
        <span>Logout</span>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary app >
      <p>Test</p>
    </v-navigation-drawer>
  </nav>
</template>

<script lang="ts">
export default {
  data() {
    return {
      drawer: false,
    };
  },
};
</script>