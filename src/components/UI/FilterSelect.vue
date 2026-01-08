<template>
  <div style="display: flex">
    <q-checkbox
      v-model="model"
      :label="label"
      dense
      toggle-order="tf"
      checked-icon="task_alt"
      unchecked-icon="panorama_fish_eye"
      class="self-center"
      @update:model-value="$emit(method, model)"
    ></q-checkbox>
    <!-- <IconButton
      v-if="!modelInfo"
      type="info"
      method="show-info"
      @show-info="modelInfo = true"
    ></IconButton>
    <IconButton
      v-if="modelInfo"
      type="close"
      method="hide-info"
      @hide-info="modelInfo = false"
    ></IconButton>
    <div v-if="modelInfo">
      {{ k.info }}
    </div> -->
    <!-- <q-btn
      v-if="!showInfo"
      dense
      flat
      rounded
      color="primary"
      style="border: none !important"
      icon="info"
      @click="showInfo = true"
    ></q-btn>
    <q-btn
      v-if="showInfo"
      dense
      flat
      rounded
      color="primary"
      style="border: none !important"
      icon="info"
      @click="showInfo = false"
    ></q-btn>
    <div>
      <q-tooltip
        v-model="showInfo"
        persistent
        anchor="center end"
        self="center left"
        style="
          background-color: white;
          color: black;
          border: 1px solid black;
          border-radius: 3px;
          font-size: medium;
          width: 350px;
        "
        ><div v-html="k.info"></div
      ></q-tooltip>
    </div> -->
  </div>
</template>

<script>
import { ref } from 'vue';
import IconButton from './IconButton.vue';

export default {
  data() {
    return {
      model: false,
      modelInfo: false,
    };
  },
  props: ['label', 'index', 'method', 'type', 'k'],
  components: {
    IconButton,
  },
};
</script>
