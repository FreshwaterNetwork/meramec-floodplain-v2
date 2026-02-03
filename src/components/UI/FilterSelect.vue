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
