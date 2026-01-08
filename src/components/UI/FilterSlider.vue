<template>
  <div
    :class="'sliderDiv-' + this.option.field"
    :id="'sliderDiv-' + this.option.field"
    :ref="'sliderDiv-' + this.option.field"
    v-show="this.option.checkboxModel.value == true"
  ></div>
  <div
    :class="'sliderDisable-' + this.option.field"
    :id="'sliderDisable-' + this.option.field"
    :ref="'sliderDisable-' + this.option.field"
    v-show="this.option.checkboxModel.value == false"
  ></div>
</template>

<script>
import { markRaw, watch } from 'vue';
import Slider from '@arcgis/core/widgets/Slider';
import { useMapStore } from '../../store';

export default {
  data() {
    return {
      slider: null,
      sliderDisable: null,
    };
  },
  props: ['method', 'option', 'k'],
  emits: ['update-sl'],
  computed: {
    compKey: {
      get() {
        const ms = useMapStore();
        return ms.componentKey;
      },
      set(value) {
        const ms = useMapStore();
        ms.componentKey = value;
      },
    },
  },
  watch: {
    compKey() {
      this.option.checkboxModel.value = false;
      this.slider.values = [this.slider.min, this.slider.max];
    },
  },
  mounted() {
    this.slider = markRaw(
      new Slider({
        container: this.$refs['sliderDiv-' + this.option.field],
        id: this.option.field,
        min: this.k.min,
        max: this.k.max,
        values: [this.k.min, this.k.max],
        visibleElements: {
          labels: true,
          rangeLabels: false,
        },
        steps: 0.1,
        draggableSegmentsEnabled: true,
        disabled: false,
        labelFormatFunction: function (value) {
          return value.toFixed(1);
        },
      })
    );
    this.sliderDisable = markRaw(
      new Slider({
        container: this.$refs['sliderDisable-' + this.option.field],
        min: 0,
        max: 100,
        values: [0, 100],
        visibleElements: {
          labels: false,
          rangeLabels: false,
        },
        disabled: true,
      })
    );
    this.slider.on('thumb-drag', (event) => {
      let val = this.slider.values;
      this.$emit('update-sl', this.option, val);
    });
  },
};
</script>

<style>
.esri-slider__thumb {
  background-color: green !important;
  border: solid 1px green;
}
</style>
