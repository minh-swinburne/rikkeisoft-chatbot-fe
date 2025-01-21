<template>
  <q-layout view="hHh Lpr fFf">
    <q-page-container>
      <!-- The component for the current route will be rendered here -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap';


export default {
  name: 'App',
};

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
}
</style>
