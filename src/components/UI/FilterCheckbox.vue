<template>
  <q-checkbox
    v-model="model"
    :label="label"
    dense
    toggle-order="tf"
    checked-icon="task_alt"
    unchecked-icon="panorama_fish_eye"
    @update:model-value="$emit(method, index)"
  ></q-checkbox>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { defineProps } from 'vue';
import { useMapStore } from '../../store/index';
const ms = useMapStore();

let model = ref(false);
// let model = computed({
//   get: () => ms.checkboxStates.includes(props.k),
//   set: (val) => {
//     if (val && !ms.checkboxStates.includes(props.k)) {
//       ms.checkboxStates.push(props.k);
//     } else if (!val) {
//       ms.checkboxStates = ms.checkboxStates.filter((k) => k !== props.k);
//     }
//   },
// });

const props = defineProps({
  label: String,
  index: Number,
  method: Function,
});
</script>
