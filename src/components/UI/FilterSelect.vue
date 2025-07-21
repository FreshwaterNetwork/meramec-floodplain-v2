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
    <q-btn
      dense
      flat
      rounded
      color="primary"
      style="border: none !important"
      icon="info"
    >
      <q-tooltip
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
        ><div v-html="k.info"></div></q-tooltip
    ></q-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: false,
    };
  },
  props: ['label', 'index', 'method', 'type', 'k'],
};
</script>
