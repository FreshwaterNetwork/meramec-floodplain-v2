<template>
  <q-option-group
    v-model="model"
    :options="options"
    dense
    inline
    color="primary"
    class="self-center"
    :disable="model == true ? false : true"
    @update:model-value="$emit(method)"
  ></q-option-group>
</template>

<script>
export default {
  data() {
    return {
      model: 'present',
      options: [
        { label: 'Present', value: 'present' },
        { label: 'Absent', value: 'absent' },
      ],
    };
  },
  props: ['method'],
};
</script>
