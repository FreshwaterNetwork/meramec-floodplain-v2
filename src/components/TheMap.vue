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
  <!-- <div id="opacitySlider"></div> -->
</template>

<script setup>
import { useMapStore } from '../store/index';
import { markRaw, watch, computed } from 'vue';
import { useQuasar } from 'quasar';
import Point from '@arcgis/core/geometry/Point.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer.js';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer.js';
import Graphic from '@arcgis/core/Graphic.js';
import * as unionOperator from '@arcgis/core/geometry/operators/unionOperator.js';
import * as clipOperator from '@arcgis/core/geometry/operators/clipOperator.js';

const ms = useMapStore();
const $q = useQuasar();
let smallScreen = computed(() => $q.screen.lt.sm);

//
// REMOVE WHEN NEW FLOOD FREQUENCY LAYERS ARE READY AND ADD FUNCTIONALITY FOR NEW WATERSHED LAYERS
//

let fullHuc = new FeatureLayer({
  url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/meramac_122325/FeatureServer/0',
});
let fullCatch = new FeatureLayer({
  url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/ArcGIS/rest/services/meramac_122325/FeatureServer/1',
});

//

ms.graphicsLayer = markRaw(
  new GraphicsLayer({
    visible: false,
    title: 'Watershed Selection',
    graphics: [ms.selectionGraphic],
    effect: 'brightness(1) drop-shadow(1px, 1px, 1px)',
  })
);

function formatValue(val) {
  // val = val.toFixed(2);
  val = parseFloat(val).toLocaleString('en-US');

  return val;
}

