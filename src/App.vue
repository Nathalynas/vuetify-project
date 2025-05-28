<template>
  <v-app>
    <SidebarDrawer v-if="$route.path !== '/login'" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import SidebarDrawer from './components/SidebarDrawer.vue'
</script>

<style scoped>
</style>
