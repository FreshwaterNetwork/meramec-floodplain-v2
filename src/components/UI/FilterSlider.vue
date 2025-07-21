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
import { markRaw } from 'vue';
import Slider from '@arcgis/core/widgets/Slider';

export default {
  data() {
    return {
      slider: null,
      sliderDisable: null,
    };
  },
  props: ['method', 'option', 'k'],
  emits: ['update-sl'],
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
        draggableSegmentsEnabled: true,
        disabled: false,
        labelFormatFunction: function (value) {
          return Math.round(value);
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
