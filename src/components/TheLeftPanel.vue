<template>
  <div>
    <div>
      <div class="text-bold" style="font-size: large">
        Identify Floodplain Units
      </div>
      <div class="text-weight-medium q-mb-md q-mt-xs">
        Select Flood Frequency
        <IconButton
          v-if="!ms.ffInfo"
          type="info"
          method="show-info"
          @show-info="ms.ffInfo = true"
        ></IconButton>
        <IconButton
          v-if="ms.ffInfo"
          type="close"
          method="hide-info"
          @hide-info="ms.ffInfo = false"
        ></IconButton>
        <div v-show="ms.ffInfo" class="q-ma-sm">
          In any given year, there is a 20% chance of a 1-in-5-year (or greater)
          flood, a 1% chance of a 1-in-100-year (or greater) flood, and a 0.2%
          chance of a 1-in-500-year (or greater) flood.
          <q-btn dense outline class="text-caption"
            ><a
              href="https://www.usgs.gov/special-topics/water-science-school/science/floods-and-recurrence-intervals?qt-science_center_objects=0#qt-science_center_objects"
              target="_blank"
              >More Info</a
            ></q-btn
          >
        </div>
        <q-btn-toggle
          class="q-ma-sm"
          v-model="ms.ffModel"
          spread
          dense
          no-caps
          toggle-color="primary"
          color="white"
          text-color="black"
          :options="ms.floodFrequency"
          @update:model-value="ms.updateLayerVisibility('ff', ms.ffModel)"
        />
      </div>
      <div class="text-weight-medium q-my-md">
        View Floodplains by Watershed
        <IconButton
          v-if="!ms.wsInfo"
          type="info"
          method="show-info"
          @show-info="ms.wsInfo = true"
        ></IconButton>
        <IconButton
          v-if="ms.wsInfo"
          type="close"
          method="hide-info"
          @hide-info="ms.wsInfo = false"
        ></IconButton>
        <q-btn
          :icon="ms.opacSlider == false ? 'opacity' : 'close'"
          rounded
          dense
          flat
          text-color="primary"
          size="md"
          style="padding: 1px !important; margin-left: 2px"
          @click="ms.opacSlider = !ms.opacSlider"
        >
          <q-tooltip
            v-if="!ms.opacSlider"
            anchor="center right"
            self="center left"
            class="shadow-2"
            style="
              color: green;
              background-color: white;
              border: 1px solid grey;
            "
            >Transparency</q-tooltip
          >
          <q-tooltip
            v-if="ms.opacSlider"
            anchor="center right"
            self="center left"
            class="shadow-2"
            style="
              color: green;
              background-color: white;
              border: 1px solid grey;
            "
            >Hide Transparency</q-tooltip
          >
        </q-btn>
        <div v-show="ms.wsInfo" class="q-ma-sm">
          You may click on a HUC12 or catchment unit on the map to view a pop-up
          box with more information about attributes for that unit.
        </div>
        <div
          style="width: 90%; margin: 0 auto; display: block"
          v-if="ms.opacSlider"
        >
          Transparency:
          <q-slider
            class="q-mb-lg"
            v-model="ms.sliderModel"
            :min="0"
            :max="100"
            label-always
            switch-label-side
            label-color="transparent"
            label-text-color="black"
            :label-value="ms.sliderModel + '%'"
          ></q-slider>
        </div>
        <q-btn-toggle
          class="q-ma-sm"
          v-model="ms.wsModel"
          spread
          dense
          no-caps
          toggle-color="primary"
          color="white"
          text-color="black"
          :options="ms.watershedType"
          @update:model-value="ms.updateLayerVisibility('ws', ms.wsModel)"
        />
      </div>
    </div>
    <q-separator class="q-my-md" inset />
    <div>
      <div
        class="q-my-sm"
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div class="text-bold" style="font-size: large">
          Filter Floodplain Units
        </div>
        <div v-if="ms.rightDrawerOpen" class="text-center q-mb-sm">
          <q-btn
            dense
            color="primary"
            class="q-mr-sm"
            label="Save Map"
            @click="ms.printMap = true"
          />
          <q-btn
            dense
            color="primary"
            class="q-ml-sm"
            label="Reset Filters"
            @click="resetFilters()"
          />
        </div>
      </div>
      <FilterOption
        v-if="
          ms.ffModel == 4 &&
          ms.wsModel == '195a55dbf5c-layer-5' &&
          ms.maModel == 'natural'
        "
        objName="h12p1"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 5 &&
          ms.wsModel == '195a55dbf5c-layer-5' &&
          ms.maModel == 'natural'
        "
        objName="h12p2"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 6 &&
          ms.wsModel == '195a55dbf5c-layer-5' &&
          ms.maModel == 'natural'
        "
        objName="h12p3"
      ></FilterOption>

      <FilterOption
        v-if="
          ms.ffModel == 4 &&
          ms.wsModel == '195a55dbf5c-layer-5' &&
          ms.maModel == 'modified'
        "
        objName="h12r1"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 5 &&
          ms.wsModel == '195a55dbf5c-layer-5' &&
          ms.maModel == 'modified'
        "
        objName="h12r2"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 6 &&
          ms.wsModel == '195a55dbf5c-layer-5' &&
          ms.maModel == 'modified'
        "
        objName="h12r3"
      ></FilterOption>

      <FilterOption
        v-if="
          ms.ffModel == 4 &&
          ms.wsModel == '195a5a220fb-layer-6' &&
          ms.maModel == 'natural'
        "
        objName="catchp1"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 5 &&
          ms.wsModel == '195a5a220fb-layer-6' &&
          ms.maModel == 'natural'
        "
        objName="catchp2"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 6 &&
          ms.wsModel == '195a5a220fb-layer-6' &&
          ms.maModel == 'natural'
        "
        objName="catchp3"
      ></FilterOption>

      <FilterOption
        v-if="
          ms.ffModel == 4 &&
          ms.wsModel == '195a5a220fb-layer-6' &&
          ms.maModel == 'modified'
        "
        objName="catchr1"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 5 &&
          ms.wsModel == '195a5a220fb-layer-6' &&
          ms.maModel == 'modified'
        "
        objName="catchr2"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 6 &&
          ms.wsModel == '195a5a220fb-layer-6' &&
          ms.maModel == 'modified'
        "
        objName="catchr3"
      ></FilterOption>
    </div>
    <q-separator class="q-my-md" inset />
    <div>
      <div class="text-bold" style="font-size: large">Supporting Layers</div>
      <div v-for="layer in ms.supportingLayers" :key="layer" class="q-my-xs">
        <q-checkbox
          dense
          toggle-order="ft"
          :label="layer.label"
          v-model="layer.model"
          :checked-icon="layer.checkedIcon"
          :unchecked-icon="layer.uncheckedIcon"
          @click="ms.updateLayerVisibility('', layer.value)"
        ></q-checkbox>
        <div
          style="width: 90%; margin: 0 auto; display: block"
          v-if="layer.label == 'National Wetlands Inventory'"
        >
          <div v-if="layer.model" class="q-my-sm">
            Transparency:
            <q-slider
              class="q-mb-md"
              v-model="ms.suppModel"
              :min="0"
              :max="100"
              label-always
              switch-label-side
              label-color="transparent"
              label-text-color="black"
              :label-value="ms.suppModel + '%'"
            ></q-slider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { useMapStore } from '../store/index';
import FilterOption from './UI/FilterOption.vue';
import IconButton from './UI/IconButton.vue';

const ms = useMapStore();

function resetFilters() {
  ms.selectedFilters = [];
  ms.activeFilters = [];
  ms.pdfFilters = [];
  ms.pdfSuppLayers = [];
  ms.rightDrawerOpen = false;

  let webMap = document.querySelector('arcgis-map').view.map;
  let layer = webMap.findLayerById(ms.wsModel);
  layer.definitionExpression = '';

  ms.componentKey += 1;
}

watch(
  () => ms.printMap,
  () => {
    if (ms.printMap == true) {
      ms.getMapPrint();
    }
  }
);
</script>
