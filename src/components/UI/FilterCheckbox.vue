<template>
  <q-checkbox
    v-model="model"
    :label="label"
    dense
    toggle-order="tf"
    checked-icon="task_alt"
    unchecked-icon="panorama_fish_eye"
    class="self-center"
    style="width: 45%"
    @update:model-value="$emit(method, index)"
  ></q-checkbox>
</template>

<script>
export default {
  data() {
    return {
      model: false,
    };
  },
  props: ['label', 'index', 'method', 'type'],
};
</script>
