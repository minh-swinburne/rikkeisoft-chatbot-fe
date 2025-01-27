<template>
  <q-layout view="hHh Lpr fFf">
    <q-page-container>
      <!-- The component for the current route will be rendered here -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss">
#app {
  font-family: Roboto, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
}

a {
  color: $link-dark !important; /* Choose your desired link color */
}

.text-light-red {
  color: #ffcccc !important;
}
.bg-light-red {
  background-color: #ffcccc !important;
}

.text-dark-red {
  color: #4d1f1f !important;
}
.bg-dark-red {
  background-color: #4d1f1f !important;
}

.text-grey-15 {
  color: #333333 !important;
}
.bg-grey-15 {
  background-color: #333333 !important;
}

.text-grey-16 {
  color: #262626 !important;
}
.bg-grey-16 {
  background-color: #262626 !important;
}
</style>
