<template>
  <div>
    <div>
      <!-- <div>
        This floodplain prioritization tool is designed to identify critical
        opportunities for floodplain protection and restoration in the lower
        Meramec River basin in Missouri. Use the selector widgets below to
        specify criteria related to water quality, wildlife habitat, and human
        exposure to flood risk. The map on the right will change in response to
        your selections to identify sites meeting these criteria, identifying
        those geographies where floodplain conservation is likely to have the
        greatest positive impact on the health of this river system.
      </div>
      <br /> -->
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
        <div v-show="ms.wsInfo" class="q-ma-sm">
          You may click on a HUC12 or catchment unit on the map to view a pop-up
          box with more information about attributes for that unit.
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
      <div class="text-weight-medium q-my-md">
        Select Management Action
        <IconButton
          v-if="!ms.maInfo"
          type="info"
          method="show-info"
          @show-info="ms.maInfo = true"
        ></IconButton>
        <IconButton
          v-if="ms.maInfo"
          type="close"
          method="hide-info"
          @hide-info="ms.maInfo = false"
        ></IconButton>
        <div v-show="ms.maInfo" class="q-ma-sm">
          If you choose "Natural Land Cover", you are basing analysis on
          floodplains in forest/wetland/grassland. If you choose "Modified Land
          Cover", you are basing analysis on floodplain in agricultural and
          pasture land.
        </div>
        <q-btn-toggle
          class="q-ma-sm"
          v-model="ms.maModel"
          spread
          dense
          no-caps
          toggle-color="primary"
          color="white"
          text-color="black"
          :options="[
            { label: 'Natural Land Cover', value: 'natural' },
            { label: 'Modified Land Cover', value: 'modified' },
          ]"
        />
      </div>
    </div>
    <q-separator class="q-my-md" inset />
    <div>
      <div class="text-bold" style="font-size: large">
        Filter Floodplain Units
      </div>
      <div v-if="ms.selectedFilters.length !== 0" class="text-center q-py-sm">
        <q-btn dense class="q-mx-sm" label="Download and Share" />
        <q-btn dense class="q-mx-sm" label="Reset Filters" />
      </div>
      <!-- <div v-for="filter in ms.filters" :key="filter">
        <q-expansion-item
          header-class="text-weight-medium"
          :label="filter.expLabel"
          dense
        >
          <div
            v-for="option in filter.options"
            :key="option"
            class="fit row wrap justify-evenly q-my-sm"
            style="display: flex; width: 100%"
          >
            <q-checkbox
              v-model="option.model"
              :label="option.label"
              dense
              toggle-order="ft"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              class="self-center"
              style="
                overflow: auto;
                min-width: 45%;
                max-width: 45%;
                padding-left: 5px;
              "
            />
            <div
              v-if="option.type == 'radio'"
              style="overflow: auto; min-width: 45%; max-width: 45%"
              class="self-center"
            >
              <q-radio label="Present"></q-radio>
              <q-radio label="Absent"></q-radio>
            </div>
            <div
              v-if="option.type == 'range'"
              style="min-width: 45%; max-width: 45%"
              class="self-end"
            >
              <q-range
                v-model="ms.testRange"
                :min="0"
                :max="100"
                color="primary"
                label
                :disable="option.model == true ? false : true"
              ></q-range>
            </div>
            <div class="self-center col-1" style="overflow: auto; margin: auto">
              <q-btn
                dense
                flat
                rounded
                icon="info"
                color="primary"
                style="border: none !important"
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
                    width: 300px;
                  "
                  >{{ option.infoText }}</q-tooltip
                ></q-btn
              >
            </div>
          </div>
          <q-separator inset />
        </q-expansion-item>
      </div> -->
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
          ms.mamodel == 'modified'
        "
        objName="h12r1"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 5 &&
          ms.wsModel == '195a55dbf5c-layer-5' &&
          ms.mamodel == 'modified'
        "
        objName="h12r2"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 6 &&
          ms.wsModel == '195a55dbf5c-layer-5' &&
          ms.mamodel == 'modified'
        "
        objName="h12r3"
      ></FilterOption>

      <FilterOption
        v-if="
          ms.ffModel == 4 &&
          ms.wsModel == '195a5a220fb-layer-6' &&
          ms.mamodel == 'natural'
        "
        objName="catchp1"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 5 &&
          ms.wsModel == '195a5a220fb-layer-6' &&
          ms.mamodel == 'natural'
        "
        objName="catchp2"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 6 &&
          ms.wsModel == '195a5a220fb-layer-6' &&
          ms.mamodel == 'natural'
        "
        objName="catchp3"
      ></FilterOption>

      <FilterOption
        v-if="
          ms.ffModel == 4 &&
          ms.wsModel == '195a5a220fb-layer-6' &&
          ms.mamodel == 'modified'
        "
        objName="catchr1"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 5 &&
          ms.wsModel == '195a5a220fb-layer-6' &&
          ms.mamodel == 'modified'
        "
        objName="catchr2"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 6 &&
          ms.wsModel == '195a5a220fb-layer-6' &&
          ms.mamodel == 'modified'
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMapStore } from '../store/index';
import FilterOption from './UI/FilterOption.vue';
import IconButton from './UI/IconButton.vue';

const ms = useMapStore();
</script>
