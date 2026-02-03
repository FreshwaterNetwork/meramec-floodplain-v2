<template>
  <!-- <q-separator inset class="q-ma-xs" /> -->
  <div v-for="obj in filterObj" :key="obj">
    <q-expansion-item
      :label="obj.header"
      class="q-mt-md"
      header-class="text-weight-medium bg-grey-3"
      dense
      default-opened
      style="border-radius: 15px"
    >
      <div v-for="option in obj.controls" :key="option">
        <div v-for="(range, key) in sliderObj" :key="key">
          <div v-if="objName == key">
            <div v-for="(k, key) in range" :key="key">
              <div
                v-if="key == option.field && option.type == 'slider'"
                class="q-pt-sm"
                style="width: 90%; display: block; margin: auto"
              >
                <div style="display: flex">
                  <FilterCheckbox
                    :key="ms.componentKey"
                    :label="option.label"
                    :k="k"
                    method="update-de"
                    @update-de="updateCheckbox(option, k)"
                  ></FilterCheckbox>

                  <IconButton
                    class="q-ml-sm"
                    v-if="!infoOpen[objName + '-' + option.field]"
                    type="info"
                    method="show-info"
                    @show-info="setInfo(objName + '-' + option.field, true)"
                  ></IconButton>
                  <IconButton
                    class="q-ml-sm"
                    v-if="infoOpen[objName + '-' + option.field]"
                    type="close"
                    method="hide-info"
                    @hide-info="setInfo(objName + '-' + option.field, false)"
                  ></IconButton>
                </div>
                <div
                  class="q-ma-sm"
                  v-if="infoOpen[objName + '-' + option.field]"
                  v-html="k.info"
                ></div>
                <div
                  class="q-pt-sm"
                  style="height: 50px; width: 90%; margin: auto"
                  v-show="option.checkboxModel.value == true"
                >
                  <FilterSlider
                    :option="option"
                    :k="k"
                    method="update-sl"
                    @update-sl="updateSlider"
                  ></FilterSlider>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-for="(radio, key) in radioObj" :key="key">
          <div v-if="objName == key">
            <div v-for="(k, key) in radio" :key="key">
              <div
                v-if="key == option.field && option.type == 'radio'"
                class="q-pt-sm"
                style="width: 90%; margin: auto"
              >
                <div style="width: 90%; display: flex">
                  <FilterCheckbox
                    :key="ms.componentKey"
                    :label="option.label"
                    :k="k"
                    method="update-de"
                    @update-de="updateCheckbox(option)"
                  ></FilterCheckbox>

                  <IconButton
                    class="q-ml-sm"
                    v-if="!infoOpen[objName + '-' + option.field]"
                    type="info"
                    method="show-info"
                    @show-info="setInfo(objName + '-' + option.field, true)"
                  ></IconButton>
                  <IconButton
                    class="q-ml-sm"
                    v-if="infoOpen[objName + '-' + option.field]"
                    type="close"
                    method="hide-info"
                    @hide-info="setInfo(objName + '-' + option.field, false)"
                  ></IconButton>
                </div>
                <div
                  class="q-ma-sm"
                  v-if="infoOpen[objName + '-' + option.field]"
                  v-html="k.info"
                ></div>
                <div
                  class="self-center"
                  style="margin: auto; width: fit-content; display: block"
                  v-if="option.checkboxModel.value == true"
                >
                  <FilterRadio
                    :option="option"
                    method="update-radio"
                    @update-radio="updateRadio(option)"
                  ></FilterRadio>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-expansion-item>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useMapStore } from '../../store/index';
import FilterCheckbox from './FilterSelect.vue';
import FilterRadio from './FilterRadio.vue';
import FilterSlider from './FilterSlider.vue';
import IconButton from './IconButton.vue';

const infoOpen = ref({});
function setInfo(id, val) {
  infoOpen.value[id] = val;
}
const ms = useMapStore();

const props = defineProps({
  objName: String,
});

// object to build filter control
const filterObj = {
  group0: {
    header: 'Available Floodplain Area',
    controls: {
      con0: {
        type: 'slider',
        field: 'Acres',
        label: 'Available floodplain area',
        checkboxModel: ref(false),
        radioModel: ref('present'),
        single: true,
      },
    },
  },
  group1: {
    header: 'Water Quality',
    controls: {
      con0: {
        type: 'slider',
        field: 'TN',
        label: 'Total nitrogen (SPARROW model)',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },
      con1: {
        type: 'slider',
        field: 'TP',
        label: 'Total phosphorus (SPARROW model)',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },

      con2: {
        type: 'slider',
        field: 'Sed',
        label: 'Sediment (SPARROW model)',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },

      con3: {
        type: 'slider',
        field: 'SedAcc',
        label: 'Accumulated sediment (SPARROW model)',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },

      con4: {
        type: 'slider',
        field: 'DINCY',
        label: 'Nutrient loading to Gulf of Mexico (SPARROW model)',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },
    },
  },
  group2: {
    // this group is only for "modified land cover"
    header: 'Land Conversion',
    controls: {
      con0: {
        type: 'slider',
        field: 'NCCPI',
        label: 'Agricultural productivity potential of soils',
        single: true,
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },
    },
  },
  // group3: {
  //   header: 'Connectivity',
  //   controls: {
  //     con0: {
  //       type: 'radio',
  //       field: 'impWet',
  //       label: 'Floodplain Wetland Importance Rank',
  //       checkboxModel: ref(false),
  //       radioModel: ref('present'),
  //     },

  // con1: {
  //   type: 'radio',
  //   field: 'fprank',
  //   label: 'Floodplain Restoration Rank',
  //   checkboxModel: ref(false),
  //   radioModel: ref('present'),
  // },
  //   },
  // },
  group4: {
    header: 'Priority Conservation Area/Natural Areas',
    controls: {
      con0: {
        type: 'slider',
        field: 'adjProt',
        label: 'Public Lands Adjacency',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },

      // con1: {
      //   type: 'slider',
      //   field: 'EcoSig',
      //   label: 'Ecological Significance Ranking',
      //   checkboxModel: ref(false),
      //   radioModel: ref('present'),
      // },
    },
  },
  group5: {
    header: 'Habitat',
    controls: {
      con0: {
        type: 'radio',
        field: 'inIBA',
        label: 'Important Bird Areas',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },

      con1: {
        type: 'slider',
        field: 'WT_TOT',
        label: 'At-Risk Wetland Species',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },

      con2: {
        type: 'radio',
        field: 'ABCcorr',
        label: 'American Bird Conservancy Corridors & Key Habitat Bird Areas',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },

      con3: {
        type: 'radio',
        field: 'anyHab',
        label: 'In any of the above 3 Habitat layers',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },

      con4: {
        type: 'slider',
        field: 'cumu_hci',
        label:
          'National Fish Habitat Partnership Cumulative Habitat Condition Index',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },
      con5: {
        type: 'slider',
        field: 'HPFedEnd',
        label: 'Number of federally endangered species',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },
    },
  },
  group6: {
    header: 'Population Exposure',
    controls: {
      con0: {
        type: 'slider',
        field: 'popnow',
        label: 'Population exposed to floods (present-day)',
        unit: '',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },
      // con1: {
      //   type: 'slider',
      //   field: 'pop5',
      //   label:
      //     'Population exposed to floods (present-day) (in all land covers)',
      //   checkboxModel: ref(false),
      //   radioModel: ref('present'),
      //   unit: '',
      // },
      // con2: {
      //   type: 'slider',
      //   field: 'pop100',
      //   label:
      //     'Population exposed to floods (present-day) (in all land covers)',
      //   checkboxModel: ref(false),
      //   radioModel: ref('present'),
      //   unit: '',
      // },
      // con3: {
      //   type: 'slider',
      //   field: 'pop500',
      //   label:
      //     'Population exposed to floods (present-day) (in all land covers)',
      //   checkboxModel: ref(false),
      //   radioModel: ref('present'),
      //   unit: '',
      // },
      con4: {
        type: 'slider',
        field: 'pop2050',
        label: 'Population exposed to floods (2050)',
        unit: '',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },
    },
  },
  group7: {
    header: 'Flood Damages',
    controls: {
      con0: {
        type: 'slider',
        field: 'Dam2050',
        label: 'Projected future flood damages (2050) ($)',
        unit: '',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },
    },
  },
  group8: {
    header: 'Social Vulnerability',
    controls: {
      con0: {
        type: 'slider',
        field: 'SOVI',
        label: 'Index of social vulnerability to environmental hazards',
        unit: '',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },
    },
  },
};

