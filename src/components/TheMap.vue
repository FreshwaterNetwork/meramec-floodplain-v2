<template>
  <arcgis-map
    id="my-map"
    item-id="9cf129596b3d445591e615a9a195c46f"
    @arcgisViewReadyChange="onReady"
  >
    <arcgis-scale-bar position="bottom-right" unit="dual"></arcgis-scale-bar>
    <arcgis-expand
      close-on-esc
      position="bottom-left"
      mode="floating"
      collapse-tooltip="Hide Legend"
      expand-tooltip="Legend"
    >
      <arcgis-legend legend-style="classic"></arcgis-legend>
    </arcgis-expand>
    <arcgis-basemap-toggle position="top-right"></arcgis-basemap-toggle>
    <arcgis-zoom position="top-left"></arcgis-zoom>
    <arcgis-home position="top-left"></arcgis-home>
  </arcgis-map>
</template>

<script setup>
import { useMapStore } from '../store/index';
import { markRaw, watch } from 'vue';
import Point from '@arcgis/core/geometry/Point.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
import Graphic from '@arcgis/core/Graphic.js';

const ms = useMapStore();

ms.graphicsLayer = markRaw(
  new GraphicsLayer({
    visible: false,
    title: 'Watershed Selection',
    graphics: [ms.selectionGraphic],
    effect: 'brightness(1) drop-shadow(1px, 1px, 1px)',
  })
);

