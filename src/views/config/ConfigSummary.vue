<template>
  <q-page padding class="col-grow" style="max-width: 800px">
    <q-card flat bordered class="q-pa-md">
      <ConfigForm task="message_summarization" name="Chat Summary Configuration" />
    </q-card>
  </q-page>
</template>

<script setup>
import ConfigForm from '@/components/ConfigForm.vue'
</script>

<style>
@media (max-width: 599px) {
.q-page-container .q-btn {
width: 100%;
margin-top: 16px;
}
}
</style>
