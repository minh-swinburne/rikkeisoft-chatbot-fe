<template>
  <!-- 
  General description: 
  This component provides a form for configuring the question suggestion task.
  -->
  <q-page padding class="col-grow" style="max-width: 800px">
    <q-card flat bordered class="tw:px-8 tw:py-10">
      <ConfigForm task="question_suggestion" name="Question Suggestion" />
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