const onReady = (event) => {
  ms.getLayerInfos();

  const webMap = document.querySelector('arcgis-map').view.map;
  const mapView = document.querySelector('arcgis-map').view;
  // let layer;
  let clickPoint;
  mapView.popupEnabled = false;
  webMap.add(ms.graphicsLayer, webMap.layers.length - 1);

  // put click into function and call when ffmodel, wsmodel, or mamodel change
  mapView.on('click', function (response) {
    clickPoint = new Point({
      x: response.mapPoint.longitude,
      y: response.mapPoint.latitude,
    });

    queryClick(clickPoint);
  });

  // METHODS
  function queryClick(geo) {
    let layer = webMap.findLayerById(ms.wsModel);
    const query = layer.createQuery(geo);
    query.geometry = geo;
    query.spatialRelationship = 'intersects';
    let selectionGraphic;

    ms.graphicsLayer.removeAll();
    layer.queryFeatures(query).then(function (result) {
      if (result.features.length > 0) {
        let feature = result.features[0];

        selectionGraphic = new Graphic({
          geometry: feature.geometry,
          symbol: {
            type: 'simple-fill',
            color: [0, 0, 0, 0],
            outline: {
              type: 'simple-line',
              color: [255, 0, 0, 0.6],
              // color: [0, 112, 60, 0.6],
              // color: [73, 169, 66, 0.6],
              width: 2,
              style: 'solid',
            },
          },
          attributes: {
            id: 'selectionGraphic',
          },
        });

        // 1-in-5 natural
        if (ms.ffModel == 4 && ms.maModel == 'natural') {
          ms.clickResults = {
            name: feature.attributes.NAME,
            watershedAcres: feature.attributes.AreaAc.toLocaleString('en-US'),
            floodplainAcres: feature.attributes.Acres_p1,
            nitrogenScale: feature.attributes.TN_p1,
            phosphorusScale: feature.attributes.TP_p1,
            sedimentScale: feature.attributes.Sed_p1,
            endageredSpecies: feature.attributes.HPFedEnd,
            currentPop: feature.attributes.popnow_p1,
            peopleFloodplain: feature.attributes.pop5,
            futurePop: feature.attributes.pop2050_p1,
            floodDamage: feature.attributes.Dam2050_p1,
            vulnerabilityIndex: feature.attributes.SOVI,
          };
        }
        // 1-in-5 modified
        if (ms.ffModel == 4 && ms.maModel == 'modified') {
          ms.clickResults = {
            name: feature.attributes.NAME,
            watershedAcres: feature.attributes.AreaAc.toLocaleString('en-US'),
            floodplainAcres: feature.attributes.Acres_r1,
            nitrogenScale: feature.attributes.TN_r1,
            phosphorusScale: feature.attributes.TP_r1,
            sedimentScale: feature.attributes.Sed_r1,
            endageredSpecies: feature.attributes.HPFedEnd,
            currentPop: feature.attributes.popnow_r1,
            peopleFloodplain: feature.attributes.pop5,
            futurePop: feature.attributes.pop2050_r1,
            floodDamage: feature.attributes.Dam2050_r1,
            vulnerabilityIndex: feature.attributes.SOVI,
          };
        }

        // 1-in-100 natural
        if (ms.ffModel == 5 && ms.maModel == 'natural') {
          ms.clickResults = {
            name: feature.attributes.NAME,
            watershedAcres: feature.attributes.AreaAc.toLocaleString('en-US'),
            floodplainAcres: feature.attributes.Acres_p2,
            nitrogenScale: feature.attributes.TN_p2,
            phosphorusScale: feature.attributes.TP_p2,
            sedimentScale: feature.attributes.Sed_p2,
            endageredSpecies: feature.attributes.HPFedEnd,
            currentPop: feature.attributes.popnow_p2,
            peopleFloodplain: feature.attributes.pop100,
            futurePop: feature.attributes.pop2050_p2,
            floodDamage: feature.attributes.Dam2050_p2,
            vulnerabilityIndex: feature.attributes.SOVI,
          };
        }
        // 1-in-100 modeified
        if (ms.ffModel == 5 && ms.maModel == 'modified') {
          ms.clickResults = {
            name: feature.attributes.NAME,
            watershedAcres: feature.attributes.AreaAc.toLocaleString('en-US'),
            floodplainAcres: feature.attributes.Acres_r2,
            nitrogenScale: feature.attributes.TN_r2,
            phosphorusScale: feature.attributes.TP_r2,
            sedimentScale: feature.attributes.Sed_r2,
            endageredSpecies: feature.attributes.HPFedEnd,
            currentPop: feature.attributes.popnow_r2,
            peopleFloodplain: feature.attributes.pop100,
            futurePop: feature.attributes.pop2050_r2,
            floodDamage: feature.attributes.Dam2050_r2,
            vulnerabilityIndex: feature.attributes.SOVI,
          };
        }

        // 1-in-500 natural
        if (ms.ffModel == 6 && ms.maModel == 'natural') {
          ms.clickResults = {
            name: feature.attributes.NAME,
            watershedAcres: feature.attributes.AreaAc.toLocaleString('en-US'),
            floodplainAcres: feature.attributes.Acres_p3,
            nitrogenScale: feature.attributes.TN_p3,
            phosphorusScale: feature.attributes.TP_p3,
            sedimentScale: feature.attributes.Sed_p3,
            endageredSpecies: feature.attributes.HPFedEnd,
            currentPop: feature.attributes.popnow_p3,
            peopleFloodplain: feature.attributes.pop500,
            futurePop: feature.attributes.pop2050_p3,
            floodDamage: feature.attributes.Dam2050_p3,
            vulnerabilityIndex: feature.attributes.SOVI,
          };
        }
        // 1-in-500 modified
        if (ms.ffModel == 6 && ms.maModel == 'modified') {
          ms.clickResults = {
            name: feature.attributes.NAME,
            watershedAcres: feature.attributes.AreaAc.toLocaleString('en-US'),
            floodplainAcres: feature.attributes.Acres_r3,
            nitrogenScale: feature.attributes.TN_r3,
            phosphorusScale: feature.attributes.TP_r3,
            sedimentScale: feature.attributes.Sed_r3,
            endageredSpecies: feature.attributes.HPFedEnd,
            currentPop: feature.attributes.popnow_r3,
            peopleFloodplain: feature.attributes.pop500,
            futurePop: feature.attributes.pop2050_r3,
            floodDamage: feature.attributes.Dam2050_r3,
            vulnerabilityIndex: feature.attributes.SOVI,
          };
        }

        ms.graphicsLayer.add(selectionGraphic);
        ms.graphicsLayer.visible = true;
        ms.rightDrawerOpen = true;
        mapView.goTo(selectionGraphic);
      } else {
        ms.rightDrawerOpen = false;
      }
    });
  }

  // WATCHERS
  watch(
    () => ms.rightDrawerOpen,
    () => {
      if (ms.rightDrawerOpen == false) {
        ms.graphicsLayer.removeAll();
        ms.clickResults = {};
        mapView.goTo({ center: [-90.670929, 38.457343], zoom: 10 });
      }
    }
  );
  watch(
    () => ms.maModel,
    () => {
      if (ms.rightDrawerOpen == true) {
        queryClick(clickPoint);
      }
    }
  );
  watch(
    () => ms.ffModel,
    () => {
      if (ms.rightDrawerOpen == true) {
        queryClick(clickPoint);
      }
    }
  );
  watch(
    () => ms.wsModel,
    () => {
      if (ms.rightDrawerOpen == true) {
        queryClick(clickPoint);
      }
    }
  );
};
</script>

<style scoped>
.esri-feature {
  letter-spacing: 0em;
  line-height: 1.55rem;
  font-feature-settings: 'liga' 1, 'calt' 0;
  background: #fff;
  padding: 1em;
  width: fit-content;
}
</style>
