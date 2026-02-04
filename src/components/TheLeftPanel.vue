<template>
  <div style="padding-bottom: 50px">
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
    <div class="text-weight-medium q-mb-md">
      <div class="text-bold" style="font-size: large">Upload Shapefile</div>
      <div class="q-mt-sm q-ml-sm">
        To upload a shapefile of your area, click the "Upload" button and select
        a
        <strong>zipped</strong> shapefile from the file explorer.
      </div>
      <q-btn
        v-if="!ms.activeShapefile"
        @click="startUpload()"
        label="Upload"
        color="primary"
        class="q-mt-md q-ml-sm"
      ></q-btn>
      <form
        enctype="multipart/form-data"
        method="post"
        id="uploadForm"
        @change="sendUpload"
      >
        <input type="file" name="file" id="inFile" hidden />
      </form>
      <q-btn
        v-if="ms.activeShapefile"
        class="q-mt-md q-ml-sm"
        @click="removeUpload()"
        label="Remove Area"
        color="negative"
      ></q-btn>
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
      </div>
      <div>
        <q-expansion-item
          dense
          label="HUC"
          class="q-mt-md"
          header-class="text-weight-medium bg-grey-3"
          default-opened
          style="border-radius: 15px"
        >
          <div class="q-ml-md q-mt-md" style="display: flex">
            <q-checkbox
              v-model="hucModel"
              dense
              toggle-order="tf"
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              class="self-center"
              @update:model-value="activateHucFilter()"
            ></q-checkbox>
            <q-select
              dense
              outlined
              style="width: 75%"
              class="q-ml-sm"
              :options="ms.hucFilter"
              v-model="ms.hucFilterModel"
              label="HUC Name"
              :disable="ms.hucFilterSelected ? false : true"
              @update:model-value="ms.updateHucFilter(ms.hucFilterModel)"
            ></q-select>
            <IconButton
              v-if="!ms.hucInfo"
              class="q-ml-sm q-mt-sm"
              type="info"
              method="show-info"
              @show-info="ms.hucInfo = true"
            ></IconButton>
            <IconButton
              v-if="ms.hucInfo"
              class="q-ml-sm q-mt-sm"
              type="close"
              method="hide-info"
              @hide-info="ms.hucInfo = false"
            ></IconButton>
          </div>
          <div v-if="ms.hucInfo" class="q-ml-lg q-mt-md">
            <b>Filter by HUC Name</b><br />
            Select a HUC from the dropdown to make a selection (if selected
            watershed is HUC 12s) or add it's boundary to the map (if selected
            watershed is NHD Catchments).
          </div>
        </q-expansion-item>
      </div>
      <FilterOption
        v-if="
          ms.ffModel == 251 &&
          ms.wsModel == '19b4bcc2506-layer-10' &&
          ms.maModel == 'natural'
        "
        objName="h12p1"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 253 &&
          ms.wsModel == '19b4bcc2506-layer-10' &&
          ms.maModel == 'natural'
        "
        objName="h12p2"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 255 &&
          ms.wsModel == '19b4bcc2506-layer-10' &&
          ms.maModel == 'natural'
        "
        objName="h12p3"
      ></FilterOption>

      <FilterOption
        v-if="
          ms.ffModel == 251 &&
          ms.wsModel == '19b4bcc2506-layer-10' &&
          ms.maModel == 'modified'
        "
        objName="h12r1"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 253 &&
          ms.wsModel == '19b4bcc2506-layer-10' &&
          ms.maModel == 'modified'
        "
        objName="h12r2"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 255 &&
          ms.wsModel == '19b4bcc2506-layer-10' &&
          ms.maModel == 'modified'
        "
        objName="h12r3"
      ></FilterOption>

      <FilterOption
        v-if="
          ms.ffModel == 251 &&
          ms.wsModel == '19b4bcc7eec-layer-11' &&
          ms.maModel == 'natural'
        "
        objName="catchp1"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 253 &&
          ms.wsModel == '19b4bcc7eec-layer-11' &&
          ms.maModel == 'natural'
        "
        objName="catchp2"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 255 &&
          ms.wsModel == '19b4bcc7eec-layer-11' &&
          ms.maModel == 'natural'
        "
        objName="catchp3"
      ></FilterOption>

      <FilterOption
        v-if="
          ms.ffModel == 251 &&
          ms.wsModel == '19b4bcc7eec-layer-11' &&
          ms.maModel == 'modified'
        "
        objName="catchr1"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 253 &&
          ms.wsModel == '19b4bcc7eec-layer-11' &&
          ms.maModel == 'modified'
        "
        objName="catchr2"
      ></FilterOption>
      <FilterOption
        v-if="
          ms.ffModel == 255 &&
          ms.wsModel == '19b4bcc7eec-layer-11' &&
          ms.maModel == 'modified'
        "
        objName="catchr3"
      ></FilterOption>
    </div>
    <q-separator class="q-my-md" inset />
    <div>
      <div style="display: flex">
        <div class="text-bold" style="font-size: large">Supporting Layers</div>
        <q-btn
          :icon="ms.suppSlider == false ? 'opacity' : 'close'"
          rounded
          dense
          flat
          text-color="primary"
          size="md"
          style="padding: 1px !important; margin-left: 2px"
          @click="ms.suppSlider = !ms.suppSlider"
        >
          <q-tooltip
            v-if="!ms.suppSlider"
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
            v-if="ms.suppSlider"
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
      </div>
      <div>
        <div style="width: 90%; margin: 0 auto; display: block">
          <div v-if="ms.suppSlider" class="q-my-sm">
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
  <div id="panel-footer">
    <div class="text-center q-mt-sm">
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
</template>

<script setup>
import { watch } from 'vue';
import { useMapStore } from '../store/index';
import FilterOption from './UI/FilterOption.vue';
import IconButton from './UI/IconButton.vue';
import FilterSelect from './UI/FilterSelect.vue';

const ms = useMapStore();
let hucModel = false;

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

function startUpload() {
  // this.userSelection = 'shapefile';
  // ms.activeShapefile = true;
  document.getElementById('inFile').click();
}

function activateHucFilter() {
  ms.hucFilterSelected = !ms.hucFilterSelected;

  if (!ms.hucFilterSelected) {
    ms.hucFilterModel = '';
    ms.graphicsLayer.removeAll();
    ms.rightDrawerOpen = false;
    ms.boundaryGraphic.visible = false;
    let home = document.querySelector('arcgis-home');
    home.go();
  }
}

function sendUpload(event) {
  const fileName = event.target.value.toLowerCase();
  if (fileName.indexOf('.zip') !== -1) {
    ms.activeShapefile = true;
    ms.generateFeatureCollection(fileName);
  } else {
    document.getElementById('upload-status').innerHTML =
      '<p style="color:red">Add shapefile as .zip file</p>';
  }
}

function removeUpload() {
  let home = document.getElementById('home');
  if (home) {
    home.go();
  }
  ms.activeShapefile = false;
  ms.rightDrawerOpen = false;
  ms.clearShapefilePoly();
}

watch(
  () => ms.printMap,
  () => {
    if (ms.printMap == true) {
      ms.getMapPrint();
    }
  },
);

watch(
  () => ms.wsModel,
  () => {
    hucModel = false;
    if (ms.boundaryGraphic.visible) {
      ms.boundaryGraphic.visible = false;
    }
  },
);
</script>

<style scoped>
#panel-footer {
  height: 50px;
  position: absolute;
  display: block;
  bottom: 0px;
  background-color: white;
  width: 95%;
  /* border-top: 1px solid black; */
}
</style>
