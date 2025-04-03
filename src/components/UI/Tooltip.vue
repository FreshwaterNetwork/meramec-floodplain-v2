<template>
  <q-tooltip
    class="bg-white text-primary text-h7 shadow-4"
    style="border: 1pt solid #ccc"
    anchor="center right"
    self="center left"
    :offset="[10, 10]"
    >{{ text }}</q-tooltip
  >
</template>
<script>
export default {
  props: ['text'],
};
</script>
