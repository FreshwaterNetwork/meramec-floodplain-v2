<template>
  <q-layout view="hHh Lpr lff">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title style="font-weight: 600; color: #eae8f5"
          ><span class="q-mr-sm">Freshwater Network</span>
          <span class="text-weight-light"
            >Lower Meramec Floodplain Tool</span
          ></q-toolbar-title
        >
        <q-btn
          icon="help_outlined"
          @click="ms.showHelp = !ms.showHelp"
          flat
          dense
          round
          color="white"
        />
        <q-btn color="primary" dense unelevated icon="menu">
          <q-menu>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup>
                <q-item-section
                  ><a
                    href="https://www.nature.org/en-us/what-we-do/our-priorities/protect-water-and-land/land-and-water-stories/?intc=nature.tnav.ourwork"
                    target="_blank"
                    >The Nature Conservancy</a
                  ></q-item-section
                >
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section
                  ><a
                    href="https://coastalresilience.org/terms-of-use/"
                    target="_blank"
                    >Legal Disclosure</a
                  ></q-item-section
                >
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-dialog v-if="ms.showHelp" v-model="ms.showHelp">
      <q-card>
        <q-card-section class="q-ma-md">
          <div class="text-h5 text-center q-mb-md text-weight-medium">
            Lower Meramec Floodplain Tool
          </div>
          <div class="q-ma-md">
            <div>
              This floodplain prioritization tool is designed to identify
              critical opportunities for floodplain protection and restoration
              in the lower Meramec River basin in Missouri.
            </div>
            <br />
            <div>
              Use the selector widgets in the left panel to specify criteria
              related to water quality, wildlife habitat, and human exposure to
              flood risk. The map on the right will change in response to your
              selections to identify sites meeting these criteria, identifying
              those geographies where floodplain conservation is likely to have
              the greatest positive impact on the health of this river system.
            </div>
          </div>
          <div class="q-pa-md">
            <q-img
              src="tnc.png"
              height="55px"
              width="200px"
              style="margin: auto; display: block"
            ></q-img>
          </div>
          <q-btn
            label="ENTER"
            color="primary"
            @click="ms.showHelp = !ms.showHelp"
            style="
              width: fit-content;
              display: block;
              margin: auto auto 0px auto;
            "
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-drawer
      show-if-above
      behavior="desktop"
      side="left"
      elevated
      :width="ms.leftPanelWidth"
    >
      <div class="q-ma-sm">
        <TheLeftPanel></TheLeftPanel>
      </div>
    </q-drawer>
    <q-page-container>
      <TheMap></TheMap>
    </q-page-container>
    <q-drawer
      v-model="ms.rightDrawerOpen"
      side="right"
      elevated
      :width="ms.rightPanelWidth"
    >
      <div class="q-ma-sm">
        <TheResults></TheResults>
      </div>
    </q-drawer>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue';
import TheMap from './components/TheMap.vue';
import TheLeftPanel from './components/TheLeftPanel.vue';
import TheResults from './components/TheResults.vue';
import { useMapStore } from './store/index';
import '@arcgis/map-components/components/arcgis-map';
import '@arcgis/map-components/components/arcgis-legend';
import '@arcgis/map-components/components/arcgis-scale-bar';
import '@arcgis/map-components/components/arcgis-zoom';
import '@arcgis/map-components/components/arcgis-expand';
import '@arcgis/map-components/components/arcgis-basemap-toggle';
import '@arcgis/map-components/components/arcgis-home';
import '@arcgis/map-components/components/arcgis-feature';

const ms = useMapStore();
</script>

<style>
a {
  text-decoration: none !important;
  color: black;
}
</style>