const onReady = (event) => {
  ms.getLayerInfos();

  const webMap = document.querySelector('arcgis-map').view.map;
  const mapView = document.querySelector('arcgis-map').view;
  let l = webMap.findLayerById(ms.wsModel);
  let clickPoint;
  mapView.popupEnabled = false;
  webMap.add(ms.graphicsLayer, webMap.layers.length - 1);
  let selectionGraphic;
  let suppLayGraphic;

  // put click into function and call when ffmodel, wsmodel, or mamodel change
  mapView.on('click', function (event) {
    let layer;
    let query;
    ms.graphicsLayer.remove(selectionGraphic);
    ms.selectionMade = true;

    let newLayer;

    if (ms.wsModelText == 'HUC 12s') {
      newLayer = fullHuc;
    } else if (ms.wsModelText == 'NHD Catchments') {
      newLayer = fullCatch;
    }
    console.log(event);

    let point = new Point({
      x: event.mapPoint.longitude,
      y: event.mapPoint.latitude,
    });

    let newQuery = newLayer.createQuery(point);
    newQuery.geometry = point;
    newQuery.spatialRelationship = 'intersects';

    console.log(ms.ffModel);

    newLayer.queryFeatures(newQuery).then(function (result) {
      console.log(result);
      if (ms.ffModel == 4) {
        //20%
        ms.clickResults = {
          name: result.features[0].attributes.name,
          watershedAcres: formatValue(result.features[0].attributes.areaacres),
          floodplainAcres: formatValue(
            result.features[0].attributes.fpacres_unp_1
          ),
          nitrogenScale: formatValue(result.features[0].attributes.iy_tn_perc),
          phosphorusScale: formatValue(
            result.features[0].attributes.iy_tp_perc
          ),
          sedimentScale: formatValue(result.features[0].attributes.iy_ss_perc),
          endageredSpecies: formatValue(
            result.features[0].attributes.fedendspecies
          ),
          currentPop: formatValue(result.features[0].attributes.popnow_1),
          peopleFloodplain: formatValue(result.features[0].attributes.popnow_1),
          futurePop: formatValue(result.features[0].attributes.pop2050_1),
          floodDamage: formatValue(result.features[0].attributes.damages_1),
          vulnerabilityIndex: formatValue(result.features[0].attributes.SOVI_1),
        };
      } else if (ms.ffModel == 5) {
        // 1%
        ms.clickResults = {
          name: result.features[0].attributes.name,
          watershedAcres: formatValue(result.features[0].attributes.areaacres),
          floodplainAcres: formatValue(
            result.features[0].attributes.fpacres_unp_2
          ),
          nitrogenScale: formatValue(result.features[0].attributes.iy_tn_perc),
          phosphorusScale: formatValue(
            result.features[0].attributes.iy_tp_perc
          ),
          sedimentScale: formatValue(result.features[0].attributes.iy_ss_perc),
          endageredSpecies: formatValue(
            result.features[0].attributes.fedendspecies
          ),
          currentPop: formatValue(result.features[0].attributes.popnow_2),
          peopleFloodplain: formatValue(result.features[0].attributes.pop5),
          futurePop: formatValue(result.features[0].attributes.pop2050_2),
          floodDamage: formatValue(result.features[0].attributes.damages_2),
          vulnerabilityIndex: formatValue(result.features[0].attributes.SOVI_2),
        };
      } else if (ms.ffModel == 6) {
        // 0.2% 1/500
        ms.clickResults = {
          name: result.features[0].attributes.name,
          watershedAcres: formatValue(result.features[0].attributes.areaacres),
          floodplainAcres: formatValue(
            result.features[0].attributes.fpacres_unp_3
          ),
          nitrogenScale: formatValue(result.features[0].attributes.iy_tn_perc),
          phosphorusScale: formatValue(
            result.features[0].attributes.iy_tp_perc
          ),
          sedimentScale: formatValue(result.features[0].attributes.iy_ss_perc),
          endageredSpecies: formatValue(
            result.features[0].attributes.fedendspecies
          ),
          currentPop: formatValue(result.features[0].attributes.popnow_3),
          peopleFloodplain: formatValue(result.features[0].attributes.pop5),
          futurePop: formatValue(result.features[0].attributes.pop2050_3),
          floodDamage: formatValue(result.features[0].attributes.damages_3),
          vulnerabilityIndex: formatValue(result.features[0].attributes.SOVI_3),
        };
      }
    });

    mapView.hitTest(event).then(function (response) {
      if (response.results) {
        // response.results.forEach((l) => {
        if (
          response.results[0].layer.title == 'HUC 12s' ||
          response.results[0].layer.title == 'NHD Catchments'
        ) {
          ms.clickType = 'watershed';
          layer = webMap.findLayerById(ms.wsModel);
          query = layer.createQuery();
          query.geometry = response.results[0].mapPoint;
          query.spatialRelationship = 'intersects';

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
                    width: 2,
                    style: 'solid',
                  },
                },
                attributes: {
                  id: 'selectionGraphic',
                },
              });

              // // 1-in-5 natural
              // if (ms.ffModel == 4 && ms.maModel == 'natural') {
              //   ms.clickResults = {
              //     name: feature.attributes.NAME,
              //     watershedAcres: formatValue(feature.attributes.AreaAc),
              //     floodplainAcres: formatValue(feature.attributes.Acres_p1),
              //     nitrogenScale: formatValue(feature.attributes.TN_p1),
              //     phosphorusScale: formatValue(feature.attributes.TP_p1),
              //     sedimentScale: formatValue(feature.attributes.Sed_p1),
              //     endageredSpecies: formatValue(feature.attributes.HPFedEnd),
              //     currentPop: formatValue(feature.attributes.popnow_p1),
              //     peopleFloodplain: formatValue(feature.attributes.pop5),
              //     futurePop: formatValue(feature.attributes.pop2050_p1),
              //     floodDamage: formatValue(feature.attributes.Dam2050_p1),
              //     vulnerabilityIndex: formatValue(feature.attributes.SOVI),
              //   };
              // }
              // // 1-in-5 modified
              // if (ms.ffModel == 4 && ms.maModel == 'modified') {
              //   ms.clickResults = {
              //     name: formatValue(feature.attributes.NAME),
              //     watershedAcres: formatValue(feature.attributes.AreaAc),
              //     floodplainAcres: formatValue(feature.attributes.Acres_r1),
              //     nitrogenScale: formatValue(feature.attributes.TN_r1),
              //     phosphorusScale: formatValue(feature.attributes.TP_r1),
              //     sedimentScale: formatValue(feature.attributes.Sed_r1),
              //     endageredSpecies: formatValue(feature.attributes.HPFedEnd),
              //     currentPop: formatValue(feature.attributes.popnow_r1),
              //     peopleFloodplain: formatValue(feature.attributes.pop5),
              //     futurePop: formatValue(feature.attributes.pop2050_r1),
              //     floodDamage: formatValue(feature.attributes.Dam2050_r1),
              //     vulnerabilityIndex: formatValue(feature.attributes.SOVI),
              //   };
              // }

              // // 1-in-100 natural
              // if (ms.ffModel == 5 && ms.maModel == 'natural') {
              //   ms.clickResults = {
              //     name: formatValue(feature.attributes.NAME),
              //     watershedAcres: formatValue(feature.attributes.AreaAc),
              //     floodplainAcres: formatValue(feature.attributes.Acres_p2),
              //     nitrogenScale: formatValue(feature.attributes.TN_p2),
              //     phosphorusScale: formatValue(feature.attributes.TP_p2),
              //     sedimentScale: formatValue(feature.attributes.Sed_p2),
              //     endageredSpecies: formatValue(feature.attributes.HPFedEnd),
              //     currentPop: formatValue(feature.attributes.popnow_p2),
              //     peopleFloodplain: formatValue(feature.attributes.pop100),
              //     futurePop: formatValue(feature.attributes.pop2050_p2),
              //     floodDamage: formatValue(feature.attributes.Dam2050_p2),
              //     vulnerabilityIndex: formatValue(feature.attributes.SOVI),
              //   };
              // }
              // // 1-in-100 modeified
              // if (ms.ffModel == 5 && ms.maModel == 'modified') {
              //   ms.clickResults = {
              //     name: formatValue(feature.attributes.NAME),
              //     watershedAcres: formatValue(feature.attributes.AreaAc),
              //     floodplainAcres: formatValue(feature.attributes.Acres_r2),
              //     nitrogenScale: formatValue(feature.attributes.TN_r2),
              //     phosphorusScale: formatValue(feature.attributes.TP_r2),
              //     sedimentScale: formatValue(feature.attributes.Sed_r2),
              //     endageredSpecies: formatValue(feature.attributes.HPFedEnd),
              //     currentPop: formatValue(feature.attributes.popnow_r2),
              //     peopleFloodplain: formatValue(feature.attributes.pop100),
              //     futurePop: formatValue(feature.attributes.pop2050_r2),
              //     floodDamage: formatValue(feature.attributes.Dam2050_r2),
              //     vulnerabilityIndex: formatValue(feature.attributes.SOVI),
              //   };
              // }

              // // 1-in-500 natural
              // if (ms.ffModel == 6 && ms.maModel == 'natural') {
              //   ms.clickResults = {
              //     name: formatValue(feature.attributes.NAME),
              //     watershedAcres: formatValue(feature.attributes.AreaAc),
              //     floodplainAcres: formatValue(feature.attributes.Acres_p3),
              //     nitrogenScale: formatValue(feature.attributes.TN_p3),
              //     phosphorusScale: formatValue(feature.attributes.TP_p3),
              //     sedimentScale: formatValue(feature.attributes.Sed_p3),
              //     endageredSpecies: formatValue(feature.attributes.HPFedEnd),
              //     currentPop: formatValue(feature.attributes.popnow_p3),
              //     peopleFloodplain: formatValue(feature.attributes.pop500),
              //     futurePop: formatValue(feature.attributes.pop2050_p3),
              //     floodDamage: formatValue(feature.attributes.Dam2050_p3),
              //     vulnerabilityIndex: formatValue(feature.attributes.SOVI),
              //   };
              // }
              // // 1-in-500 modified
              // if (ms.ffModel == 6 && ms.maModel == 'modified') {
              //   ms.clickResults = {
              //     name: formatValue(feature.attributes.NAME),
              //     watershedAcres: formatValue(feature.attributes.AreaAc),
              //     floodplainAcres: formatValue(feature.attributes.Acres_r3),
              //     nitrogenScale: formatValue(feature.attributes.TN_r3),
              //     phosphorusScale: formatValue(feature.attributes.TP_r3),
              //     sedimentScale: formatValue(feature.attributes.Sed_r3),
              //     endageredSpecies: formatValue(feature.attributes.HPFedEnd),
              //     currentPop: formatValue(feature.attributes.popnow_r3),
              //     peopleFloodplain: formatValue(feature.attributes.pop500),
              //     futurePop: formatValue(feature.attributes.pop2050_r3),
              //     floodDamage: formatValue(feature.attributes.Dam2050_r3),
              //     vulnerabilityIndex: formatValue(feature.attributes.SOVI),
              //   };
              // }

              ms.graphicsLayer.add(selectionGraphic);
              ms.graphicsLayer.visible = true;
              ms.rightDrawerOpen = true;
              mapView.goTo(selectionGraphic);
            } else {
              ms.rightDrawerOpen = false;
            }
          });
        } else if (
          response.results[0].layer.title ==
          'Structures in the 1% Annual Exceedance Probability Floodplain'
        ) {
          ms.clickType = 'structures';
          layer = webMap.findLayerById(response.results[0].layer.id);
          query = layer.createQuery();
          query.geometry = response.results[0].mapPoint;
          query.spatialRelationship = 'intersects';

          layer.queryFeatures(query).then(function (result) {
            if (result) {
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
                  siteAddress: feature.attributes.Site_Addre,
                  sqFoot: formatValue(feature.attributes.Sq_Ft),
                  occupancy: formatValue(feature.attributes.OccType),
                  landValue: formatValue(feature.attributes.Land_Val),
                  structureValue: formatValue(feature.attributes.Struc_Val),
                  landStructureValue: formatValue(feature.attributes.Tot_Val),
                  foundationType: formatValue(feature.attributes.Found_type),
                  municipality: formatValue(feature.attributes.MUNICIPALI),
                  county: formatValue(feature.attributes.County),
                  surfaceElevation: formatValue(feature.attributes.GSE_ft),
                  firstFloorElevation: formatValue(feature.attributes.FFE),
                  floodDepth: formatValue(feature.attributes.F100YR_Dep),
                  structuresInHubs: formatValue(feature.attributes.EnvroHub),
                  envAnalysisRanking: formatValue(
                    feature.attributes.EnviroRank
                  ),
                  recMitigation: formatValue(feature.attributes.Recommen_1),
                  estMitigation: formatValue(feature.attributes.Recom_Co_1),
                  estFloodFirstFloor: formatValue(feature.attributes.F100YRDEP),
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
          // }
          // });
        } else if (
          response.results[0].layer.title == 'Environmental Hub Analysis'
        ) {
          ms.clickType = 'hub';
          ms.supportingLayers.forEach((l) => {
            if (l.label == response.results[0].layer.title) {
              layer = webMap.findLayerById(l.value);
            }
          });
        }
        // });
      }
    });
  });

  // METHODS
  function queryClick(geo, response) {
    let layer;
    let query;
    let selectionGraphic;
    ms.selectionMade = true;
    // ms.graphicsLayer.removeAll();

    mapView.hitTest(response).then(function (response) {
      if (response.results) {
        if (response.results[0].layer.title == 'Watershed Selection') {
          ms.clickType = 'watershed';
          layer = webMap.findLayerById(ms.wsModel);
          query = layer.createQuery(geo);
          query.geometry = geo;
          query.spatialRelationship = 'intersects';

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
                  watershedAcres: formatValue(feature.attributes.AreaAc),
                  floodplainAcres: formatValue(feature.attributes.Acres_p1),
                  nitrogenScale: formatValue(feature.attributes.TN_p1),
                  phosphorusScale: formatValue(feature.attributes.TP_p1),
                  sedimentScale: formatValue(feature.attributes.Sed_p1),
                  endageredSpecies: formatValue(feature.attributes.HPFedEnd),
                  currentPop: formatValue(feature.attributes.popnow_p1),
                  peopleFloodplain: formatValue(feature.attributes.pop5),
                  futurePop: formatValue(feature.attributes.pop2050_p1),
                  floodDamage: formatValue(feature.attributes.Dam2050_p1),
                  vulnerabilityIndex: formatValue(feature.attributes.SOVI),
                };
              }
              // 1-in-5 modified
              if (ms.ffModel == 4 && ms.maModel == 'modified') {
                ms.clickResults = {
                  name: feature.attributes.NAME,
                  watershedAcres: feature.attributes.AreaAc,
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
                  watershedAcres: feature.attributes.AreaAc,
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
                  watershedAcres: feature.attributes.AreaAc,
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
                  watershedAcres: feature.attributes.AreaAc,
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
                  watershedAcres: feature.attributes.AreaAc,
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
        } else if (
          response.results[0].layer.title ==
          'Structures in the 1% Annual Exceedance Probability Floodplain'
        ) {
          // move function below to this else block
          ms.clickType = 'structures';
        } else if (
          response.results[0].layer.title == 'Environmental Hub Analysis'
        ) {
          // move function below to this else block
          ms.clickType = 'hub';
        }
      }
    });
  }

  function updateOpacitySlider(val) {
    let layer = webMap.findLayerById(ms.wsModel);
    layer.opacity = val / 100;
  }

  function updateSupLay() {
    ms.graphicsLayer.remove(suppLayGraphic);
    const boundaryLayer = webMap.findLayerById(ms.wsModel);
    const layer = webMap.findLayerById('19712edcb1a-layer-10');

    // let query = {
    //   where: '1=1',
    //   returnGeometry: true,
    //   outFields: ['*'],
    // };

    // const layerResults = await layer.queryFeatures(query);
    // const boundaryResults = await boundaryLayer.queryFeatures(query);

    // console.log(boundaryResults);

    // const clipGeom = unionOperator.executeMany(
    //   layerResults.features.map((f) => f.geometry)
    // );

    // let clipExtent = unionOperator.executeMany(
    //   boundaryResults.features.map((f) => f.geometry)
    // );

    // const clipped = clipOperator.executeMany(clipGeom, clipExtent.extent);

    // if (clipped) {
    //   suppLayGraphic = new Graphic({
    //     geometry: clipped,
    //     symbol: {
    //       type: 'simple-fill',
    //       color: [76, 129, 205],
    //       outline: {
    //         type: 'simple-line',
    //         color: [0, 0, 0],
    //         width: 0.5,
    //         style: 'solid',
    //       },
    //     },
    //     attributes: {
    //       id: 'wetlandsGraphic',
    //     },
    //   });

    //   ms.graphicsLayer.effect = '';
    //   ms.graphicsLayer.add(suppLayGraphic);
    //   ms.graphicsLayer.visible = true;
    // }

    const query = boundaryLayer.createQuery();
    query.returnGeometry = true;

    boundaryLayer.queryFeatures(query).then(function (result) {
      const geometries = result.features.map((f) => f.geometry);
      console.log(geometries);
      const combinedGeom = unionOperator.executeMany(geometries);

      const spatialQuery = layer.createQuery();
      spatialQuery.geometry = combinedGeom;
      spatialQuery.spatialRelationship = 'intersects';
      spatialQuery.returnGeometry = true;

      layer.queryFeatures(spatialQuery).then(function (results) {
        results.features.forEach((feature) => {
          suppLayGraphic = new Graphic({
            geometry: feature.geometry,
            symbol: {
              type: 'simple-fill',
              color: [76, 129, 205],
              outline: {
                type: 'simple-line',
                color: [0, 0, 0],
                width: 0.5,
                style: 'solid',
              },
            },
            attributes: {
              id: 'wetlandsGraphic',
            },
          });

          ms.graphicsLayer.effect = '';
          ms.graphicsLayer.add(suppLayGraphic);
          ms.graphicsLayer.visible = true;
        });
      });
    });
  }

  // WATCHERS
  watch(
    () => ms.rightDrawerOpen,
    () => {
      if (ms.rightDrawerOpen == false) {
        ms.graphicsLayer.removeAll();
        ms.clickResults = {};
        ms.selectionMade = false;

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
      ms.activeFilters = [];
      let webMap = document.querySelector('arcgis-map').view.map;
      let layer = webMap.findLayerById(ms.wsModel);
      // if (layer.definitionExpression) {
      //   layer.definitionExpression = '';
      // }
    }
  );
  watch(
    () => ms.wsModel,
    () => {
      // if (ms.rightDrawerOpen == true) {
      //   queryClick(clickPoint);
      // }

      if (ms.wsModel == '195a5a220fb-layer-6') {
        ms.wsModelText = 'HUC 12s';
      } else if (ms.wsModel == '195a55dbf5c-layer-5') {
        ms.wsModelText = 'NHD Catchments';
      }

      let webMap = document.querySelector('arcgis-map').view.map;
      let layer = webMap.findLayerById(ms.wsModel);
      layer.definitionExpression = '';
    }
  );
  watch(
    () => ms.sliderModel,
    () => {
      updateOpacitySlider(ms.sliderModel);
    }
  );
  watch(
    () => ms.runSupLayGraphic,
    () => {
      if (ms.runSupLayGraphic == true) {
        updateSupLay();
      } else {
        //remove sup lay graphic from graphics layer
        ms.graphicsLayer.remove(suppLayGraphic);
      }
    }
  );
};
</script>

<style>
@media screen and (max-width: 700px) {
  #my-map {
    width: 100%;
    min-height: 20vh;
    /* border-bottom: #999 solid 1pt; */
  }
  .esri-view-width-xsmall .esri-expand--auto .esri-expand__container--expanded {
    height: fit-content;
  }
}
.esri-feature {
  letter-spacing: 0em;
  line-height: 1.55rem;
  font-feature-settings: 'liga' 1, 'calt' 0;
  background: #fff;
  padding: 1em;
  width: fit-content;
}

.arcgis-zoom {
  box-shadow: 0 1px 2px #0000004d;
}

#opacitySlider {
  position: absolute;
  left: 40%;
  top: 10px;
  display: flex;
  box-shadow: 0 1px 2px rgb(0 0 0 / 60%);
}
</style>
