import { defineStore } from 'pinia';
import pdfMake from 'pdfmake/build/pdfmake';
import htmlToPdfmake from 'html-to-pdfmake';
import 'pdfmake/build/vfs_fonts';

export const useMapStore = defineStore('mapStore', () => ({
  // filters
  filters: [
    {
      expLabel: 'Available Floodplain Area',
      // options: [
      //   {
      //     label:
      //       'Available floodplain area for given flood frequency and management action',
      //     model: false,
      //     type: 'range',
      //     infoText:
      //       'Area of floodplain in natural land cover that is not currently in protected status.',
      //     pSliderValues: { min: 0, max: 0 },
      //     mSliderValues: { min: 0, max: 0 },
      //   },
      // ],
    },
    {
      expLabel: 'Water Quality',
      // options: [
      //   {
      //     label: 'Total nitrogen (SWAT model)',
      //     model: false,
      //     type: 'range',
      //     infoText:
      //       'Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments lower in this metric.',
      //     pSliderValues: { min: 0, max: 0 },
      //     mSliderValues: { min: 0, max: 0 },
      //   },
      //   {
      //     label: 'Total phosphorus (SWAT model)',
      //     model: false,
      //     type: 'range',
      //     infoText:
      //       'Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments lower in this metric.',
      //     pSliderValues: { min: 0, max: 0 },
      //     mSliderValues: { min: 0, max: 0 },
      //   },
      //   {
      //     label: 'Sediment (SWAT model)',
      //     model: false,
      //     type: 'range',
      //     infoText:
      //       'Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments lower in this metric.',
      //     pSliderValues: { min: 0, max: 0 },
      //     mSliderValues: { min: 0, max: 0 },
      //   },
      //   {
      //     label: 'Accumulated sediment (SWAT model)',
      //     model: false,
      //     type: 'range',
      //     infoText:
      //       'Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For protection priorities, identify catchments lower in this metric.',
      //     pSliderValues: { min: 0, max: 0 },
      //     mSliderValues: { min: 0, max: 0 },
      //   },
      //   {
      //     label: 'Nutrient loading to Gulf of Mexico (SPARROW model)',
      //     model: false,
      //     type: 'range',
      //     infoText:
      //       'Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For protection priorities, identify catchments lower in this metric.',
      //     pSliderValues: { min: 0, max: 0 },
      //     mSliderValues: { min: 0, max: 0 },
      //   },
      // ],
    },
    {
      expLabel: 'Connectivity',
      // options: [
      //   {
      //     label: '',
      //     model: false,
      //     type: '',
      //     infoText: '',
      //     pSliderValues: { min: 0, max: 0 },
      //     mSliderValues: { min: 0, max: 0 },
      //   },
      // ],
    },
    {
      expLabel: 'Priority Conservation Area/Natural Areas',
      // options: [
      //   {
      //     label: '',
      //     model: false,
      //     type: '',
      //     infoText: '',
      //     pSliderValues: { min: 0, max: 0 },
      //     mSliderValues: { min: 0, max: 0 },
      //   },
      // ],
    },
    {
      expLabel: 'Habitat',
      // options: [
      //   {
      //     label: '',
      //     model: false,
      //     type: '',
      //     infoText: '',
      //     nSliderValues: { min: 0, max: 0 },
      //     mSliderValues: { min: 0, max: 0 },
      //   },
      // ],
    },
    {
      expLabel: 'Population Exposure',
      // options: [
      //   {
      //     label: '',
      //     model: false,
      //     type: '',
      //     infoText: '',
      //     pSliderValues: { min: 0, max: 0 },
      //     mSliderValues: { min: 0, max: 0 },
      //   },
      // ],
    },
    {
      expLabel: 'Flood Damages',
      // options: [
      //   {
      //     label: '',
      //     type: '',
      //     model: false,
      //     infoText: '',
      //     pSliderValues: { min: 0, max: 0 },
      //     mSliderValues: { min: 0, max: 0 },
      //   },
      // ],
    },
    {
      expLabel: 'Social Vulnerability',
      // options: [
      //   {
      //     label: '',
      //     model: false,
      //     type: '',
      //     infoText: '',
      //     pSliderValues: { min: 0, max: 0 },
      //     mSliderValues: { min: 0, max: 0 },
      //   },
      // ],
    },
  ],
  selectedFilters: [],
  selectedFields: [],
  mapScreenshot: '',

  // panels
  leftPanelWidth: 450,
  rightPanelWidth: 450,
  rightDrawerOpen: false,
  clickResults: {},
  clickResultsLabels: {},

  // create v-models and create layer groups
  floodFrequency: [],
  ffModel: '',

  watershedType: [],
  wsModel: '',

  maModel: 'natural',

  infoText: {},
  supportingLayers: [],
  showHelp: true,

  testRange: { min: 25, max: 75 },

  graphicsLayer: null,
  selectionGraphic: null,

  // Info button models
  ffInfo: false,
  wsInfo: false,
  maInfo: false,

  // FUNCTIONS
  getLayerInfos() {
    let webMap = document.querySelector('arcgis-map').view.map;

    webMap.layers.items.forEach((layer) => {
      console.log(layer.title);
      if (layer.title == 'Select Flood Frequency') {
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
      } else if (layer.title == 'View Floodplains by Watershed') {
        layer.layers.items.forEach((sub) => {
          this.watershedType.push({ label: sub.title, value: sub.id });
          console.log(this.watershedType);
          if (sub.title == 'HUC 12s') {
            this.wsModel = sub.id;
          }
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
  },

  updateLayerVisibility(group, id) {
    let webMap = document.querySelector('arcgis-map').view.map;

    if (group == 'ff') {
      webMap.layers.items.forEach((layer) => {
        if (layer.title == 'Select Flood Frequency') {
          layer.sublayers.items.forEach((sub) => {
            if (id == sub.id) {
              sub.visible = true;
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
      if (layer) {
        layer.visible = !layer.visible;
      }
    }
  },

  updateDefinitionExpression(values) {
    console.log(values);
  },

  updateSelectedFields() {},

  async generatePdf() {
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

    let sf = '<ul>';
    this.selectedFilters.forEach((filter) => {
      sf +=
        '<li><strong>' +
        filter.label +
        '</strong> Min: ' +
        filter.min +
        ', Max: ' +
        filter.max +
        '</li>';
    });
    sf += '</ul>';
    let selectedFiltersHtml = htmlToPdfmake(sf);

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
          text: 'Lower Meramec Floodplain Tool',
          style: ['header1', 'centerItem'],
          margin: [0, 0, 0, 10],
        },
        {
          image: this.mapScreenshot,
          width: 375,
          height: 375,
          style: ['centerItem'],
          margin: [0, 0, 0, 10],
        },
        {
          text: 'Selected Flood Frequency: ',
        },
        {
          text: this.ffModel,
        },
        {
          text: 'Selected Watershed Type: ',
        },
        {
          text: this.wsModel,
        },
        {
          text: 'Selected Management Action: ',
        },
        {
          text: this.maModel,
        },
        {
          text: 'Active Supporting Layers: ',
        },
        {
          text: 'Selected Filters:',
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
      },
    };
  },

  // WATCHERS
}));
