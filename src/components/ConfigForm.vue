</template>
  <q-form @submit.prevent="saveConfig(tab)">
    <div class="row items-center justify-between q-mb-md">
      <h5 class="q-my-none">{{ tab }}</h5>

      <q-space />

      <q-btn
        v-if="editing"
        :loading="loading"
        label="Cancel"
        icon="close"
        flat
        @click="toggleEdit()"
      />

      <q-btn
        v-else
        :loading="loading"
        :text-color="$q.dark.isActive ? 'white' : 'black'"
        icon="refresh"
        color="shadow"
        unelevated
        round
        @click="loadConfig(activeTab, true)"
      />

      <q-btn
        :loading="loading"
        :label="editing ? 'Apply' : 'Edit'"
        :icon="editing ? 'check' : 'edit'"
        color="primary"
        class="q-ml-sm"
        unelevated
        @click="toggleEdit(editing)"
      />
    </div>

    <div class="q-mt-md">
      <div class="text-subtitle1 q-mb-sm">System Prompt</div>
      <q-input
        v-model="config.instructions"
        :readonly="!editing"
        type="textarea"
        input-style="padding-top: 6px"
        autogrow
        outlined
      />
    </div>

    <div v-if="config.messageTemplate" class="q-my-lg">
      <div class="text-subtitle1 q-mb-sm q-pt-sm">Message Template</div>
      <q-input
        v-model="config.messageTemplate"
        :readonly="!editing"
        type="textarea"
        input-style="padding-top: 6px"
        autogrow
        outlined
      />
    </div>

    <div class="row items-center q-my-lg q-gutter-y-sm">
      <div class="col-12 col-sm-6 text-subtitle1">Model</div>
      <q-select
        v-model="config.model"
        :options="config.modelOptions"
        :readonly="!editing"
        class="col-grow"
        outlined
      />
    </div>

    <div v-if="config.lengthLimit" class="row items-center q-my-lg q-gutter-y-sm">
      <div class="col-12 col-sm-9 text-subtitle1">Length Limit</div>
      <q-input
        v-model.number="config.lengthLimit"
        :readonly="!editing"
        :input-class="$q.screen.gt.xs ? 'text-right' : ''"
        class="col-grow"
        type="number"
        step="100"
        min="100"
        max="5000"
        outlined
      />
    </div>

    <div class="row items-center q-my-lg q-gutter-y-sm">
      <div class="col-12 col-sm-9 text-subtitle1">Max Tokens</div>
      <q-input
        v-model.number="config.maxTokens"
        :readonly="!editing"
        :input-class="$q.screen.gt.xs ? 'text-right' : ''"
        class="col-grow"
        type="number"
        min="1"
        max="8192"
        outlined
      />
    </div>

    <div class="row items-center q-my-lg q-gutter-y-sm">
      <div class="col-12 col-sm-9 text-subtitle1">Temperature</div>
      <q-input
        v-model.number="config.temperature"
        :readonly="!editing"
        :input-class="$q.screen.gt.xs ? 'text-right' : ''"
        class="col-grow"
        type="number"
        step="0.1"
        min="0"
        max="1"
        outlined
      />
    </div>

    <div class="row items-center q-my-lg q-gutter-y-sm">
      <div class="col text-subtitle1">Stream</div>
      <q-toggle
        v-model="config.stream"
        :disable="!editing"
        color="primary"
        class="col-grow"
      />
    </div>
  </q-form>
<template>
  