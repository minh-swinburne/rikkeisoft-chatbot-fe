<template>
  <!-- 
  General description: 
  This component displays the application logo with different styles for dark and light themes.
  
  Methods:
  - None
  -->
  <q-avatar>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="`0 0 76.72102094272485 76.72102094272485`"
    >
      <g
        :class="$q.dark.isActive ? 'dark' : 'light'"
        transform="matrix(1.0567632850241546,0,0,1.0567632850241546,-9.51086956521739,-9.193840378148545)"
        fill="#c10015"
      >
        <polygon
          xmlns="http://www.w3.org/2000/svg"
          points="71,48.7 71,18.2 54.8,9 38.7,9 63,22.8 63,36.7 63,53.3 "
        ></polygon>
        <polygon
          xmlns="http://www.w3.org/2000/svg"
          points="29,66 54.8,81 54.7,81 55.1,81.3 71.7,71.7 79.7,57.8 55.3,72 29,56.8 "
        ></polygon>
        <polygon
          xmlns="http://www.w3.org/2000/svg"
          points="61.2,57 61.3,57 46.9,65.2 54.8,69.8 81,54.5 81,35.2 73,21.3 73,49.8 "
        ></polygon>
        <polygon
          xmlns="http://www.w3.org/2000/svg"
          points="61,23.9 34.8,8.7 18.2,18.3 10.2,32.3 35,18 47,25 46.8,25 61,33.2 "
        ></polygon>
        <polygon
          xmlns="http://www.w3.org/2000/svg"
          points="35.2,20.3 9,35.6 9,54.8 17,68.7 17,40.2 28.8,33.2 28.8,33.2 43.2,24.9 "
        ></polygon>
        <polygon
          xmlns="http://www.w3.org/2000/svg"
          points="19,41.3 19,71.8 35.2,81 51.4,81 27,67.2 27,53.3 27,36.7 "
        ></polygon>
      </g>
    </svg>
  </q-avatar>
</template>

<script setup>
import { useQuasar } from "quasar";

const $q = useQuasar();
</script>

<style lang="scss" scoped>
.dark {
  fill: $primary;
}

.light {
  fill: white;
}
</style>