// object for range sliders
const sliderObj = ref({
  // huc 12 + 1 in 5 year flood
  h12p1: {
    Acres: {
      values: [],
      vis: true,
      min: 16,
      max: 633,
      info: '<b>Available floodplain area</b><br>Acres of floodplain potentially available for protection & restoration, not including areas within the Protected Areas Database of the U.S. (PAD-US)',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: `<b>Total nitrogen (SPARROW model)</b><br>Kg/yr of nitrogen from within a given watershed exported at the mouth of that watershed (as estimated by USGS SPARROW model), divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-midwest-2012/' target='_blank'>More info</a>`,
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Total phosphorus (SPARROW model)</b><br>Kg/yr of phosphorus from within a given watershed exported at the mouth of that watershed (as estimated by USGS SPARROW model), divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-midwest-2012/' target='_blank'>More info</a>",
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Sediment (SPARROW model)</b><br>MT/yr of suspended sediment from within a given watershed exported at the mouth of that watershed (as estimated by USGS SPARROW model), divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-midwest-2012/' target='_blank'>More info</a>",
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Accumulated sediment (SPARROW model)</b><br>MT/yr of suspended sediment from within a given watershed exported at the mouth of the watershed (as estimated by USGS SPARROW model), accounting for all sediment coming in from upstream, normalized to a 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-midwest-2012/' target='_blank'>More info</a>",
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Nutrient loading to Gulf of Mexico (SPARROW model)</b><br>Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed's area, and normalized to a 0-100 scale, with the normalized values for nitrogen and phosphorus averaged together. <a href='https://sparrow.wim.usgs.gov/sparrow-midwest-2012/' target='_blank'>More Info</a>",
    },
    NCCPI: {
      values: [],
      vis: true,
      min: 0,
      max: 1,
      info: "The National Commodity Crop Productivity Index (NCCPI) characterizes soil's inherent capacity to produce non-irrigated commodity crops (0-1). Lower value suggests less productive soil, and therefore a more viable opportunity for restoration. <a href='https://www.nrcs.usda.gov/sites/default/files/2023-01/NCCPI-User-Guide.pdf' target='_blank'>More info</a>",
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 186,
      info: '<b>Public Lands Adjacency</b><br>Acres of floodplain within 1/4 mile of protected land. Protected land includes areas from the Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 0,
      max: 596,
      info: "<b>Ecological Significance Ranking</b><br>Acres of floodplain in natural cover within an ecologically significant area (significance ranking 4 or above). Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2011_EAI_eco_significance.pdf' target='_blank'>More Info</a>",
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: "<b>At-Risk Wetland Species</b><br>Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/ESN/Totalnumberofatriskwetlandspecies.pdf' target='_blank'>More Info</a>",
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 1.686,
      max: 3.622,
      step: 0.001,
      shfld: true,
      info: "<b>National Fish Habitat Partnership Cumulative Habitat Condition Index</b><br>Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. <a href='https://www.usgs.gov/data/national-fish-habitat-partnership-nfhp-2015-cumulative-habitat-condition-indices-limiting-and' target='_blank'>More Info</a>",
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 37,
      shfld: true,
      info: '<b>Number of federally endangered species</b><br>This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 7,
      info: "<b>Population exposed to floods (present-day)</b><br>Number of people currently living in unprotected floodplain of the currently selected flood frequency. Population determined using land-cover-weighted allocation of population. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/Supplemental/DasymetricAllocationofPopulation.pdf' target='_blank'>More info</a>",
    },
    pop5: {
      values: [],
      vis: true,
      min: 1,
      max: 70,
      shfld: true,
      info: "People currently living in the floodplain of the selected flood frequency, in all land covers.  <a href='https://www.epa.gov/enviroatlas/dasymetric-toolbox' target='_blank'>More Info</a>",
    },
    pop100: {
      vis: false,
    },
    pop500: {
      vis: false,
    },
    pop2050: {
      values: [],
      vis: true,
      min: 1,
      max: 70,
      info: "<b>Population exposed to floods (2050)</b><br>Number of people expected to be living in the floodplain of the currently selected flood frequency by 2050, determined using the methods in Wing et al. (2018). <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>",
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 313176,
      max: 5207579,
      info: "<b>Potential Future Flood Damages to Structures (2050) ($)</b><br>Estimate of property damage in the floodplain corresponding to the currently selected flood frequency, given flood depth and projected 2050 land use / building type, according to a fossil-fuel-driven socioeconomic development scenario (SSP5). SSP scenario descriptions are available <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>here</a>. Estimated using the methods in Wing et al. (2018). <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>",
    },
    SOVI: {
      values: [],
      vis: true,
      min: -2.166,
      max: -0.458,
      step: 0.001,
      shfld: true,
      info: "<b>Index of social vulnerability to environmental hazards</b><br>Index characterizing social vulnerability to environmental hazards, drawing on 22 demographic variables. At the national scale, values below -1 are considered low social vulnerability, -1 to +1 are medium, and above +1 are high. The value here is an average of the social vulnerability score within the unprotected floodplain of the currently selected flood frequency. <a href='https://sc.edu/study/colleges_schools/artsandsciences/centers_and_institutes/hvri/data_and_resources/sovi/' target='_blank'>More info</a>",
    },
  },
  // huc 12 + 1 in 100 year flood
  h12p2: {
    Acres: {
      values: [],
      vis: true,
      min: 36,
      max: 1579,
      info: '<b>Available floodplain area</b><br>Acres of floodplain potentially available for protection & restoration, not including areas within the Protected Areas Database of the U.S. (PAD-US)',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: `<b>Total nitrogen (SPARROW model)</b><br>Kg/yr of nitrogen from within a given watershed exported at the mouth of that watershed (as estimated by USGS SPARROW model), divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-midwest-2012/' target='_blank'>More info</a>`,
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Total phosphorus (SPARROW model)</b><br>Kg/yr of phosphorus from within a given watershed exported at the mouth of that watershed (as estimated by USGS SPARROW model), divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-midwest-2012/' target='_blank'>More info</a>",
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Sediment (SPARROW model)</b><br>MT/yr of suspended sediment from within a given watershed exported at the mouth of that watershed (as estimated by USGS SPARROW model), divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-midwest-2012/' target='_blank'>More info</a>",
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Accumulated sediment (SPARROW model)</b><br>MT/yr of suspended sediment from within a given watershed exported at the mouth of the watershed (as estimated by USGS SPARROW model), accounting for all sediment coming in from upstream, normalized to a 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-midwest-2012/' target='_blank'>More info</a>",
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Nutrient loading to Gulf of Mexico (SPARROW model)</b><br>Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed's area, and normalized to a 0-100 scale, with the normalized values for nitrogen and phosphorus averaged together. <a href='https://sparrow.wim.usgs.gov/sparrow-midwest-2012/' target='_blank'>More Info</a>",
    },
    NCCPI: {
      values: [],
      vis: true,
      min: 0,
      max: 1,
      info: "The National Commodity Crop Productivity Index (NCCPI) characterizes soil's inherent capacity to produce non-irrigated commodity crops (0-1). Lower value suggests less productive soil, and therefore a more viable opportunity for restoration. <a href='https://www.nrcs.usda.gov/sites/default/files/2023-01/NCCPI-User-Guide.pdf' target='_blank'>More info</a>",
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 732,
      info: '<b>Public Lands Adjacency</b><br>Acres of floodplain within 1/4 mile of protected land. Protected land includes areas from the Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 23,
      max: 1360,
      info: "<b>Ecological Significance Ranking</b><br>Acres of floodplain in natural cover within an ecologically significant	area (significance ranking 4 or above). Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2011_EAI_eco_significance.pdf' target='_blank'>More Info</a>",
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: "<b>At-Risk Wetland Species</b><br>Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/ESN/Totalnumberofatriskwetlandspecies.pdf' target='_blank'>More Info</a>",
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 1.686,
      max: 3.622,
      step: 0.001,
      shfld: true,
      info: "<b>National Fish Habitat Partnership Cumulative Habitat Condition Index</b><br>Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. <a href='https://www.usgs.gov/data/national-fish-habitat-partnership-nfhp-2015-cumulative-habitat-condition-indices-limiting-and' target='_blank'>More Info</a>",
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 37,
      shfld: true,
      info: '<b>Number of federally endangered species</b><br>This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 7,
      max: 92,
      info: "<b>Population exposed to floods (present-day)</b><br>Number of people currently living in unprotected floodplain of the currently selected flood frequency. Population determined using land-cover-weighted allocation of population. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/Supplemental/DasymetricAllocationofPopulation.pdf' target='_blank'>More info</a>",
    },
    pop5: {
      vis: false,
    },
    pop100: {
      values: [],
      vis: true,
      min: 90,
      max: 1097,
      shfld: true,
      info: "People currently living in the floodplain of the selected flood frequency, in all land covers.  <a href='https://www.epa.gov/enviroatlas/dasymetric-toolbox' target='_blank'>More Info</a>",
    },
    pop500: {
      vis: false,
    },
    pop2050: {
      values: [],
      vis: true,
      min: 15,
      max: 515,
      info: "<b>Population exposed to floods (2050)</b><br>People expected to be living in forest/wetland/grassland floodplain of the selected flood frequency in 2050. <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More Info</a>",
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 1116767,
      max: 82900000,
      info: "<b>Potential Future Flood Damages to Structures (2050) ($)</b><br>Estimate of property damage in the floodplain corresponding to the currently selected flood frequency, given flood depth and projected 2050 land use / building type, according to a fossil-fuel-driven socioeconomic development scenario (SSP5). SSP scenario descriptions are available <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>here</a>. Estimated using the methods in Wing et al. (2018). <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>",
    },
    SOVI: {
      values: [],
      vis: true,
      min: -2.166,
      max: -0.458,
      step: 0.001,
      shfld: true,
      info: "<b>Index of social vulnerability to environmental hazards</b><br>Index characterizing social vulnerability to environmental hazards, drawing on 22 demographic variables. At the national scale, values below -1 are considered low social vulnerability, -1 to +1 are medium, and above +1 are high. The value here is an average of the social vulnerability score within the unprotected floodplain of the currently selected flood frequency. <a href='https://sc.edu/study/colleges_schools/artsandsciences/centers_and_institutes/hvri/data_and_resources/sovi/' target='_blank'>More info</a>",
    },
  },
  // huc 12 + 1 in 500 year flood
  h12p3: {
    Acres: {
      values: [],
      vis: true,
      min: 94,
      max: 2500,
      info: '<b>Available floodplain area</b><br>Acres of floodplain potentially available for protection & restoration, not including areas within the Protected Areas Database of the U.S. (PAD-US)',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: `<b>Total nitrogen (SPARROW model)</b><br>Kg/yr of nitrogen from within a given watershed exported at the mouth of that watershed (as estimated by USGS SPARROW model), divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-midwest-2012/' target='_blank'>More info</a>`,
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Total phosphorus (SPARROW model)</b><br>Kg/yr of phosphorus from within a given watershed exported at the mouth of that watershed (as estimated by USGS SPARROW model), divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-midwest-2012/' target='_blank'>More info</a>",
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Sediment (SPARROW model)</b><br>MT/yr of suspended sediment from within a given watershed exported at the mouth of that watershed (as estimated by USGS SPARROW model), divided by the watershed's area, and normalized to 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-midwest-2012/' target='_blank'>More info</a>",
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Accumulated sediment (SPARROW model)</b><br>MT/yr of suspended sediment from within a given watershed exported at the mouth of the watershed (as estimated by USGS SPARROW model), accounting for all sediment coming in from upstream, normalized to a 0-100 scale. <a href='https://sparrow.wim.usgs.gov/sparrow-midwest-2012/' target='_blank'>More info</a>",
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Nutrient loading to Gulf of Mexico (SPARROW model)</b><br>Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed's area, and normalized to a 0-100 scale, with the normalized values for nitrogen and phosphorus averaged together. <a href='https://sparrow.wim.usgs.gov/sparrow-midwest-2012/' target='_blank'>More Info</a>",
    },
    NCCPI: {
      values: [],
      vis: true,
      min: 0,
      max: 1,
      info: "The National Commodity Crop Productivity Index (NCCPI) characterizes soil's inherent capacity to produce non-irrigated commodity crops (0-1). Lower value suggests less productive soil, and therefore a more viable opportunity for restoration. <a href='https://www.nrcs.usda.gov/sites/default/files/2023-01/NCCPI-User-Guide.pdf' target='_blank'>More info</a>",
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 825,
      info: '<b>Public Lands Adjacency</b><br>Acres of floodplain in natural land cover within 1/4 mile of protected land. Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 65,
      max: 1914,
      info: "<b>Ecological Significance Ranking</b><br>Acres of floodplain in natural cover within an ecologically significant area (significance ranking 4 or above). Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2011_EAI_eco_significance.pdf' target='_blank'>More Info</a>",
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: "<b>At-Risk Wetland Species</b><br>Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/ESN/Totalnumberofatriskwetlandspecies.pdf' target='_blank'>More Info</a>",
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 1.686,
      max: 3.622,
      step: 0.001,
      shfld: true,
      info: "<b>National Fish Habitat Partnership Cumulative Habitat Condition Index</b><br>Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. <a href='https://www.usgs.gov/data/national-fish-habitat-partnership-nfhp-2015-cumulative-habitat-condition-indices-limiting-and' target='_blank'>More Info</a>",
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 37,
      shfld: true,
      info: '<b>Number of federally endangered species</b><br>This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 14,
      max: 384,
      info: "<b>Population exposed to floods (present-day)</b><br>Number of people currently living in unprotected floodplain of the currently selected flood frequency. Population determined using land-cover-weighted allocation of population. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/Supplemental/DasymetricAllocationofPopulation.pdf' target='_blank'>More info</a>",
    },
    pop5: {
      vis: false,
    },
    pop100: {
      vis: false,
    },
    pop500: {
      values: [],
      vis: true,
      min: 145,
      max: 4476,
      shfld: true,
      info: "People currently living in the floodplain of the selected flood frequency, in all land covers.  <a href='https://www.epa.gov/enviroatlas/dasymetric-toolbox' target='_blank'>More Info</a>",
    },
    pop2050: {
      values: [],
      vis: true,
      min: 42,
      max: 721,
      info: "<b>Population exposed to floods (2050)</b><br>People expected to be living in forest/wetland floodplain of the selected flood frequency in 2050. <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More Info</a>",
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 3928452,
      max: 150000000,
      info: "<b>Potential Future Flood Damages to Structures (2050) ($)</b><br>Estimate of property damage in the floodplain corresponding to the currently selected flood frequency, given flood depth and projected 2050 land use / building type, according to a fossil-fuel-driven socioeconomic development scenario (SSP5). SSP scenario descriptions are available <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>here</a>. Estimated using the methods in Wing et al. (2018). <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More info</a>",
    },
    SOVI: {
      values: [],
      vis: true,
      min: -2.166,
      max: -0.458,
      step: 0.001,
      shfld: true,
      info: "<b>Index of social vulnerability to environmental hazards</b><br>Index characterizing social vulnerability to environmental hazards, drawing on 22 demographic variables. At the national scale, values below -1 are considered low social vulnerability, -1 to +1 are medium, and above +1 are high. The value here is an average of the social vulnerability score within the unprotected floodplain of the currently selected flood frequency. <a href='https://sc.edu/study/colleges_schools/artsandsciences/centers_and_institutes/hvri/data_and_resources/sovi/' target='_blank'>More info</a>",
    },
  },

  // // huc 12 + restoration + 1 in 5 year flood
  // h12r1: {
  //   Acres: {
  //     values: [],
  //     vis: true,
  //     min: 2,
  //     max: 712,
  //     info: '<b>Available floodplain area for given flood frequency and management action</b><br>Area of floodplain in ag or potentially grazed land that could potentially be restored.',
  //   },
  //   TN: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Total nitrogen (SWAT model)</b><br>Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   TP: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Total phosphorus (SWAT model)</b><br>Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   Sed: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Sediment (SWAT model)</b><br>Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   SedAcc: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Accumulated sediment (SWAT model)</b><br>Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   DINCY: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Nutrient loading to Gulf of Mexico (SPARROW model)</b><br>Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   NCCPI: {
  //     values: [],
  //     vis: true,
  //     min: 0.147,
  //     max: 0.599,
  //     step: 0.001,
  //     info: "<b>Agricultural productivity potential of soils</b><br>The National Commodity Crop Productivity Index (NCCPI) characterizes soil's inherent capacity to produce non-irrigated commodity crops (0-1). Lower value suggests less productive soil, and therefore a more viable opportunity for restoration.",
  //   },
  //   adjProt: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 98,
  //     info: '<b>Public Lands Adjacency</b><br>Acres of floodplain within 1/4 mile of protected land. Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
  //   },
  //   EcoSig: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 217,
  //     info: "<b>Ecological Significance Ranking</b><br>Acres of floodplain in ag or potentially grazed land within an ecologically significant area (significance ranking 4 or above). Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2011_EAI_eco_significance.pdf' target='_blank'>More Info</a>",
  //   },
  //   WT_TOT: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 2,
  //     shfld: true,
  //     info: "<b>At-Risk Wetland Species</b><br>Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/ESN/Totalnumberofatriskwetlandspecies.pdf' target='_blank'>More Info</a>",
  //   },
  //   cumu_hci: {
  //     values: [],
  //     vis: true,
  //     min: 1.686,
  //     max: 3.622,
  //     step: 0.001,
  //     shfld: true,
  //     info: "<b>National Fish Habitat Partnership Cumulative Habitat Condition Index</b><br>Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric. <a href='http://assessment.fishhabitat.org/#578a9a48e4b0c1aacab8976c/578a99f4e4b0c1aacab89699' target='_blank'>More Info</a>",
  //   },
  //   HPFedEnd: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 37,
  //     shfld: true,
  //     info: '<b>Number of federally endangered species</b><br>This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
  //   },
  //   popnow: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 17,
  //     info: '<b>Population exposed to floods (present-day)</b><br>People currently living in ag/pasture floodplain of the selected flood frequency.',
  //   },
  //   pop5: {
  //     values: [],
  //     vis: true,
  //     min: 1,
  //     max: 70,
  //     shfld: true,
  //     info: "People currently living in the floodplain of the selected flood frequency, in all land covers.  <a href='https://www.epa.gov/enviroatlas/dasymetric-toolbox' target='_blank'>More Info</a>",
  //   },
  //   pop100: {
  //     vis: false,
  //   },
  //   pop500: {
  //     vis: false,
  //   },
  //   pop2050: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 62,
  //     info: "<b>Population exposed to floods (2050)</b><br>People expected to be living in ag/pasture floodplain of the selected flood frequency in 2050. <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More Info</a>",
  //   },
  //   Dam2050: {
  //     values: [],
  //     vis: true,
  //     min: 105857,
  //     max: 5013107,
  //     info: "<b>Potential Future Flood Damages to Structures (2050) ($)</b><br>Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
  //   },
  //   SOVI: {
  //     values: [],
  //     vis: true,
  //     min: -2.166,
  //     max: -0.458,
  //     step: 0.001,
  //     shfld: true,
  //     info: "<b>Index of social vulnerability to environmental hazards</b><br>Index characterizing social vulnerability to environmental hazards, drawing on 22 demographic variables. At the national scale, values below -1 are considered low social vulnerability, -1 to +1 are medium, and above +1 are high. <a href='http://artsandsciences.sc.edu/geog/hvri/faq' target='_blank'>More Info</a>",
  //   },
  // },
  // // huc 12 + restoration + 1 in 100 year flood
  // h12r2: {
  //   Acres: {
  //     values: [],
  //     vis: true,
  //     min: 183,
  //     max: 4076,
  //     info: '<b>Available floodplain area for given flood frequency and management action</b><br>Area of floodplain in ag or potentially grazed land that could potentially be restored.',
  //   },
  //   TN: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Total nitrogen (SWAT model)</b><br>Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   TP: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Total phosphorus (SWAT model)</b><br>Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   Sed: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Sediment (SWAT model)</b><br>Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   SedAcc: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Accumulated sediment (SWAT model)</b><br>Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   DINCY: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Nutrient loading to Gulf of Mexico (SPARROW model)</b><br>Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   NCCPI: {
  //     values: [],
  //     vis: true,
  //     min: 0.429,
  //     max: 0.544,
  //     step: 0.001,
  //     info: "<b>Agricultural productivity potential of soils</b>The National Commodity Crop Productivity Index -- an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration.<br>",
  //   },
  //   adjProt: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 554,
  //     info: '<b>Public Lands Adjacency</b><br>Acres of floodplain in ag or potentially grazed land within 1/4 mile of protected land. Protected land includes areas from Protected Areas Database of the U.S. & Great Rivers Greenway infrastructure.',
  //   },
  //   EcoSig: {
  //     values: [],
  //     vis: true,
  //     min: 123,
  //     max: 1343,
  //     info: "<b>Ecological Significance Ranking</b><br>Acres of floodplain in ag or potentially grazed land within an ecologically significant area (significance ranking 4 or above). Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2011_EAI_eco_significance.pdf' target='_blank'>More Info</a>",
  //   },
  //   WT_TOT: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 2,
  //     shfld: true,
  //     info: "<b>At-Risk Wetland Species</b><br>Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/ESN/Totalnumberofatriskwetlandspecies.pdf' target='_blank'>More Info</a>",
  //   },
  //   cumu_hci: {
  //     values: [],
  //     vis: true,
  //     min: 1.686,
  //     max: 3.622,
  //     step: 0.001,
  //     shfld: true,
  //     info: "<b>National Fish Habitat Partnership Cumulative Habitat Condition Index</b><br>Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric. <a href='http://assessment.fishhabitat.org/#578a9a48e4b0c1aacab8976c/578a99f4e4b0c1aacab89699' target='_blank'>More Info</a>",
  //   },
  //   HPFedEnd: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 37,
  //     shfld: true,
  //     info: '<b>Number of federally endangered species</b><br>This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
  //   },
  //   popnow: {
  //     values: [],
  //     vis: true,
  //     min: 14,
  //     max: 270,
  //     info: '<b>Population exposed to floods (present-day)</b><br>People currently living in ag/pasture floodplain of the selected flood frequency.',
  //   },
  //   pop5: {
  //     vis: false,
  //   },
  //   pop100: {
  //     values: [],
  //     vis: true,
  //     min: 90,
  //     max: 1097,
  //     shfld: true,
  //     info: "People currently living in the floodplain of the selected flood frequency, in all land covers.  <a href='https://www.epa.gov/enviroatlas/dasymetric-toolbox' target='_blank'>More Info</a>",
  //   },
  //   pop500: {
  //     vis: false,
  //   },
  //   pop2050: {
  //     values: [],
  //     vis: true,
  //     min: 11,
  //     max: 410,
  //     info: '<b>Population exposed to floods (2050)</b><br>People expected to be living in ag/pasture floodplain of the selected flood frequency in 2050.',
  //   },
  //   Dam2050: {
  //     values: [],
  //     vis: true,
  //     min: 983579,
  //     max: 61200000,
  //     info: "<b>Potential Future Flood Damages to Structures (2050) ($)</b><br>Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
  //   },
  //   SOVI: {
  //     values: [],
  //     vis: true,
  //     min: -2.166,
  //     max: -0.458,
  //     step: 0.001,
  //     shfld: true,
  //     info: "<b>Index of social vulnerability to environmental hazards</b><br>Index characterizing social vulnerability to environmental hazards, drawing on 22 demographic variables. At the national scale, values below -1 are considered low social vulnerability, -1 to +1 are medium, and above +1 are high. <a href='http://artsandsciences.sc.edu/geog/hvri/faq' target='_blank'>More Info</a>",
  //   },
  // },
  // // huc 12 + restoration + 1 in 500 year flood
  // h12r3: {
  //   Acres: {
  //     values: [],
  //     vis: true,
  //     min: 295,
  //     max: 5523,
  //     info: '<b>Available floodplain area for given flood frequency and management action</b><br>Area of floodplain in ag or potentially grazed land that could potentially be restored.',
  //   },
  //   TN: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Total nitrogen (SWAT model)</b><br>Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   TP: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Total phosphorus (SWAT model)</b><br>Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   Sed: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Sediment (SWAT model)</b><br>Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   SedAcc: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Accumulated sediment (SWAT model)</b><br>Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   DINCY: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Nutrient loading to Gulf of Mexico (SPARROW model)</b><br>Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   NCCPI: {
  //     values: [],
  //     vis: true,
  //     min: 0.412,
  //     max: 0.522,
  //     step: 0.001,
  //     info: "<b>Agricultural productivity potential of soils</b>The National Commodity Crop Productivity Index -- an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration.<br>",
  //   },
  //   adjProt: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 651,
  //     info: '<b>Public Lands Adjacency</b><br>Acres of floodplain in ag or potentially grazed land within 1/4 mile of protected land. Protected land includes areas from Protected Areas Database of the U.S. & Great Rivers Greenway infrastructure.',
  //   },
  //   EcoSig: {
  //     values: [],
  //     vis: true,
  //     min: 135,
  //     max: 2319,
  //     info: "<b>Ecological Significance Ranking</b><br>Acres of floodplain in ag or potentially grazed land within an ecologically significant area (significance ranking 4 or above). Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2011_EAI_eco_significance.pdf' target='_blank'>More Info</a>",
  //   },
  //   WT_TOT: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 2,
  //     shfld: true,
  //     info: "<b>At-Risk Wetland Species</b><br>Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/ESN/Totalnumberofatriskwetlandspecies.pdf' target='_blank'>More Info</a>",
  //   },
  //   cumu_hci: {
  //     values: [],
  //     vis: true,
  //     min: 1.686,
  //     max: 3.622,
  //     step: 0.001,
  //     shfld: true,
  //     info: "<b>National Fish Habitat Partnership Cumulative Habitat Condition Index</b><br>Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric. <a href='http://assessment.fishhabitat.org/#578a9a48e4b0c1aacab8976c/578a99f4e4b0c1aacab89699' target='_blank'>More Info</a>",
  //   },
  //   HPFedEnd: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 37,
  //     shfld: true,
  //     info: '<b>Number of federally endangered species</b><br>This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
  //   },
  //   popnow: {
  //     values: [],
  //     vis: true,
  //     min: 32,
  //     max: 731,
  //     info: '<b>Population exposed to floods (present-day)</b><br>People currently living in ag/pasture floodplain of the selected flood frequency.',
  //   },
  //   pop5: {
  //     vis: false,
  //   },
  //   pop100: {
  //     vis: false,
  //   },
  //   pop500: {
  //     values: [],
  //     vis: true,
  //     min: 145,
  //     max: 4476,
  //     shfld: true,
  //     info: "People currently living in the floodplain of the selected flood frequency, in all land covers.  <a href='https://www.epa.gov/enviroatlas/dasymetric-toolbox' target='_blank'>More Info</a>",
  //   },
  //   pop2050: {
  //     values: [],
  //     vis: true,
  //     min: 23,
  //     max: 861,
  //     info: '<b>Population exposed to floods (2050)</b><br>People expected to be living in ag/pasture floodplain of the selected flood frequency in 2050.',
  //   },
  //   Dam2050: {
  //     values: [],
  //     vis: true,
  //     min: 2043340,
  //     max: 134000000,
  //     info: "<b>Potential Future Flood Damages to Structures (2050) ($)</b><br>Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
  //   },
  //   SOVI: {
  //     values: [],
  //     vis: true,
  //     min: -2.166,
  //     max: -0.458,
  //     step: 0.001,
  //     shfld: true,
  //     info: "<b>Index of social vulnerability to environmental hazards</b><br>Index characterizing social vulnerability to environmental hazards, drawing on 22 demographic variables. At the national scale, values below -1 are considered low social vulnerability, -1 to +1 are medium, and above +1 are high. <a href='http://artsandsciences.sc.edu/geog/hvri/faq' target='_blank'>More Info</a>",
  //   },
  // },

  // catchment + 1 in 5 year flood
  catchp1: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 232,
      info: '<b>Available floodplain area for given flood frequency</b><br>Area of floodplain in natural land cover that is not currently in protected status.',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: '<b>Total nitrogen (SWAT model)</b><br>Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: '<b>Total phosphorus (SWAT model)</b>Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.<br>',
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: '<b>Sediment (SWAT model)</b><br>Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: '<b>Accumulated sediment (SWAT model)</b><br>Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Nutrient loading to Gulf of Mexico (SPARROW model)</b><br>Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric. <a href='https://sparrow.wim.usgs.gov/marb/' target='_blank'>More Info</a>",
    },
    NCCPI: {
      values: [],
      vis: true,
      min: 0,
      max: 1,
      info: "The National Commodity Crop Productivity Index (NCCPI) characterizes soil's inherent capacity to produce non-irrigated commodity crops (0-1). Lower value suggests less productive soil, and therefore a more viable opportunity for restoration. <a href='https://www.nrcs.usda.gov/sites/default/files/2023-01/NCCPI-User-Guide.pdf' target='_blank'>More info</a>",
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 94,
      info: '<b>Public Lands Adjacency</b><br>Acres of floodplain in natural land cover within 1/4 mile of protected land. Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 0,
      max: 230,
      info: "<b>Ecological Significance Ranking</b><br>Acres of floodplain in natural cover within an ecologically significant	area (significance ranking 4 or above). Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2011_EAI_eco_significance.pdf' target='_blank'>More Info</a>",
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: "<b>At-Risk Wetland Species</b><br>Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/ESN/Totalnumberofatriskwetlandspecies.pdf' target='_blank'>More Info</a>",
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 1.0,
      max: 4.801,
      step: 0.001,
      shfld: true,
      info: "<b>National Fish Habitat Partnership Cumulative Habitat Condition Index</b><br>Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric. <a href='http://assessment.fishhabitat.org/#578a9a48e4b0c1aacab8976c/578a99f4e4b0c1aacab89699' target='_blank'>More Info</a>",
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 9,
      shfld: true,
      info: '<b>Number of federally endangered species</b><br>This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 5,
      info: "<b>Population exposed to floods (present-day)</b><br>People currently living in forest/wetland/grassland floodplain of the selected flood frequency. <a href='https://www.epa.gov/enviroatlas/dasymetric-toolbox' target='_blank'>More Info</a>",
    },
    pop5: {
      values: [],
      vis: true,
      min: 0,
      max: 21,
      shfld: true,
      info: "People currently living in the floodplain of the selected flood frequency, in all land covers.  <a href='https://www.epa.gov/enviroatlas/dasymetric-toolbox' target='_blank'>More Info</a>",
    },
    pop100: {
      vis: false,
    },
    pop500: {
      vis: false,
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 33,
      info: "<b>Population exposed to floods (2050)</b><br>People expected to be living in forest/wetland/grassland floodplain of the selected flood frequency in 2050. <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More Info</a>",
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 0,
      max: 2315258,
      info: "<b>Potential Future Flood Damages to Structures (2050) ($)</b><br>Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
    },
    SOVI: {
      values: [],
      vis: true,
      min: -3.881,
      max: 1.749,
      step: 0.001,
      shfld: true,
      info: "<b>Index of social vulnerability to environmental hazards</b><br>Index characterizing social vulnerability to environmental hazards, drawing on 22 demographic variables. At the national scale, values below -1 are considered low social vulnerability, -1 to +1 are medium, and above +1 are high. <a href='http://artsandsciences.sc.edu/geog/hvri/faq' target='_blank'>More Info</a>",
    },
  },
  // catchment + 1 in 100 year flood
  catchp2: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 400,
      info: '<b>Available floodplain area for given flood frequency</b><br>Area of floodplain in natural land cover that is not currently in protected status.',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: '<b>Total nitrogen (SWAT model)</b><br>Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: '<b>Total phosphorus (SWAT model)</b><br>Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: '<b>Sediment (SWAT model)</b><br>Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: '<b>Accumulated sediment (SWAT model)</b><br>Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Nutrient loading to Gulf of Mexico (SPARROW model)</b><br>Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric. <a href='https://sparrow.wim.usgs.gov/marb/' target='_blank'>More Info</a>",
    },
    NCCPI: {
      values: [],
      vis: true,
      min: 0,
      max: 1,
      info: "The National Commodity Crop Productivity Index (NCCPI) characterizes soil's inherent capacity to produce non-irrigated commodity crops (0-1). Lower value suggests less productive soil, and therefore a more viable opportunity for restoration. <a href='https://www.nrcs.usda.gov/sites/default/files/2023-01/NCCPI-User-Guide.pdf' target='_blank'>More info</a>",
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 222,
      info: '<b>Public Lands Adjacency</b><br>Acres of floodplain in natural land cover within 1/4 mile of protected land. Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 0,
      max: 396,
      info: "<b>Ecological Significance Ranking</b><br>Acres of floodplain in natural cover within an ecologically significant	area (significance ranking 4 or above). Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2011_EAI_eco_significance.pdf' target='_blank'>More Info</a>",
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: "<b>At-Risk Wetland Species</b><br>Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/ESN/Totalnumberofatriskwetlandspecies.pdf' target='_blank'>More Info</a>",
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 1.0,
      max: 4.801,
      step: 0.001,
      shfld: true,
      info: "<b>National Fish Habitat Partnership Cumulative Habitat Condition Index</b><br>Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric. <a href='http://assessment.fishhabitat.org/#578a9a48e4b0c1aacab8976c/578a99f4e4b0c1aacab89699' target='_blank'>More Info</a>",
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 9,
      shfld: true,
      info: '<b>Number of federally endangered species</b><br>This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 19,
      info: "<b>Population exposed to floods (present-day)</b><br>People currently living in forest/wetland floodplain of the selected flood frequency. <a href='https://www.epa.gov/enviroatlas/dasymetric-toolbox' target='_blank'>More Info</a>",
    },
    pop5: {
      vis: false,
    },
    pop100: {
      values: [],
      vis: true,
      min: 0,
      max: 745,
      shfld: true,
      info: "People currently living in the floodplain of the selected flood frequency, in all land covers.  <a href='https://www.epa.gov/enviroatlas/dasymetric-toolbox' target='_blank'>More Info</a>",
    },
    pop500: {
      vis: false,
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 136,
      info: "<b>Population exposed to floods (2050)</b><br>People expected to be living in forest/wetland floodplain of the selected flood frequency in 2050. <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More Info</a>",
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 0,
      max: 27400000,
      info: "<b>Potential Future Flood Damages to Structures (2050) ($)</b><br>Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
    },
    SOVI: {
      values: [],
      vis: true,
      min: -3.881,
      max: 1.749,
      step: 0.001,
      shfld: true,
      info: "<b>Index of social vulnerability to environmental hazards</b><br>Index characterizing social vulnerability to environmental hazards, drawing on 22 demographic variables. At the national scale, values below -1 are considered low social vulnerability, -1 to +1 are medium, and above +1 are high. <a href='http://artsandsciences.sc.edu/geog/hvri/faq' target='_blank'>More Info</a>",
    },
  },
  // catchment + 1 in 500 year flood
  catchp3: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 454,
      info: '<b>Available floodplain area for given flood frequency</b><br>Area of floodplain in natural land cover that is not currently in protected status.',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: '<b>Total nitrogen (SWAT model)</b><br>Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: '<b>Total phosphorus (SWAT model)</b>Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: '<b>Sediment (SWAT model)</b><br>Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: '<b>Accumulated sediment (SWAT model)</b><br>Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "<b>Nutrient loading to Gulf of Mexico (SPARROW model)</b><br>Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric. <a href='https://sparrow.wim.usgs.gov/marb/' target='_blank'>More Info</a>",
    },
    NCCPI: {
      values: [],
      vis: true,
      min: 0,
      max: 1,
      info: "The National Commodity Crop Productivity Index (NCCPI) characterizes soil's inherent capacity to produce non-irrigated commodity crops (0-1). Lower value suggests less productive soil, and therefore a more viable opportunity for restoration. <a href='https://www.nrcs.usda.gov/sites/default/files/2023-01/NCCPI-User-Guide.pdf' target='_blank'>More info</a>",
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 254,
      info: '<b>Public Lands Adjacency</b><br>Acres of floodplain in natural land cover within 1/4 mile of protected land. Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 0,
      max: 447,
      info: "<b>Ecological Significance Ranking</b><br>Acres of floodplain in natural cover within an ecologically significant	area (significance ranking 4 or above). Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2011_EAI_eco_significance.pdf' target='_blank'>More Info</a>",
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: "<b>At-Risk Wetland Species</b><br>Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/ESN/Totalnumberofatriskwetlandspecies.pdf' target='_blank'>More Info</a>",
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 1.0,
      max: 4.801,
      step: 0.001,
      shfld: true,
      info: "<b>National Fish Habitat Partnership Cumulative Habitat Condition Index</b><br>Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric. <a href='http://assessment.fishhabitat.org/#578a9a48e4b0c1aacab8976c/578a99f4e4b0c1aacab89699' target='_blank'>More Info</a>",
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 9,
      shfld: true,
      info: '<b>Number of federally endangered species</b><br>This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 46,
      info: "<b>Population exposed to floods (present-day)</b><br>People currently living in forest/wetland floodplain of the selected flood frequency. <a href='https://www.epa.gov/enviroatlas/dasymetric-toolbox' target='_blank'>More Info</a>",
    },
    pop5: {
      vis: false,
    },
    pop100: {
      vis: false,
    },
    pop500: {
      values: [],
      vis: true,
      min: 0,
      max: 1503,
      shfld: true,
      info: "People currently living in the floodplain of the selected flood frequency, in all land covers.  <a href='https://www.epa.gov/enviroatlas/dasymetric-toolbox' target='_blank'>More Info</a>",
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 154,
      info: "<b>Population exposed to floods (2050)</b><br>People expected to be living in forest/wetland floodplain of the selected flood frequency in 2050. <a href='https://iopscience.iop.org/article/10.1088/1748-9326/aaac65' target='_blank'>More Info</a>",
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 0,
      max: 40200000,
      info: "<b>Potential Future Flood Damages to Structures (2050) ($)</b><br>Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
    },
    SOVI: {
      values: [],
      vis: true,
      min: -3.881,
      max: 1.749,
      step: 0.001,
      shfld: true,
      info: "<b>Index of social vulnerability to environmental hazards</b><br>Index characterizing social vulnerability to environmental hazards, drawing on 22 demographic variables. At the national scale, values below -1 are considered low social vulnerability, -1 to +1 are medium, and above +1 are high. <a href='http://artsandsciences.sc.edu/geog/hvri/faq' target='_blank'>More Info</a>",
    },
  },
  // // catchment + restoration + 1 in 5 year flood
  // catchr1: {
  //   Acres: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 159,
  //     info: '<b>Available floodplain area for given flood frequency and management action</b><br>Area of floodplain in ag or potentially grazed land that could potentially be restored.',
  //   },
  //   TN: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Total nitrogen (SWAT model)</b><br>Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   TP: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Total phosphorus (SWAT model)</b><br>Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   Sed: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Sediment (SWAT model)</b><br>Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   SedAcc: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Accumulated sediment (SWAT model)</b><br>Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   DINCY: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Nutrient loading to Gulf of Mexico (SPARROW model)</b><br>Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   NCCPI: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 0.746,
  //     step: 0.001,
  //     info: "<b>Agricultural productivity potential of soils</b>The National Commodity Crop Productivity Index -- an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration.<br>",
  //   },
  //   adjProt: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 39,
  //     info: '<b>Public Lands Adjacency</b><br>Acres of floodplain in ag or potentially grazed land within 1/4 mile of protected land. Protected land includes areas from Protected Areas Database of the U.S. & Great Rivers Greenway infrastructure.',
  //   },
  //   EcoSig: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 75,
  //     info: "<b>Ecological Significance Ranking</b><br>Acres of floodplain in ag or potentially grazed land within an ecologically significant area (significance ranking 4 or above). Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2011_EAI_eco_significance.pdf' target='_blank'>More Info</a>",
  //   },
  //   WT_TOT: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 2,
  //     shfld: true,
  //     info: "<b>At-Risk Wetland Species</b><br>Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/ESN/Totalnumberofatriskwetlandspecies.pdf' target='_blank'>More Info</a>",
  //   },
  //   cumu_hci: {
  //     values: [],
  //     vis: true,
  //     min: 1.0,
  //     max: 4.801,
  //     step: 0.001,
  //     shfld: true,
  //     info: "<b>National Fish Habitat Partnership Cumulative Habitat Condition Index</b><br>Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric. <a href='http://assessment.fishhabitat.org/#578a9a48e4b0c1aacab8976c/578a99f4e4b0c1aacab89699' target='_blank'>More Info</a>",
  //   },
  //   HPFedEnd: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 9,
  //     shfld: true,
  //     info: '<b>Number of federally endangered species</b><br>This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
  //   },
  //   popnow: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 12,
  //     info: '<b>Population exposed to floods (present-day)</b><br>People currently living in ag/pasture floodplain of the selected flood frequency.',
  //   },
  //   pop5: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 21,
  //     shfld: true,
  //     info: "People currently living in the floodplain of the selected flood frequency, in all land covers.  <a href='https://www.epa.gov/enviroatlas/dasymetric-toolbox' target='_blank'>More Info</a>",
  //   },
  //   pop100: {
  //     vis: false,
  //   },
  //   pop500: {
  //     vis: false,
  //   },
  //   pop2050: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 19,
  //     info: '<b>Population exposed to floods (2050)</b><br>People expected to be living in ag/pasture floodplain of the selected flood frequency in 2050.',
  //   },
  //   Dam2050: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 2797809,
  //     info: "<b>Potential Future Flood Damages to Structures (2050) ($)</b><br>Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
  //   },
  //   SOVI: {
  //     values: [],
  //     vis: true,
  //     min: -3.881,
  //     max: 1.749,
  //     step: 0.001,
  //     shfld: true,
  //     info: "<b>Index of social vulnerability to environmental hazards</b><br>Index characterizing social vulnerability to environmental hazards, drawing on 22 demographic variables. At the national scale, values below -1 are considered low social vulnerability, -1 to +1 are medium, and above +1 are high. <a href='http://artsandsciences.sc.edu/geog/hvri/faq' target='_blank'>More Info</a>",
  //   },
  // },
  // // catchment + restoration + 1 in 100 year flood
  // catchr2: {
  //   Acres: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 636,
  //     info: '<b>Available floodplain area for given flood frequency and management action</b><br>Area of floodplain in ag or potentially grazed land that could potentially be restored.',
  //   },
  //   TN: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Total nitrogen (SWAT model)</b><br>Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   TP: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Total phosphorus (SWAT model)</b><br>Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   Sed: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Sediment (SWAT model)</b><br>Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   SedAcc: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Accumulated sediment (SWAT model)</b><br>Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   DINCY: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Nutrient loading to Gulf of Mexico (SPARROW model)</b><br>Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   NCCPI: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 0.764,
  //     step: 0.001,
  //     info: "<b>Agricultural productivity potential of soils</b>The National Commodity Crop Productivity Index -- an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration.<br>",
  //   },
  //   adjProt: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 172,
  //     info: '<b>Public Lands Adjacency</b><br>Acres of floodplain in ag or potentially grazed land within 1/4 mile of protected land. Protected land includes areas from Protected Areas Database of the U.S. & Great Rivers Greenway infrastructure.',
  //   },
  //   EcoSig: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 186,
  //     info: "<b>Ecological Significance Ranking</b><br>Acres of floodplain in ag or potentially grazed land within an ecologically significant area (significance ranking 4 or above). Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2011_EAI_eco_significance.pdf' target='_blank'>More Info</a>",
  //   },
  //   WT_TOT: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 2,
  //     shfld: true,
  //     info: "<b>At-Risk Wetland Species</b><br>Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/ESN/Totalnumberofatriskwetlandspecies.pdf' target='_blank'>More Info</a>",
  //   },
  //   cumu_hci: {
  //     values: [],
  //     vis: true,
  //     min: 1.0,
  //     max: 4.801,
  //     step: 0.001,
  //     shfld: true,
  //     info: "<b>National Fish Habitat Partnership Cumulative Habitat Condition Index</b><br>Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric. <a href='http://assessment.fishhabitat.org/#578a9a48e4b0c1aacab8976c/578a99f4e4b0c1aacab89699' target='_blank'>More Info</a>",
  //   },
  //   HPFedEnd: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 9,
  //     shfld: true,
  //     info: '<b>Number of federally endangered species</b><br>This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
  //   },
  //   popnow: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 95,
  //     info: '<b>Population exposed to floods (present-day)</b><br>People currently living in ag/pasture floodplain of the selected flood frequency.',
  //   },
  //   pop5: {
  //     vis: false,
  //   },
  //   pop100: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 745,
  //     shfld: true,
  //     info: "People currently living in the floodplain of the selected flood frequency, in all land covers.  <a href='https://www.epa.gov/enviroatlas/dasymetric-toolbox' target='_blank'>More Info</a>",
  //   },
  //   pop500: {
  //     vis: false,
  //   },
  //   pop2050: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 155,
  //     info: '<b>Population exposed to floods (2050)</b><br>People expected to be living in ag/pasture floodplain of the selected flood frequency in 2050.',
  //   },
  //   Dam2050: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 19500000,
  //     info: "<b>Potential Future Flood Damages to Structures (2050) ($)</b><br>Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
  //   },
  //   SOVI: {
  //     values: [],
  //     vis: true,
  //     min: -3.881,
  //     max: 1.749,
  //     step: 0.001,
  //     shfld: true,
  //     info: "<b>Index of social vulnerability to environmental hazards</b><br>Index characterizing social vulnerability to environmental hazards, drawing on 22 demographic variables. At the national scale, values below -1 are considered low social vulnerability, -1 to +1 are medium, and above +1 are high. <a href='http://artsandsciences.sc.edu/geog/hvri/faq' target='_blank'>More Info</a>",
  //   },
  // },
  // // catchment + restoration + 1 in 500 year flood
  // catchr3: {
  //   Acres: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 965,
  //     info: '<b>Available floodplain area for given flood frequency and management action</b><br>Area of floodplain in ag or potentially grazed land that could potentially be restored.',
  //   },
  //   TN: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Total nitrogen (SWAT model)</b><br>Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   TP: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Total phosphorus (SWAT model)</b><br>Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   Sed: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Sediment (SWAT model)</b><br>Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   SedAcc: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Accumulated sediment (SWAT model)</b><br>Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   DINCY: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 100,
  //     info: '<b>Nutrient loading to Gulf of Mexico (SPARROW model)</b><br>Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For restoration priorities, identify catchments <i>higher</i> in this metric.',
  //   },
  //   NCCPI: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 0.764,
  //     step: 0.001,
  //     info: "<b>Agricultural productivity potential of soils</b>The National Commodity Crop Productivity Index -- an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration.<br>",
  //   },
  //   adjProt: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 191,
  //     info: '<b>Public Lands Adjacency</b><br>Acres of floodplain in ag or potentially grazed land within 1/4 mile of protected land. Protected land includes areas from Protected Areas Database of the U.S. & Great Rivers Greenway infrastructure.',
  //   },
  //   EcoSig: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 297,
  //     info: "<b>Ecological Significance Ranking</b><br>Acres of floodplain in ag or potentially grazed land within an ecologically significant area (significance ranking 4 or above). Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2011_EAI_eco_significance.pdf' target='_blank'>More Info</a>",
  //   },
  //   WT_TOT: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 2,
  //     shfld: true,
  //     info: "<b>At-Risk Wetland Species</b><br>Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act. <a href='https://enviroatlas.epa.gov/enviroatlas/DataFactSheets/pdf/ESN/Totalnumberofatriskwetlandspecies.pdf' target='_blank'>More Info</a>",
  //   },
  //   cumu_hci: {
  //     values: [],
  //     vis: true,
  //     min: 1.0,
  //     max: 4.801,
  //     step: 0.001,
  //     shfld: true,
  //     info: "<b>National Fish Habitat Partnership Cumulative Habitat Condition Index</b><br>Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric. <a href='http://assessment.fishhabitat.org/#578a9a48e4b0c1aacab8976c/578a99f4e4b0c1aacab89699' target='_blank'>More Info</a>",
  //   },
  //   HPFedEnd: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 9,
  //     shfld: true,
  //     info: '<b>Number of federally endangered species</b><br>This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
  //   },
  //   popnow: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 437,
  //     info: '<b>Population exposed to floods (present-day)</b><br>People currently living in ag/pasture floodplain of the selected flood frequency.',
  //   },
  //   pop5: {
  //     vis: false,
  //   },
  //   pop100: {
  //     vis: false,
  //   },
  //   pop500: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 1503,
  //     shfld: true,
  //     info: "People currently living in the floodplain of the selected flood frequency, in all land covers.  <a href='https://www.epa.gov/enviroatlas/dasymetric-toolbox' target='_blank'>More Info</a>",
  //   },
  //   pop2050: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 254,
  //     info: '<b>Population exposed to floods (2050)</b><br>People expected to be living in ag/pasture floodplain of the selected flood frequency in 2050.',
  //   },
  //   Dam2050: {
  //     values: [],
  //     vis: true,
  //     min: 0,
  //     max: 52300000,
  //     info: "<b>Potential Future Flood Damages to Structures (2050) ($)</b><br>Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
  //   },
  //   SOVI: {
  //     values: [],
  //     vis: true,
  //     min: -3.881,
  //     max: 1.749,
  //     step: 0.001,
  //     shfld: true,
  //     info: "<b>Index of social vulnerability to environmental hazards</b><br>Index characterizing social vulnerability to environmental hazards, drawing on 22 demographic variables. At the national scale, values below -1 are considered low social vulnerability, -1 to +1 are medium, and above +1 are high. <a href='http://artsandsciences.sc.edu/geog/hvri/faq' target='_blank'>More Info</a>",
  //   },
  // },
});

