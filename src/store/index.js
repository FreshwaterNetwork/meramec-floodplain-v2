import { defineStore } from 'pinia';
import { ref } from 'vue';
import pdfMake from 'pdfmake/build/pdfmake';
import htmlToPdfmake from 'html-to-pdfmake';
import Graphic from '@arcgis/core/Graphic.js';
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
  let maModel = ref('natural');
  let sliderModel = ref(60);

  let infoText = ref({});
  let supportingLayers = ref([]);
  let showHelp = ref(true);

  let graphicsLayer = null;
  let selectionGraphic = null;
  let runSupLayGraphic = ref(false);

  // Info button models
  let ffInfo = ref(false);
  let wsInfo = ref(false);
  let maInfo = ref(false);
  let opacSlider = ref(false);

  // Filter options
  const checkboxStates = ref([]); // Array of checked checkbox keys

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

  // FUNCTIONS
  function getLayerInfos() {
    let webMap = document.querySelector('arcgis-map').view.map;

    webMap.layers.items.forEach((layer) => {
      if (layer.title == 'Select Flood Frequency') {
        layer.when(() => {
          layer.sublayers.items.forEach((sub) => {
            if (sub.title == '5-Year Floodplain') {
              this.floodFrequency.push({ label: '20%', value: sub.id });
              this.ffModel = sub.id;
            } else if (sub.title == '100-Year Floodplain') {
              this.floodFrequency.push({ label: '1%', value: sub.id });
            } else if (sub.title == '500-Year Floodplain') {
              this.floodFrequency.push({ label: '0.2%', value: sub.id });
            }
          });
          this.floodFrequency.reverse();
        });
      } else if (layer.title == 'View Floodplains by Watershed') {
        layer.layers.items.forEach((sub) => {
          this.watershedType.push({ label: sub.title, value: sub.id });
          if (sub.title == 'HUC 12s') {
            this.wsModel = sub.id;
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
    });
  }

  function updateLayerVisibility(group, id) {
    let webMap = document.querySelector('arcgis-map').view.map;

    if (group == 'ff') {
      webMap.layers.items.forEach((layer) => {
        if (layer.title == 'Select Flood Frequency') {
          layer.sublayers.items.forEach((sub) => {
            if (id == sub.id) {
              sub.visible = true;
              this.pdfWsType = sub.title;
            } else {
              sub.visible = false;
            }
          });
        }
      });
    } else if (group == 'ws') {
      this.watershedType.forEach((type) => {
        if (type.value == id) {
          let layer = webMap.findLayerById(id);
          if (layer) {
            layer.visible = true;
          }
        } else {
          let layer = webMap.findLayerById(type.value);
          if (layer) {
            layer.visible = false;
          }
        }
      });
    } else {
      let layer = webMap.findLayerById(id);

      if (this.pdfSuppLayers.includes(layer.title) == false) {
        this.pdfSuppLayers.push(layer.title);
      } else {
        this.pdfSuppLayers = this.pdfSuppLayers.filter((title) => {
          return title !== layer.title;
        });
      }

      if (layer) {
        if (layer.title == 'USA Wetlands') {
          this.runSupLayGraphic = !this.runSupLayGraphic;
        } else {
          layer.visible = !layer.visible;
        }
      }
    }
  }

  function updateDefinitionExpression(obj) {
    let filterString = '';
    this.filterArray = [];
    let webMap = document.querySelector('arcgis-map').view.map;
    let layer = webMap.findLayerById(this.wsModel);

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

    console.log(layer.definitionExpression);
  }

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
    let wsLabel = webMap.findLayerById(this.wsModel).title;

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
  };
});
