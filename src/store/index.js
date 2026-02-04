import { defineStore } from 'pinia';
import { ref, markRaw } from 'vue';
import pdfMake from 'pdfmake/build/pdfmake';
import htmlToPdfmake from 'html-to-pdfmake';
import Graphic from '@arcgis/core/Graphic.js';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import Field from '@arcgis/core/layers/support/Field';
import esriRequest from '@arcgis/core/request';
import 'pdfmake/build/vfs_fonts';

export const useMapStore = defineStore('mapStore', () => {
  // app.vue models
  const mobileSplitterModel = 37;

  // filters
  let selectedFilters = ref([]);
  let activeFilters = ref([]);
  let defExp = ref('');
  let reset = ref(false);
  let filterArray = ref([]);
  let componentKey = ref(1);
  let hucFilter = [];
  let hucFilterModel = ref('');
  let hucFilterSelected = ref(false);
  let boundaryGraphic = ref('');
  let hucInfo = ref(false);

  // pdf variables
  let mapScreenshot = ref('');
  let printMap = ref(false);
  let selectionMade = ref(false);
  let pdfFilters = ref([]);
  let pdfWsType = ref('5-Year Floodplain');
  let pdfSuppLayers = ref([]);
  let clickType = ref('');

  // panels
  const leftPanelWidth = 450;
  const rightPanelWidth = 450;
  let rightDrawerOpen = ref(false);
  let clickResults = ref({});
  let clickResultsLabels = ref({});

  // create v-models and create layer groups
  let floodFrequency = ref([]);
  let ffModel = ref('');
  let watershedType = ref([]);
  let wsModel = ref('');
  let wsModelText = ref('');
  let maModel = ref('natural');
  let sliderModel = ref(60);
  let suppModel = ref(60);
  let suppSlider = ref(false);

  let infoText = ref({});
  let supportingLayers = ref([]);
  let showHelp = ref(true);

  let graphicsLayer = null;
  let selectionGraphic = null;
  let runSupLayGraphic = ref(false);
  let shapefileLayers = ref([]);

  let activeShapefile = ref(false);

  // Info button models
  let ffInfo = ref(false);
  let wsInfo = ref(false);
  let maInfo = ref(false);
  let opacSlider = ref(false);

  // Filter options
  const checkboxStates = ref([]); // Array of checked checkbox keys

  // Temporary feature layers for FULL meramec layers
  let fullHuc = markRaw(
    new FeatureLayer({
      url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/ArcGIS/rest/services/meramac_122325/FeatureServer/0',
    }),
  );
  let fullCatch = markRaw(
    new FeatureLayer({
      url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/ArcGIS/rest/services/meramac_122325/FeatureServer/1',
    }),
  );

  function toggleCheckbox(key) {
    if (checkboxStates.value.includes(key)) {
      checkboxStates.value = checkboxStates.value.filter((k) => k !== key);
    } else {
      checkboxStates.value.push(key);
    }
  }

  function resetCheckboxStates() {
    checkboxStates.value = [];
  }

  // Layer Control Functions
  function getLayerInfos() {
    let webMap = document.querySelector('arcgis-map').view.map;

    webMap.layers.items.forEach((layer) => {
      console.log(layer.title);
      if (layer.title == 'CCS Rasters 1') {
        layer.when(() => {
          layer.sublayers.items.forEach((sub) => {
            console.log(sub);
            sub.sublayers.items.forEach((l) => {
              if (l.title == '5-Year Floodplain') {
                this.floodFrequency.push({ label: '20%', value: l.id });
                this.ffModel = l.id;
              } else if (l.title == '100-Year Floodplain') {
                this.floodFrequency.push({ label: '1%', value: l.id });
              } else if (l.title == '500-Year Floodplain') {
                this.floodFrequency.push({ label: '0.2%', value: l.id });
              } else {
                this.supportingLayers.push({
                  label: l.title,
                  value: l.id,
                  model: l.visible,
                  checkedIcon: 'task_alt',
                  uncheckedIcon: 'panorama_fish_eye',
                });
              }
            });
          });
          this.floodFrequency.reverse();
        });
      } else if (layer.title == 'View Floodplains by Watershed') {
        layer.layers.items.forEach((sub) => {
          console.log(sub.title, sub.id);
          this.watershedType.push({ label: sub.title, value: sub.id });
          if (sub.title == 'HUC 12s') {
            this.wsModel = sub.id;
            this.wsModelText = sub.title;
          }
          sub.definitionExpression = this.defExp;
        });
      } else if (layer.title == 'Supporting Layers') {
        layer.layers.items.forEach((sub) => {
          this.supportingLayers.push({
            label: sub.title,
            value: sub.id,
            model: sub.visible,
            checkedIcon: 'task_alt',
            uncheckedIcon: 'panorama_fish_eye',
          });
        });
      }
      // else {
      //   layer.sublayers.items.forEach((sub) => {
      //     sub.sublayers.items.forEach((l) => {
      //       this.supportingLayers.push({
      //         label: l.title.replaceAll('_', ' '),
      //         value: l.id,
      //         model: l.visible,
      //         checkedIcon: 'task_alt',
      //         uncheckedIcon: 'panorama_fish_eye',
      //       });
      //     });
      //   });
      //   // console.log(this.supportingLayers);
      // }
    });
  }

  function findAnyLayerById(webMap, id) {
    if (!webMap) return null;
    const target = String(id);

    // recursive check for a layer-like object (supports sublayers and group children)
    function checkLayer(layer) {
      if (!layer) return null;
      if (String(layer.id) === target) return layer;

      // MapImageLayer sublayers / Dynamic sublayers: check allSublayers
      if (layer.allSublayers && Array.isArray(layer.allSublayers.items)) {
        for (const sub of layer.allSublayers.items) {
          const r = checkLayer(sub);
          if (r) return r;
        }
      }

      // GroupLayer children
      if (layer.layers && Array.isArray(layer.layers.items)) {
        for (const child of layer.layers.items) {
          const r = checkLayer(child);
          if (r) return r;
        }
      }

      // Some layers expose .sublayers or .allLayers instead — be defensive
      if (layer.sublayers && Array.isArray(layer.sublayers.items)) {
        for (const s of layer.sublayers.items) {
          const r = checkLayer(s);
          if (r) return r;
        }
      }

      return null;
    }

    // iterate top-level layers
    for (const top of webMap.layers.items) {
      const found = checkLayer(top);
      if (found) return found;
    }

    // last resort: try webMap.allLayers (if available)
    if (webMap.allLayers && Array.isArray(webMap.allLayers.items)) {
      const f = webMap.allLayers.items.find((l) => String(l.id) === target);
      if (f) return f;
    }

    return null;
  }

  // WILL NEED TO UPDATE URL WITH FULL HUC
  function getHucFilter() {
    // let layer = new FeatureLayer({
    //   url: 'https://cirrus.tnc.org/arcgis/rest/services/FN_AGR/Meramec/MapServer/0',
    // });

    let query = this.fullHuc.createQuery();
    query.outFields = ['name'];
    this.fullHuc.queryFeatures(query).then((results) => {
      results.features.forEach((feature) => {
        this.hucFilter.push(feature.attributes.name);
      });
    });
  }

  function updateHucFilter(val) {
    console.log(val);
    let webMap = document.querySelector('arcgis-map').view.map;
    let mapView = document.querySelector('arcgis-map').view;
    let layer;
    let query;
    let selectionGraphic;
    this.graphicsLayer.removeAll();
    if (this.highlightHandle) {
      this.highlightHandle.remove();
      this.highlightHandle = null;
    }

    function formatValue(val) {
      // val = val.toFixed(2);
      val = parseFloat(val).toLocaleString('en-US');

      return val;
    }

    if (this.wsModel == '19b4bcc2506-layer-10') {
      layer = this.fullHuc;
      query = layer.createQuery();
      query.where = "name = '" + val + "'";
      this.clickType = 'watershed';
      layer.queryFeatures(query).then((result) => {
        console.log(result);
        if (this.ffModel == 251) {
          //20%
          this.clickResults = {
            name: result.features[0].attributes.name,
            watershedAcres: formatValue(
              result.features[0].attributes.areaacres,
            ),
            floodplainAcres: formatValue(
              result.features[0].attributes.fpacres_unp_1,
            ),
            nitrogenScale: formatValue(
              result.features[0].attributes.iy_tn_perc,
            ),
            phosphorusScale: formatValue(
              result.features[0].attributes.iy_tp_perc,
            ),
            sedimentScale: formatValue(
              result.features[0].attributes.iy_ss_perc,
            ),
            endageredSpecies: formatValue(
              result.features[0].attributes.fedendspecies,
            ),
            currentPop: formatValue(result.features[0].attributes.popnow_1),
            peopleFloodplain: formatValue(
              result.features[0].attributes.popnow_1,
            ),
            futurePop: formatValue(result.features[0].attributes.pop2050_1),
            floodDamage: formatValue(result.features[0].attributes.damages_1),
            vulnerabilityIndex: formatValue(
              result.features[0].attributes.SOVI_1,
            ),
          };
        } else if (this.ffModel == 253) {
          // 1%
          this.clickResults = {
            name: result.features[0].attributes.name,
            watershedAcres: formatValue(watershedAcresValue),
            floodplainAcres: formatValue(
              result.features[0].attributes.fpacres_unp_2,
            ),
            nitrogenScale: formatValue(
              result.features[0].attributes.iy_tn_perc,
            ),
            phosphorusScale: formatValue(
              result.features[0].attributes.iy_tp_perc,
            ),
            sedimentScale: formatValue(
              result.features[0].attributes.iy_ss_perc,
            ),
            endageredSpecies: formatValue(
              result.features[0].attributes.fedendspecies,
            ),
            currentPop: formatValue(result.features[0].attributes.popnow_2),
            peopleFloodplain: formatValue(
              result.features[0].attributes.popnow_2,
            ),
            futurePop: formatValue(result.features[0].attributes.pop2050_2),
            floodDamage: formatValue(result.features[0].attributes.damages_2),
            vulnerabilityIndex: formatValue(
              result.features[0].attributes.SOVI_2,
            ),
          };
        } else if (this.ffModel == 255) {
          // 0.2% 1/500
          this.clickResults = {
            name: result.features[0].attributes.name,
            watershedAcres: formatValue(watershedAcresValue),
            floodplainAcres: formatValue(
              result.features[0].attributes.fpacres_unp_3,
            ),
            nitrogenScale: formatValue(
              result.features[0].attributes.iy_tn_perc,
            ),
            phosphorusScale: formatValue(
              result.features[0].attributes.iy_tp_perc,
            ),
            sedimentScale: formatValue(
              result.features[0].attributes.iy_ss_perc,
            ),
            endageredSpecies: formatValue(
              result.features[0].attributes.fedendspecies,
            ),
            currentPop: formatValue(result.features[0].attributes.popnow_3),
            peopleFloodplain: formatValue(
              result.features[0].attributes.popnow_3,
            ),
            futurePop: formatValue(result.features[0].attributes.pop2050_3),
            floodDamage: formatValue(result.features[0].attributes.damages_3),
            vulnerabilityIndex: formatValue(
              result.features[0].attributes.SOVI_3,
            ),
          };
        }
        selectionGraphic = new Graphic({
          geometry: result.features[0].geometry,
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

        this.graphicsLayer.add(selectionGraphic);
        this.graphicsLayer.visible = true;
        this.rightDrawerOpen = true;
        mapView.goTo(selectionGraphic);
      });
    } else if (this.wsModel == '19b4bcc7eec-layer-11') {
      this.clickType = '';
      layer = this.fullHuc;
      query = layer.createQuery();
      query.where = "NAME = '" + val + "'";
      // layer = this.partialCatch;
      // layer.visible = false;
      // webMap.add(layer);

      // let newQuery = this.fullHuc.createQuery();
      // newQuery.where = "NAME = '" + val + "'";

      // this.fullHuc.queryFeatures(newQuery).then((result) => {
      //   mapView.when(() => {
      //     mapView.whenLayerView(layer).then((layerView) => {
      //       layerView.filter = {
      //         geometry: result.features[0].geometry,
      //         spatialRelationship: 'intersects',
      //       };
      //     });
      //   });
      // });

      layer.queryFeatures(query).then((result) => {
        mapView.goTo(result.features[0].geometry.extent);

        selectionGraphic = new Graphic({
          geometry: result.features[0].geometry,
          symbol: {
            type: 'simple-fill',
            color: [0, 0, 0, 0],
            outline: {
              type: 'simple-line',
              color: [169, 169, 169, 0.6],
              width: 2,
              style: 'solid',
            },
          },
          attributes: {
            id: 'selectionBoundaryGraphic',
          },
        });

        this.boundaryGraphic = markRaw(
          new FeatureLayer({
            title: 'HUC Boundary',
            source: [selectionGraphic],
            objectIdField: 'ObjectID',
            geometryType: 'polygon',
            fields: [
              { name: 'ObjectID', type: 'oid' },
              { name: 'id', type: 'string' },
            ],
            renderer: {
              type: 'simple',
              symbol: {
                type: 'simple-fill',
                color: [0, 0, 0, 0],
                outline: {
                  type: 'simple-line',
                  color: [99, 99, 99, 1],
                  width: 2,
                  style: 'solid',
                },
              },
            },
            legendEnabled: false,
            popupEnabled: false,
            hitTestEnabled: false,
            effect: 'brightness(1) drop-shadow(1px, 1px, 1px)',
          }),
        );
        webMap.add(this.boundaryGraphic);
      });
    }
  }

  function updateLayerVisibility(group, id) {
    let webMap = document.querySelector('arcgis-map').view.map;

    if (group == 'ff') {
      webMap.layers.items.forEach((layer) => {
        if (layer.title == 'CCS Rasters 1') {
          layer.sublayers.items.forEach((sub) => {
            sub.sublayers.items.forEach((l) => {
              if (id == l.id) {
                l.visible = true;
                this.pdfWsType = l.title;
              } else {
                l.visible = false;
              }
            });
          });
        }
      });
    } else if (group == 'ws') {
      this.watershedType.forEach((type) => {
        if (type.value == id) {
          let layer = this.findAnyLayerById(webMap, id);
          if (layer) {
            layer.visible = true;
          }
        } else {
          let layer = this.findAnyLayerById(webMap, type.value);
          if (layer) {
            layer.visible = false;
          }
        }
      });
    } else {
      let layer;
      if (id.toString().startsWith('2')) {
        webMap.layers.items.forEach((lyr) => {
          if (lyr.title == 'CCS Rasters 1') {
            layer = lyr.findSublayerById(id);
          }
        });
      } else {
        layer = this.findAnyLayerById(webMap, id);
      }

      if (this.pdfSuppLayers.includes(layer.title) == false) {
        this.pdfSuppLayers.push(layer.title);
      } else {
        this.pdfSuppLayers = this.pdfSuppLayers.filter((title) => {
          return title !== layer.title;
        });
      }

      if (layer.title == 'USA Wetlands') {
        this.runSupLayGraphic = !this.runSupLayGraphic;
      } else {
        layer.visible = !layer.visible;
      }
    }
  }

  function updateDefinitionExpression(obj) {
    let filterString = '';
    this.filterArray = [];
    let webMap = document.querySelector('arcgis-map').view.map;
    let layer = this.findAnyLayerById(webMap, this.wsModel);

    console.log(this.activeFilters);

    if (!obj) {
      this.activeFilters.forEach((f) => {
        this.filterArray.push(f.exp);
      });
    } else {
      this.activeFilters.forEach((f) => {
        if (f.id == obj.field || f.id == obj.id) {
          f.exp = obj.exp;
          this.filterArray.push(f.exp);
        } else {
          this.filterArray.push(f.exp);
        }
      });
    }

    filterString = this.filterArray.join(' AND ');
    layer.definitionExpression = filterString;
    console.log(filterString);
  }

  // Shapefile Upload Functions
  // let shapefileLayers = [];
  let shapefileName;
  function addShapefileToMap(featureCollection) {
    let webMap = document.querySelector('arcgis-map').view.map;
    let mapView = document.querySelector('arcgis-map').view;
    let sourceGraphics = [];

    this.shapefileLayers = featureCollection.layers.map((layer) => {
      const graphicsObject = layer.featureSet.features.map((feature) => {
        return Graphic.fromJSON(feature);
      });
      let sym = {
        type: 'simple',
        symbol: {
          type: 'simple-fill',
          color: [0, 0, 0, 0],
          outline: {
            type: 'simple-line',
            color: [5, 5, 5, 1],
            width: 2,
            style: 'solid',
          },
        },
      };

      sourceGraphics = sourceGraphics.concat(graphicsObject);

      const featureLayer = markRaw(
        new FeatureLayer({
          objectIdField: 'FID',
          source: graphicsObject,
          renderer: sym,
          fields: layer.layerDefinition.fields.map((field) => {
            return Field.fromJSON(field);
          }),
          title: shapefileName,
          hitTestEnabled: false,
          popupEnabled: false,
          effect: 'brightness(1)',
        }),
      );
      mapView.goTo(graphicsObject);
      // this.queryShapefile(graphicsObject[0].geometry);

      return featureLayer;
    });
    console.log(this.shapefileLayers);
    webMap.addMany(this.shapefileLayers);
  }

  function clearShapefilePoly() {
    let webMap = document.querySelector('arcgis-map').view.map;
    if (this.shapefileLayers.length > 0) {
      webMap.removeMany(this.shapefileLayers);
    }
  }

  function generateFeatureCollection(fileName) {
    let mapView = document.querySelector('arcgis-map').view;
    const portalUrl = 'https://www.arcgis.com';
    let name = fileName.split('.');
    // Chrome adds c:fakepath to the value - we need to remove it
    name = name[0].replace('c:\\fakepath\\', '');
    const params = {
      name: name,
      targetSR: mapView.spatialReference,
      maxRecordCount: 1000,
      enforceInputFileSizeLimit: true,
      enforceOutputJsonSizeLimit: true,
    };

    // generalize features to 10 meters for better performance
    params.generalize = true;
    params.maxAllowableOffset = 10;
    params.reducePrecision = true;
    params.numberOfDigitsAfterDecimal = 0;

    const myContent = {
      filetype: 'shapefile',
      publishParameters: JSON.stringify(params),
      f: 'json',
    };

    // use the REST generate operation to generate a feature collection from the zipped shapefile
    esriRequest(portalUrl + '/sharing/rest/content/features/generate', {
      query: myContent,
      body: document.getElementById('uploadForm'),
      responseType: 'json',
    }).then((response) => {
      this.addShapefileToMap(response.data.featureCollection);
    });
  }

  // function queryShapefile(geom) {
  //   // const webMap = document.querySelector('arcgis-map').view.map;
  //   // let layer = this.findAnyLayerById(webMap, this.wsModel);
  //   let layer;
  //   let fullHuc = new FeatureLayer({
  //     url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/meramac_122325/FeatureServer/0',
  //   });
  //   let fullCatch = new FeatureLayer({
  //     url: 'https://services.arcgis.com/F7DSX1DSNSiWmOqh/ArcGIS/rest/services/meramac_122325/FeatureServer/1',
  //   });
  //   if (this.wsModelText == 'HUC 12s') {
  //     layer = fullHuc;
  //   } else if (this.wsModelText == 'NHD Catchments') {
  //     layer = fullCatch;
  //   }

  //   this.clickResults = {
  //     name: 'Area of Interest',
  //     watershedAcres: 0,
  //     floodplainAcres: 0,
  //     nitrogenScale: 0,
  //     phosphorusScale: 0,
  //     sedimentScale: 0,
  //     endageredSpecies: 0,
  //     currentPop: 0,
  //     peopleFloodplain: 0,
  //     futurePop: 0,
  //     floodDamage: 0,
  //     vulnerabilityIndex: 0,
  //   };
  //   this.clickType = 'watershed';

  //   function formatValue(val) {
  //     // val = val.toFixed(2);
  //     val = parseFloat(val).toLocaleString('en-US');

  //     return val;
  //   }

  //   let query = layer.createQuery();
  //   query.geometry = geom;
  //   query.outFields = ['*'];

  //   layer.queryFeatures(query).then((results) => {
  //     if (results.features.length > 0) {
  //       // console.log(results);
  //       results.features.forEach((feature) => {
  //         if (this.ffModel == 4) {
  //           this.clickResults.watershedAcres += formatValue(
  //             feature.attributes.areaacres
  //           );
  //           this.clickResults.floodplainAcres += formatValue(
  //             feature.attributes.fpacres_unp_1
  //           );
  //           this.clickResults.nitrogenScale += formatValue(
  //             feature.attributes.iy_tn_perc
  //           );
  //           this.clickResults.phosphorusScale += formatValue(
  //             feature.attributes.iy_tp_perc
  //           );
  //           this.clickResults.sedimentScale += formatValue(
  //             feature.attributes.iy_ss_perc
  //           );
  //           this.clickResults.endageredSpecies += formatValue(
  //             feature.attributes.fedendspecies
  //           );
  //           this.clickResults.currentPop += formatValue(
  //             feature.attributes.popnow_1
  //           );
  //           this.clickResults.peopleFloodplain += formatValue(
  //             feature.attributes.popnow_1
  //           );
  //           this.clickResults.futurePop += formatValue(
  //             feature.attributes.pop2050_1
  //           );
  //           this.clickResults.floodDamage += formatValue(
  //             feature.attributes.damages_1
  //           );
  //           this.clickResults.vulnerabilityIndex += formatValue(
  //             feature.attributes.SOVI_1
  //           );
  //         }

  //         if (this.ffModel == 5) {
  //           this.clickResults.watershedAcres += formatValue(
  //             feature.attributes.areaacres
  //           );
  //           this.clickResults.floodplainAcres += formatValue(
  //             feature.attributes.fpacres_unp_2
  //           );
  //           this.clickResults.nitrogenScale += formatValue(
  //             feature.attributes.iy_tn_perc
  //           );
  //           this.clickResults.phosphorusScale += formatValue(
  //             feature.attributes.iy_tp_perc
  //           );
  //           this.clickResults.sedimentScale += formatValue(
  //             feature.attributes.iy_ss_perc
  //           );
  //           this.clickResults.endageredSpecies += formatValue(
  //             feature.attributes.fedendspecies
  //           );
  //           this.clickResults.currentPop += formatValue(
  //             feature.attributes.popnow_2
  //           );
  //           this.clickResults.peopleFloodplain += formatValue(
  //             feature.attributes.popnow_2
  //           );
  //           this.clickResults.futurePop += formatValue(
  //             feature.attributes.pop2050_2
  //           );
  //           this.clickResults.floodDamage += formatValue(
  //             feature.attributes.damages_2
  //           );
  //           this.clickResults.vulnerabilityIndex += formatValue(
  //             feature.attributes.SOVI_2
  //           );
  //         }

  //         if (this.ffModel == 6) {
  //           this.clickResults.watershedAcres += formatValue(
  //             feature.attributes.areaacres
  //           );
  //           this.clickResults.floodplainAcres += formatValue(
  //             feature.attributes.fpacres_unp_3
  //           );
  //           this.clickResults.nitrogenScale += formatValue(
  //             feature.attributes.iy_tn_perc
  //           );
  //           this.clickResults.phosphorusScale += formatValue(
  //             feature.attributes.iy_tp_perc
  //           );
  //           this.clickResults.sedimentScale += formatValue(
  //             feature.attributes.iy_ss_perc
  //           );
  //           this.clickResults.endageredSpecies += formatValue(
  //             feature.attributes.fedendspecies
  //           );
  //           this.clickResults.currentPop += formatValue(
  //             feature.attributes.popnow_3
  //           );
  //           this.clickResults.peopleFloodplain += formatValue(
  //             feature.attributes.popnow_3
  //           );
  //           this.clickResults.futurePop += formatValue(
  //             feature.attributes.pop2050_3
  //           );
  //           this.clickResults.floodDamage += formatValue(
  //             feature.attributes.damages_3
  //           );
  //           this.clickResults.vulnerabilityIndex += formatValue(
  //             feature.attributes.SOVI_3
  //           );
  //         }
  //       });
  //       this.rightDrawerOpen = true;
  //     } else {
  //       this.rightDrawerOpen = false;
  //     }
  //   });
  // }

  // PDF Functions

  function generatePdf() {
    pdfMake.fonts = {
      Roboto: {
        normal:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics:
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
      },
    };

    let today = new Date();
    let dateString = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // code to loop through pdffilters and compare a property (probably whatever is used during defExp) to grab slider values and radio values for filters section of pdf

    let webMap = document.querySelector('arcgis-map').view.map;
    let wsLabel = this.findAnyLayerById(webMap, this.wsModel).title;

    let sf = '<ul>';
    this.pdfFilters.forEach((filter) => {
      if (filter.type == 'slider') {
        sf +=
          '<li><strong>' +
          filter.label +
          '</strong> <br /> Min: ' +
          filter.min +
          '<br /> Max: ' +
          filter.max +
          '</li>';
      } else {
        sf +=
          '<li><strong>' +
          filter.label +
          '</strong> Value: ' +
          filter.radioVal +
          '</li>';
      }
    });
    sf += '</ul>';
    let selectedFiltersHtml = htmlToPdfmake(sf);

    let supportingLayersString;
    if (this.pdfSuppLayers.length > 0) {
      supportingLayersString = htmlToPdfmake(this.pdfSuppLayers.join('<br>'));
    } else {
      supportingLayersString = 'None';
    }

    let docDefinition = {
      header: {
        text: dateString,
        alignment: 'right',
        margin: [0, 20, 20, 0],
      },
      footer: function (currentPage, pageCount) {
        return {
          text:
            'Page ' + currentPage.toString() + ' of ' + pageCount.toString(),
          alignment: 'center',
          margin: [0, 0, 0, 10],
        };
      },
      content: [
        {
          text: 'Meramec Floodplain Tool Report',
          style: ['header1', 'centerItem'],
          margin: [0, 0, 0, 10],
        },
        {
          image: this.mapScreenshot,
          width: 375,
          height: 325,
          style: ['centerItem'],
          margin: [0, 0, 0, 10],
        },
        {
          text: 'Selected Flood Frequency: ',
          style: ['underlineItem'],
        },
        {
          text: this.pdfWsType,
          margin: [0, 0, 0, 10],
        },
        {
          text: 'Selected Watershed Type: ',
          style: ['underlineItem'],
        },
        {
          text: wsLabel,
          margin: [0, 0, 0, 10],
        },
        {
          text: 'Active Supporting Layers: ',
          style: ['underlineItem'],
        },
        {
          text: supportingLayersString,
          margin: [0, 0, 0, 10],
        },
        {
          text: 'Selected Filters:',
          style: ['underlineItem'],
        },
        selectedFiltersHtml,
      ],
      defaultStyle: {
        fontSize: 11,
        color: '#374269',
      },
      styles: {
        header1: {
          bold: true,
          fontSize: 18,
        },
        header1a: {
          bold: true,
          fontSize: 16,
        },
        header2: {
          bold: true,
          fontSize: 14,
        },
        header3: {
          bold: true,
          fontSize: 12,
        },
        header4: {
          fontSize: 12,
        },
        anotherStyle: {
          italics: true,
          alignment: 'right',
        },
        boldItem: {
          bold: true,
        },
        centerItem: {
          alignment: 'center',
        },
        underlineItem: {
          decoration: 'underline',
        },
      },
    };

    let docDefinitionSelection = {
      header: {
        text: dateString,
        alignment: 'right',
        margin: [0, 20, 20, 0],
      },
      footer: function (currentPage, pageCount) {
        return {
          text:
            'Page ' + currentPage.toString() + ' of ' + pageCount.toString(),
          alignment: 'center',
          margin: [0, 0, 0, 10],
        };
      },
      content: [
        {
          text: 'Meramec Floodplain Tool Report',
          style: ['header1', 'centerItem'],
          margin: [0, 0, 0, 10],
        },
        {
          image: this.mapScreenshot,
          width: 375,
          height: 375,
          style: ['centerItem'],
          margin: [0, 0, 0, 20],
        },
        {
          table: {
            widths: ['50%', '50%'],
            body: [
              [{ text: 'Name', fillColor: '#ebebeb' }, this.clickResults.name],
              [
                { text: 'Watershed area (acres)', fillColor: '#ebebeb' },
                this.clickResults.watershedAcres,
              ],
              [
                {
                  text: 'Acres of floodplain (5-year) in forest or wetland',
                  fillColor: '#ebebeb',
                },
                this.clickResults.floodplainAcres,
              ],
              [
                {
                  text: 'Local nitrogen loading (5-year) 1-100 scale',
                  fillColor: '#ebebeb',
                },
                this.clickResults.nitrogenScale,
              ],
              [
                {
                  text: 'Local phosphorus loading (5-year) 1-100 scale',
                  fillColor: '#ebebeb',
                },
                this.clickResults.phosphorusScale,
              ],
              [
                {
                  text: 'Local sediment loading (5-year) 1-100 scale',
                  fillColor: '#ebebeb',
                },
                this.clickResults.sedimentScale,
              ],
              [
                {
                  text: 'Number of federally endangered species occurrences',
                  fillColor: '#ebebeb',
                },
                this.clickResults.endageredSpecies,
              ],
              [
                {
                  text: 'Current pop in 5 yr floodplain in forest/wetland/grassland/ag/pasture',
                  fillColor: '#ebebeb',
                },
                this.clickResults.currentPop,
              ],
              [
                {
                  text: 'People currently living in the floodplain of the selected flood frequency, in all land covers',
                  fillColor: '#ebebeb',
                },
                this.clickResults.peopleFloodplain,
              ],
              [
                {
                  text: '2050 pop. in 5 yr. floodplain in forest/wetland/grassland/ag/pasture',
                  fillColor: '#ebebeb',
                },
                this.clickResults.futurePop,
              ],
              [
                {
                  text: 'Potential 2050 flood damage to buildings in 5-year floodplain',
                  fillColor: '#ebebeb',
                },
                this.clickResults.floodDamage,
              ],
              [
                { text: 'Social vulnerability index', fillColor: '#ebebeb' },
                this.clickResults.vulnerabilityIndex,
              ],
            ],
          },
          margin: [0, 0, 0, 10],
          pageBreak: 'after',
        },
        {
          text: 'Selected Flood Frequency: ',
          style: ['underlineItem'],
        },
        {
          text: this.pdfWsType,
          margin: [0, 0, 0, 10],
        },
        {
          text: 'Selected Watershed Type: ',
          style: ['underlineItem'],
        },
        {
          text: wsLabel,
          margin: [0, 0, 0, 10],
        },
        {
          text: 'Active Supporting Layers: ',
          style: ['underlineItem'],
        },
        {
          text: supportingLayersString,
          margin: [0, 0, 0, 10],
        },
        {
          text: 'Selected Filters:',
          style: ['underlineItem'],
        },
        selectedFiltersHtml,
      ],
      defaultStyle: {
        fontSize: 11,
        color: '#374269',
      },
      styles: {
        header1: {
          bold: true,
          fontSize: 18,
        },
        header1a: {
          bold: true,
          fontSize: 16,
        },
        header2: {
          bold: true,
          fontSize: 14,
        },
        header3: {
          bold: true,
          fontSize: 12,
        },
        header4: {
          fontSize: 12,
        },
        anotherStyle: {
          italics: true,
          alignment: 'right',
        },
        boldItem: {
          bold: true,
        },
        centerItem: {
          alignment: 'center',
        },
        underlineItem: {
          decoration: 'underline',
        },
      },
    };

    if (!this.selectionMade) {
      pdfMake.createPdf(docDefinition).download();
    } else {
      pdfMake.createPdf(docDefinitionSelection).download();
    }

    this.printMap = false;
  }

  function getMapPrint() {
    const mapView = document.querySelector('arcgis-map').view;

    mapView.takeScreenshot().then((screenshot) => {
      let image = screenshot.dataUrl;
      this.mapScreenshot = image;

      this.generatePdf();
    });
  }

  return {
    mobileSplitterModel,
    selectedFilters,
    activeFilters,
    defExp,
    reset,
    filterArray,
    mapScreenshot,
    printMap,
    selectionMade,
    pdfFilters,
    pdfWsType,
    pdfSuppLayers,
    clickType,
    leftPanelWidth,
    rightPanelWidth,
    rightDrawerOpen,
    clickResults,
    clickResultsLabels,
    floodFrequency,
    ffModel,
    watershedType,
    wsModel,
    maModel,
    sliderModel,
    suppModel,
    infoText,
    supportingLayers,
    showHelp,
    graphicsLayer,
    selectionGraphic,
    runSupLayGraphic,
    ffInfo,
    wsInfo,
    maInfo,
    opacSlider,
    getLayerInfos,
    updateLayerVisibility,
    updateDefinitionExpression,
    generatePdf,
    getMapPrint,
    checkboxStates,
    toggleCheckbox,
    resetCheckboxStates,
    componentKey,
    fullHuc,
    fullCatch,
    wsModelText,
    addShapefileToMap,
    clearShapefilePoly,
    generateFeatureCollection,
    // queryShapefile,
    shapefileLayers,
    shapefileName,
    activeShapefile,
    hucFilter,
    hucFilterModel,
    hucFilterSelected,
    getHucFilter,
    updateHucFilter,
    boundaryGraphic,
    findAnyLayerById,
    hucInfo,
    suppSlider,
  };
});