// object for radio groups
const radioObj = {
  // huc 12 + protection + 1 in 5 year flood
  h12p1: {
    impWet: {
      vis: true,
      info: "<b>Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI _wetland_importance.pdf' target='_blank'>More Info</a>",
    },
    fprank: {
      vis: false,
    },
    inIBA: {
      vis: true,
      info: "<b>Important Bird Areas</b></br>Whether any floodplain is located in sites identified by Audubon as having significance for the conservation of birds & supporting rare and endangered species, as well as globally important concentrations of non-endangered species. <a href='https://www.audubon.org/important-bird-areas' target='_blank'>More Info</a>",
    },
    ABCcorr: {
      vis: true,
      shfld: true,
      info: "<b>American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>Whether any floodplain is located in key bird migration corridors and habitat for birds on the Red WatchList. <a href='https://www.sciencebase.gov/catalog/item/58497c09e4b06d80b7b09483' target='_blank'>More Info</a>",
    },
    anyHab: {
      vis: true,
      info: '<b>Whether there is floodplain in an Important Bird Area, or the watershed contains at-risk wetland species, or there is floodplain in an American Bird Conservancy corridor.',
    },
  },
  // huc 12 + protection + 1 in 100 year flood
  h12p2: {
    impWet: {
      vis: true,
      info: "<b>Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI _wetland_importance.pdf' target='_blank'>More Info</a>",
    },
    fprank: {
      vis: false,
    },
    inIBA: {
      vis: true,
      info: "<b>Important Bird Areas</b></br>Sites identified by Audubon as having significance for the conservation of birds, supporting rare and endangered species as well as globally important concentrations of non-endangered species. <a href='https://www.audubon.org/important-bird-areas' target='_blank'>More Info</a>",
    },
    ABCcorr: {
      vis: true,
      shfld: true,
      info: "<b>American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>This layer represents key bird migration corridors and habitat for birds on the Red WatchList. <a href='https://www.sciencebase.gov/catalog/item/58497c09e4b06d80b7b09483' target='_blank'>More Info</a>",
    },
    anyHab: {
      vis: true,
      info: '<b>In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },
  // huc 12 + protection + 1 in 500 year flood
  h12p3: {
    impWet: {
      vis: true,
      info: "<b>Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI _wetland_importance.pdf' target='_blank'>More Info</a>",
    },
    fprank: {
      vis: false,
    },
    inIBA: {
      vis: true,
      info: "<b>Important Bird Areas</b></br>Sites identified by Audubon as having significance for the conservation of birds, supporting rare and endangered species as well as globally important concentrations of non-endangered species. <a href='https://www.audubon.org/important-bird-areas' target='_blank'>More Info</a>",
    },
    ABCcorr: {
      vis: true,
      shfld: true,
      info: "<b>American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>This layer represents key bird migration corridors and habitat for birds on the Red WatchList. <a href='https://www.sciencebase.gov/catalog/item/58497c09e4b06d80b7b09483' target='_blank'>More Info</a>",
    },
    anyHab: {
      vis: true,
      info: '<b>In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },
  // // huc 12 + restoration + 1 in 5 year flood
  // h12r1: {
  //   impWet: {
  //     vis: true,
  //     info: "<b>Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI _wetland_importance.pdf' target='_blank'>More Info</a>",
  //   },
  //   fprank: {
  //     vis: true,
  //     info: "<b>Floodplain Restoration Rank</b><br>Watershed contains floodplain in an area of floodplain restoration rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI_restoration.pdf' target='_blank'>More Info</a>",
  //   },
  //   inIBA: {
  //     vis: true,
  //     info: "<b>Important Bird Areas</b></br>Sites identified by Audubon as having significance for the conservation of birds, supporting rare and endangered species as well as globally important concentrations of non-endangered species. <a href='https://www.audubon.org/important-bird-areas' target='_blank'>More Info</a>",
  //   },
  //   ABCcorr: {
  //     vis: true,
  //     shfld: true,
  //     info: "<b>American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>This layer represents key bird migration corridors and habitat for birds on the Red WatchList. <a href='https://www.sciencebase.gov/catalog/item/58497c09e4b06d80b7b09483' target='_blank'>More Info</a>",
  //   },
  //   anyHab: {
  //     vis: true,
  //     info: '<b>In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
  //   },
  // },
  // // huc 12 + restoration + 1 in 100 year flood
  // h12r2: {
  //   impWet: {
  //     vis: true,
  //     info: "<b>Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI _wetland_importance.pdf' target='_blank'>More Info</a>",
  //   },
  //   fprank: {
  //     vis: true,
  //     info: "<b>Floodplain Restoration Rank</b><br>Watershed contains floodplain in an area of floodplain restoration rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI_restoration.pdf' target='_blank'>More Info</a>",
  //   },
  //   inIBA: {
  //     vis: true,
  //     info: "<b>Important Bird Areas</b></br>Sites identified by Audubon as having significance for the conservation of birds, supporting rare and endangered species as well as globally important concentrations of non-endangered species. <a href='https://www.audubon.org/important-bird-areas' target='_blank'>More Info</a>",
  //   },
  //   ABCcorr: {
  //     vis: true,
  //     shfld: true,
  //     info: "<b>American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>This layer represents key bird migration corridors and habitat for birds on the Red WatchList. <a href='https://www.sciencebase.gov/catalog/item/58497c09e4b06d80b7b09483' target='_blank'>More Info</a>",
  //   },
  //   anyHab: {
  //     vis: true,
  //     info: '<b>In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
  //   },
  // },
  // // huc 12 + restoration + 1 in 500 year flood
  // h12r3: {
  //   impWet: {
  //     vis: true,
  //     info: "<b>Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI _wetland_importance.pdf' target='_blank'>More Info</a>",
  //   },
  //   fprank: {
  //     vis: true,
  //     info: "<b>Floodplain Restoration Rank</b><br>Watershed contains floodplain in an area of floodplain restoration rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI_restoration.pdf' target='_blank'>More Info</a>",
  //   },
  //   inIBA: {
  //     vis: true,
  //     info: "<b>Important Bird Areas</b></br>Sites identified by Audubon as having significance for the conservation of birds, supporting rare and endangered species as well as globally important concentrations of non-endangered species. <a href='https://www.audubon.org/important-bird-areas' target='_blank'>More Info</a>",
  //   },
  //   ABCcorr: {
  //     vis: true,
  //     shfld: true,
  //     info: "<b>American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>This layer represents key bird migration corridors and habitat for birds on the Red WatchList. <a href='https://www.sciencebase.gov/catalog/item/58497c09e4b06d80b7b09483' target='_blank'>More Info</a>",
  //   },
  //   anyHab: {
  //     vis: true,
  //     info: '<b>In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
  //   },
  // },
  // catchment + protection + 1 in 5 year flood
  catchp1: {
    impWet: {
      vis: true,
      info: "<b>Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI _wetland_importance.pdf' target='_blank'>More Info</a>",
    },
    fprank: {
      vis: false,
    },
    inIBA: {
      vis: true,
      info: "<b>Important Bird Areas</b></br>Sites identified by Audubon as having significance for the conservation of birds, supporting rare and endangered species as well as globally important concentrations of non-endangered species. <a href='https://www.audubon.org/important-bird-areas' target='_blank'>More Info</a>",
    },
    ABCcorr: {
      vis: true,
      shfld: true,
      info: "<b>American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>This layer represents key bird migration corridors and habitat for birds on the Red WatchList. <a href='https://www.sciencebase.gov/catalog/item/58497c09e4b06d80b7b09483' target='_blank'>More Info</a>",
    },
    anyHab: {
      vis: true,
      info: '<b>In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },
  // catchment + protection + 1 in 100 year flood
  catchp2: {
    impWet: {
      vis: true,
      info: "<b>Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI _wetland_importance.pdf' target='_blank'>More Info</a>",
    },
    fprank: {
      vis: false,
    },
    inIBA: {
      vis: true,
      info: "<b>Important Bird Areas</b></br>Sites identified by Audubon as having significance for the conservation of birds, supporting rare and endangered species as well as globally important concentrations of non-endangered species. <a href='https://www.audubon.org/important-bird-areas' target='_blank'>More Info</a>",
    },
    ABCcorr: {
      vis: true,
      shfld: true,
      info: "<b>American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>This layer represents key bird migration corridors and habitat for birds on the Red WatchList. <a href='https://www.sciencebase.gov/catalog/item/58497c09e4b06d80b7b09483' target='_blank'>More Info</a>",
    },
    anyHab: {
      vis: true,
      info: '<b>In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },
  // catchment + protection + 1 in 500 year flood
  catchp3: {
    impWet: {
      vis: true,
      info: "<b>Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI _wetland_importance.pdf' target='_blank'>More Info</a>",
    },
    fprank: {
      vis: false,
    },
    inIBA: {
      vis: true,
      info: "<b>Important Bird Areas</b></br>Sites identified by Audubon as having significance for the conservation of birds, supporting rare and endangered species as well as globally important concentrations of non-endangered species. <a href='https://www.audubon.org/important-bird-areas' target='_blank'>More Info</a>",
    },
    ABCcorr: {
      vis: true,
      shfld: true,
      info: "<b>American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>This layer represents key bird migration corridors and habitat for birds on the Red WatchList. <a href='https://www.sciencebase.gov/catalog/item/58497c09e4b06d80b7b09483' target='_blank'>More Info</a>",
    },
    anyHab: {
      vis: true,
      info: '<b>In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },
  // // catchment + restoration + 1 in 5 year flood
  // catchr1: {
  //   impWet: {
  //     vis: true,
  //     info: "<b>Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI _wetland_importance.pdf' target='_blank'>More Info</a>",
  //   },
  //   fprank: {
  //     vis: true,
  //     info: "<b>Floodplain Restoration Rank</b><br>Watershed contains floodplain in an area of floodplain restoration rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI_restoration.pdf' target='_blank'>More Info</a>",
  //   },
  //   inIBA: {
  //     vis: true,
  //     info: "<b>Important Bird Areas</b></br>Sites identified by Audubon as having significance for the conservation of birds, supporting rare and endangered species as well as globally important concentrations of non-endangered species. <a href='https://www.audubon.org/important-bird-areas' target='_blank'>More Info</a>",
  //   },
  //   ABCcorr: {
  //     vis: true,
  //     shfld: true,
  //     info: "<b>American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>This layer represents key bird migration corridors and habitat for birds on the Red WatchList. <a href='https://www.sciencebase.gov/catalog/item/58497c09e4b06d80b7b09483' target='_blank'>More Info</a>",
  //   },
  //   anyHab: {
  //     vis: true,
  //     info: '<b>In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
  //   },
  // },
  // // catchment + restoration + 1 in 100 year flood
  // catchr2: {
  //   impWet: {
  //     vis: true,
  //     info: "<b>Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI _wetland_importance.pdf' target='_blank'>More Info</a>",
  //   },
  //   fprank: {
  //     vis: true,
  //     info: "<b>Floodplain Restoration Rank</b><br>Watershed contains floodplain in an area of floodplain restoration rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI_restoration.pdf' target='_blank'>More Info</a>",
  //   },
  //   inIBA: {
  //     vis: true,
  //     info: "<b>Important Bird Areas</b></br>Sites identified by Audubon as having significance for the conservation of birds, supporting rare and endangered species as well as globally important concentrations of non-endangered species. <a href='https://www.audubon.org/important-bird-areas' target='_blank'>More Info</a>",
  //   },
  //   ABCcorr: {
  //     vis: true,
  //     shfld: true,
  //     info: "<b>American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>This layer represents key bird migration corridors and habitat for birds on the Red WatchList. <a href='https://www.sciencebase.gov/catalog/item/58497c09e4b06d80b7b09483' target='_blank'>More Info</a>",
  //   },
  //   anyHab: {
  //     vis: true,
  //     info: '<b>In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
  //   },
  // },
  // // catchment + restoration + 1 in 500 year flood
  // catchr3: {
  //   impWet: {
  //     vis: true,
  //     info: "<b>Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI _wetland_importance.pdf' target='_blank'>More Info</a>",
  //   },
  //   fprank: {
  //     vis: true,
  //     info: "<b>Floodplain Restoration Rank</b><br>Watershed contains floodplain in an area of floodplain restoration rank 5 or above. Data provided by the East-West Gateway Council of Governments. <a href='plugins/floodplain-explorer/2015_EAI_restoration.pdf' target='_blank'>More Info</a>",
  //   },
  //   inIBA: {
  //     vis: true,
  //     info: "<b>Important Bird Areas</b></br>Sites identified by Audubon as having significance for the conservation of birds, supporting rare and endangered species as well as globally important concentrations of non-endangered species. <a href='https://www.audubon.org/important-bird-areas' target='_blank'>More Info</a>",
  //   },
  //   ABCcorr: {
  //     vis: true,
  //     shfld: true,
  //     info: "<b>American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>This layer represents key bird migration corridors and habitat for birds on the Red WatchList. <a href='https://www.sciencebase.gov/catalog/item/58497c09e4b06d80b7b09483' target='_blank'>More Info</a>",
  //   },
  //   anyHab: {
  //     vis: true,
  //     info: '<b>In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
  //   },
  // },
};

function updateCheckbox(option, sliderVals) {
  if (option.type == 'slider') {
    if (option.checkboxModel.value == false) {
      option.checkboxModel.value = true;
      ms.selectedFilters.push(option.field);
      ms.pdfFilters.push(option);

      ms.pdfFilters.forEach((c) => {
        if (c.field == option.field) {
          c.min = sliderVals.min;
          c.max = sliderVals.max;
        }
      });

      // fields that dont have ffmodel
      //   water quality fields
      //

      if (
        option.field == 'WT_TOT' ||
        option.field == 'cumu_hci' ||
        option.field == 'HPFedEnd' ||
        option.field == 'SOVI'
      ) {
        ms.activeFilters.push({
          id: option.field,
          exp:
            option.field +
            ' >= ' +
            sliderVals.min +
            ' AND ' +
            option.field +
            ' <= ' +
            sliderVals.max,
        });
      } else if (option.field == 'NCCPI') {
        if (ms.ffModel == 4) {
          ms.activeFilters.push({
            id: option.field,
            exp:
              option.field +
              '_r1 >= ' +
              sliderVals.min +
              ' AND ' +
              option.field +
              '_r2 <= ' +
              sliderVals.max,
          });
        } else if (ms.ffModel == 5) {
          ms.activeFilters.push({
            id: option.field,
            exp:
              option.field +
              '_r2 >= ' +
              sliderVals.min +
              ' AND ' +
              option.field +
              '_r2 <= ' +
              sliderVals.max,
          });
        } else if (ms.ffModel == 6) {
          ms.activeFilters.push({
            id: option.field,
            exp:
              option.field +
              '_r3 >= ' +
              sliderVals.min +
              ' AND ' +
              option.field +
              '_r3 <= ' +
              sliderVals.max,
          });
        }
      } else {
        if (ms.ffModel == 4 && ms.maModel == 'natural') {
          ms.activeFilters.push({
            id: option.field,
            exp:
              option.field +
              '_p1 >= ' +
              sliderVals.min +
              ' AND ' +
              option.field +
              '_p1 <= ' +
              sliderVals.max,
          });
        } else if (ms.ffModel == 4 && ms.maModel == 'modified') {
          ms.activeFilters.push({
            id: option.field,
            exp:
              option.field +
              '_r1 >= ' +
              sliderVals.min +
              ' AND ' +
              option.field +
              '_r1 <= ' +
              sliderVals.max,
          });
        } else if (ms.ffModel == 5 && ms.maModel == 'natural') {
          ms.activeFilters.push({
            id: option.field,
            exp:
              option.field +
              '_p2 >= ' +
              sliderVals.min +
              ' AND ' +
              option.field +
              '_p2 <= ' +
              sliderVals.max,
          });
        } else if (ms.ffModel == 5 && ms.maModel == 'modified') {
          ms.activeFilters.push({
            id: option.field,
            exp:
              option.field +
              '_r2 >= ' +
              sliderVals.min +
              ' AND ' +
              option.field +
              '_r2 <= ' +
              sliderVals.max,
          });
        } else if (ms.ffModel == 6 && ms.maModel == 'natural') {
          ms.activeFilters.push({
            id: option.field,
            exp:
              option.field +
              '_p3 >= ' +
              sliderVals.min +
              ' AND ' +
              option.field +
              '_p3 <= ' +
              sliderVals.max,
          });
        } else if (ms.ffModel == 6 && ms.maModel == 'modified') {
          ms.activeFilters.push({
            id: option.field,
            exp:
              option.field +
              '_r3 >= ' +
              sliderVals.min +
              ' AND ' +
              option.field +
              '_r3 <= ' +
              sliderVals.max,
          });
        }
      }

      // if ffmodel = 4,5,6
      // for each of those, assign the appropriate _1, _2, _3
      //
    } else {
      option.checkboxModel.value = false;
      ms.activeFilters = ms.activeFilters.filter(
        (item) => item.id !== option.field,
      );
      ms.pdfFilters = ms.pdfFilters.filter(
        (item) => item.label !== option.label,
      );
    }
  } else {
    if (option.checkboxModel.value == false) {
      option.checkboxModel.value = true;
      ms.selectedFilters.push(option.field);
      ms.pdfFilters.push(option);

      if (option.field == 'ABCcorr') {
        ms.activeFilters.push({
          id: option.field,
          exp: option.field + '= 1.00',
        });
      } else if (option.field == 'NCCPI') {
        if (ms.ffModel == 4) {
          ms.activeFilters.push({
            id: option.field,
            exp:
              option.field +
              '_r1 >= ' +
              sliderVals.min +
              ' AND ' +
              option.field +
              '_r2 <= ' +
              sliderVals.max,
          });
        } else if (ms.ffModel == 5) {
          ms.activeFilters.push({
            id: option.field,
            exp:
              option.field +
              '_r2 >= ' +
              sliderVals.min +
              ' AND ' +
              option.field +
              '_r2 <= ' +
              sliderVals.max,
          });
        } else if (ms.ffModel == 6) {
          ms.activeFilters.push({
            id: option.field,
            exp:
              option.field +
              '_r3 >= ' +
              sliderVals.min +
              ' AND ' +
              option.field +
              '_r3 <= ' +
              sliderVals.max,
          });
        }
      } else {
        if (ms.ffModel == 4 && ms.maModel == 'natural') {
          ms.activeFilters.push({
            id: option.field,
            exp: option.field + '_p1 = 1.00',
          });
        } else if (ms.ffModel == 4 && ms.maModel == 'modified') {
          ms.activeFilters.push({
            id: option.field,
            exp: option.field + '_r1 = 1.00',
          });
        } else if (ms.ffModel == 5 && ms.maModel == 'natural') {
          ms.activeFilters.push({
            id: option.field,
            exp: option.field + '_p2 = 1.00',
          });
        } else if (ms.ffModel == 5 && ms.maModel == 'modified') {
          ms.activeFilters.push({
            id: option.field,
            exp: option.field + '_r2 = 1.00',
          });
        } else if (ms.ffModel == 6 && ms.maModel == 'natural') {
          ms.activeFilters.push({
            id: option.field,
            exp: option.field + '_p3 = 1.00',
          });
        } else if (ms.ffModel == 6 && ms.maModel == 'modified') {
          ms.activeFilters.push({
            id: option.field,
            exp: option.field + '_r3 = 1.00',
          });
        }
      }
    } else {
      option.checkboxModel.value = false;
      if (ms.selectedFilters.includes(option.field) == true) {
        ms.selectedFilters = ms.selectedFilters.filter(
          (item) => item !== option.field,
        );
      }
      ms.activeFilters = ms.activeFilters.filter(
        (item) => item.id !== option.field,
      );
      if (ms.pdfFilters.includes(option)) {
        ms.pdfFilters = ms.pdfFilters.filter((item) => item !== option);
      }
    }
  }

  ms.updateDefinitionExpression();
}

function updateRadio(option) {}

function updateSlider(option, val) {
  let stringVal = '';

  ms.pdfFilters.forEach((filter) => {
    if (filter.label == option.label) {
      filter.min = Math.round(val[0]);
      filter.max = Math.round(val[1]);
    }
  });

  if (
    option.field == 'WT_TOT' ||
    option.field == 'cumu_hci' ||
    option.field == 'HPFedEnd' ||
    option.field == 'SOVI'
  ) {
    stringVal =
      option.field +
      ' >= ' +
      Math.round(val[0]) +
      ' AND ' +
      option.field +
      ' <= ' +
      Math.round(val[1]);
  } else if (option.field == 'NCCPI') {
    if (ms.ffModel == 4) {
      stringVal =
        option.field +
        '_r1 >= ' +
        val[0] +
        ' AND ' +
        option.field +
        '_r2 <= ' +
        val[1];
    } else if (ms.ffModel == 5) {
      stringVal =
        option.field +
        '_r2 >= ' +
        val[0] +
        ' AND ' +
        option.field +
        '_r2 <= ' +
        val[1];
    } else if (ms.ffModel == 6) {
      stringVal =
        option.field +
        '_r3 >= ' +
        val[0] +
        ' AND ' +
        option.field +
        '_r3 <= ' +
        val[1];
    }
  } else {
    if (ms.ffModel == 4 && ms.maModel == 'natural') {
      stringVal =
        option.field +
        '_p1 >= ' +
        Math.round(val[0]) +
        ' AND ' +
        option.field +
        '_p1 <= ' +
        Math.round(val[1]);
    } else if (ms.ffModel == 4 && ms.maModel == 'modified') {
      stringVal =
        option.field +
        '_r1 >= ' +
        Math.round(val[0]) +
        ' AND ' +
        option.field +
        '_r1 <= ' +
        Math.round(val[1]);
    } else if (ms.ffModel == 5 && ms.maModel == 'natural') {
      stringVal =
        option.field +
        '_p2 >= ' +
        Math.round(val[0]) +
        ' AND ' +
        option.field +
        '_p2 <= ' +
        Math.round(val[1]);
    } else if (ms.ffModel == 5 && ms.maModel == 'modified') {
      stringVal =
        option.field +
        '_r2 >= ' +
        Math.round(val[0]) +
        ' AND ' +
        option.field +
        '_r2 <= ' +
        Math.round(val[1]);
    } else if (ms.ffModel == 6 && ms.maModel == 'natural') {
      stringVal =
        option.field +
        '_p3 >= ' +
        Math.round(val[0]) +
        ' AND ' +
        option.field +
        '_p3 <= ' +
        Math.round(val[1]);
    } else if (ms.ffModel == 6 && ms.maModel == 'modified') {
      stringVal =
        option.field +
        '_r3 >= ' +
        Math.round(val[0]) +
        ' AND ' +
        option.field +
        '_r3 <= ' +
        Math.round(val[1]);
    }
  }

  ms.updateDefinitionExpression({
    field: option.field,
    exp: stringVal,
  });
}
</script>
