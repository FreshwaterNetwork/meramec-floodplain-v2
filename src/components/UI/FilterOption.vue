<template>
  <div v-for="obj in filterObj" :key="obj">
    <q-expansion-item
      :label="obj.header"
      header-class="text-weight-medium"
      dense
    >
      <div v-for="option in obj.controls" :key="option">
        <div v-for="(range, key) in sliderObj" :key="key">
          <div v-if="objName == key && option.type == 'slider'">
            <div v-for="(k, key) in range" :key="key">
              <div
                v-if="key == option.field"
                style="display: flex; width: 100%"
                class="fit row wrap justify-evenly q-my-sm"
              >
                <FilterCheckbox
                  :label="option.label"
                  method="update-de"
                  @update-de="updateCheckbox(option)"
                ></FilterCheckbox>
                <div class="self-end" style="width: 45%">
                  <q-badge
                    v-if="option.checkboxModel.value == true"
                    outline
                    color="primary"
                    style="margin: auto; width: fit-content; display: block"
                  >
                    {{ k.min }} to {{ k.max }}
                  </q-badge>
                  <q-range
                    :v-model="createSliderModel(k)"
                    :min="k.min"
                    :max="k.max"
                    color="primary"
                    :disable="option.checkboxModel.value == true ? false : true"
                  ></q-range>
                </div>
                <div
                  class="self-center col-1"
                  style="overflow: auto; margin: auto"
                >
                  <q-btn
                    dense
                    flat
                    rounded
                    color="primary"
                    style="border: none !important"
                    icon="info"
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
                      >{{ k.info }}</q-tooltip
                    ></q-btn
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-for="(radio, key) in radioObj" :key="key">
          <div v-if="objName == key && option.type == 'radio'">
            <div v-for="(k, key) in radio" :key="key">
              <div
                v-if="key == option.field"
                style="display: flex; width: 100%"
                class="fit row wrap justify-evenly q-my-sm"
              >
                <FilterCheckbox
                  :label="option.label"
                  method="update-de"
                  @update-de="updateCheckbox(option)"
                ></FilterCheckbox>
                <div
                  class="self-center"
                  style="overflow: auto; width: fit-content"
                >
                  <FilterRadio
                    method="update-radio"
                    @update-radio="updateRadio(option)"
                  ></FilterRadio>
                </div>
                <div class="self-center col-1">
                  <q-btn
                    dense
                    flat
                    rounded
                    color="primary"
                    style="width: 30%; border: none !important"
                    icon="info"
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
                      >{{ k.info }}</q-tooltip
                    ></q-btn
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <q-separator inset class="q-my-sm" />
      </div>
    </q-expansion-item>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMapStore } from '../../store';
import FilterCheckbox from './filterCheckbox.vue';
import FilterRadio from './FilterRadio.vue';

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
        label:
          'Available floodplain area for given return interval and management action',
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
        label: 'Total nitrogen (SWAT model)',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },
      con1: {
        type: 'slider',
        field: 'TP',
        label: 'Total phosphorus (SWAT model)',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },

      con2: {
        type: 'slider',
        field: 'Sed',
        label: 'Sediment (SWAT model)',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },

      con3: {
        type: 'slider',
        field: 'SedAcc',
        label: 'Accumulated sediment (SWAT model)',
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
  group3: {
    header: 'Connectivity',
    controls: {
      con0: {
        type: 'radio',
        field: 'impWet',
        label: 'Floodplain Wetland Importance Rank',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },

      con1: {
        type: 'radio',
        field: 'fprank',
        label: 'Floodplain Restoration Rank',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },
    },
  },
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

      con1: {
        type: 'slider',
        field: 'EcoSig',
        label: 'Ecological Significance Ranking',
        checkboxModel: ref(false),
        radioModel: ref('present'),
      },
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
      con1: {
        type: 'slider',
        field: 'pop5',
        label:
          'Population exposed to floods (present-day) (in all land covers)',
        checkboxModel: ref(false),
        radioModel: ref('present'),
        unit: '',
      },
      con2: {
        type: 'slider',
        field: 'pop100',
        label:
          'Population exposed to floods (present-day) (in all land covers)',
        checkboxModel: ref(false),
        radioModel: ref('present'),
        unit: '',
      },
      con3: {
        type: 'slider',
        field: 'pop500',
        label:
          'Population exposed to floods (present-day) (in all land covers)',
        checkboxModel: ref(false),
        radioModel: ref('present'),
        unit: '',
      },
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
        label: 'Potential Future Flood Damages to Structures (2050) ($)',
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
const sliderObj = {
  // huc 12 + protection + 1 in 5 year flood
  h12p1: {
    Acres: {
      values: [],
      vis: true,
      min: 17,
      max: 806,
      info: 'Area of floodplain in natural land cover that is not currently in protected status.',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    NCCPI: {
      vis: false,
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 194,
      info: 'Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 0,
      max: 766,
      info: 'Data provided by the East-West Gateway Council of Governments.',
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: 'Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act.',
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 1,
      max: 4,
      shfld: true,
      info: 'Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric.',
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 37,
      shfld: true,
      info: 'This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People currently living in forest/wetland floodplain of the selected return interval.',
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People expected to be living in forest/wetland floodplain of the selected return interval in 2050.',
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
    },
  },
  // huc 12 + protection + 1 in 100 year flood
  h12p2: {
    Acres: {
      values: [],
      vis: true,
      min: 153,
      max: 3044,
      info: 'Area of floodplain in natural land cover that is not currently in protected status.',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    NCCPI: {
      vis: false,
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 870,
      info: 'Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 137,
      max: 2541,
      info: 'Data provided by the East-West Gateway Council of Governments.',
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: 'Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act.',
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 1,
      max: 4,
      shfld: true,
      info: 'Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric.',
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 37,
      shfld: true,
      info: 'This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People currently living in forest/wetland floodplain of the selected return interval.',
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People expected to be living in forest/wetland floodplain of the selected return interval in 2050.',
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
    },
  },
  // huc 12 + protection + 1 in 500 year flood
  h12p3: {
    Acres: {
      values: [],
      vis: true,
      min: 282,
      max: 4901,
      info: 'Area of floodplain in natural land cover that is not currently in protected status.',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Accumulated Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    NCCPI: {
      vis: false,
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 1148,
      info: 'Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 239,
      max: 4062,
      info: 'Data provided by the East-West Gateway Council of Governments.',
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: 'Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act.',
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 1,
      max: 4,
      shfld: true,
      info: 'Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric.',
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 37,
      shfld: true,
      info: 'This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People currently living in forest/wetland floodplain of the selected return interval.',
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People expected to be living in forest/wetland floodplain of the selected return interval in 2050.',
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
    },
  },

  // huc 12 + restoration + 1 in 5 year flood
  h12r1: {
    Acres: {
      values: [],
      vis: true,
      min: 1,
      max: 482,
      info: 'Available floodplain area for given return interval and management action</b><br>Area of floodplain in ag or potentially grazed land that could potentially be restored.',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Accumulated Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    NCCPI: {
      values: [],
      vis: true,
      min: 0,
      max: 10,
      div: 10,
      info: "Agricultural productivity potential of soils</b>The National Commodity Crop Productivity Index -- an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration.<br>",
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 68,
      info: 'Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 0,
      max: 16,
      info: 'Data provided by the East-West Gateway Council of Governments.',
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: 'Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act.',
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 1,
      max: 4,
      shfld: true,
      info: 'Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric.',
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 37,
      shfld: true,
      info: 'This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People currently living in ag/pasture floodplain of the selected return interval.',
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People expected to be living in forest/wetland floodplain of the selected return interval in 2050.',
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
    },
  },
  // huc 12 + restoration + 1 in 100 year flood
  h12r2: {
    Acres: {
      values: [],
      vis: true,
      min: 67,
      max: 2577,
      info: 'Available floodplain area for given return interval and management action</b><br>Area of floodplain in ag or potentially grazed land that could potentially be restored.',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Accumulated Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    NCCPI: {
      values: [],
      vis: true,
      min: 0,
      max: 10,
      div: 10,
      info: "Agricultural productivity potential of soils</b>The National Commodity Crop Productivity Index -- an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration.<br>",
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 376,
      info: 'Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 0,
      max: 73,
      info: 'Data provided by the East-West Gateway Council of Governments.',
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: 'Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act.',
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 1,
      max: 4,
      shfld: true,
      info: 'Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric.',
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 37,
      shfld: true,
      info: 'This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People currently living in ag/pasture floodplain of the selected return interval.',
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People expected to be living in ag/pasture floodplain of the selected return interval in 2050.',
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
    },
  },
  // huc 12 + restoration + 1 in 500 year flood
  h12r3: {
    Acres: {
      values: [],
      vis: true,
      min: 107,
      max: 3122,
      info: 'Available floodplain area for given return interval and management action</b><br>Area of floodplain in ag or potentially grazed land that could potentially be restored.',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Accumulated Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    NCCPI: {
      values: [],
      vis: true,
      min: 0,
      max: 10,
      div: 10,
      info: "Agricultural productivity potential of soils</b>The National Commodity Crop Productivity Index -- an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration.<br>",
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 456,
      info: 'Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 0,
      max: 284,
      info: 'Data provided by the East-West Gateway Council of Governments.',
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: 'Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act.',
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 1,
      max: 4,
      shfld: true,
      info: 'Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric.',
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 37,
      shfld: true,
      info: 'This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People currently living in ag/pasture floodplain of the selected return interval.',
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People expected to be living in ag/pasture floodplain of the selected return interval in 2050.',
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
    },
  },

  // catchment + protection + 1 in 5 year flood
  catchp1: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 295,
      info: 'Available floodplain area for given return interval and management action</b><br>Area of floodplain in natural land cover that is not currently in protected status.',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total phosphorus (SWAT model)</b>Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.<br>',
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Accumulated Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    NCCPI: {
      vis: false,
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 112,
      info: 'Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 0,
      max: 294,
      info: 'Data provided by the East-West Gateway Council of Governments.',
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: 'Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act.',
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 0,
      max: 5,
      shfld: true,
      info: 'Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric.',
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 9,
      shfld: true,
      info: 'This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People currently living in forest/wetland floodplain of the selected return interval.',
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People expected to be living in forest/wetland floodplain of the selected return interval in 2050.',
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
    },
  },
  // catchment + protection + 1 in 100 year flood
  catchp2: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 504,
      info: 'Available floodplain area for given return interval and management action</b><br>Area of floodplain in natural land cover that is not currently in protected status.',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Accumulated Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    NCCPI: {
      vis: false,
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 248,
      info: 'Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 0,
      max: 500,
      info: 'Data provided by the East-West Gateway Council of Governments.',
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: 'Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act.',
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 0,
      max: 5,
      shfld: true,
      info: 'Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric.',
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 9,
      shfld: true,
      info: 'This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People currently living in forest/wetland floodplain of the selected return interval.',
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People expected to be living in forest/wetland floodplain of the selected return interval in 2050.',
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
    },
  },
  // catchment + protection + 1 in 500 year flood
  catchp3: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 576,
      info: 'Available floodplain area for given return interval and management action</b><br>Area of floodplain in natural land cover that is not currently in protected status.',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total phosphorus (SWAT model)</b>Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Accumulated Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For protection priorities, identify catchments <i>lower</i> in this metric.',
    },
    NCCPI: {
      vis: false,
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 266,
      info: 'Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 0,
      max: 569,
      info: 'Data provided by the East-West Gateway Council of Governments.',
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: 'Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act.',
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 0,
      max: 5,
      shfld: true,
      info: 'Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric.',
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 9,
      shfld: true,
      info: 'This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People currently living in forest/wetland floodplain of the selected return interval.',
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People expected to be living in forest/wetland floodplain of the selected return interval in 2050.',
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
    },
  },

  // catchment + restoration + 1 in 5 year flood
  catchr1: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 123,
      info: 'Available floodplain area for given return interval and management action</b><br>Area of floodplain in ag or potentially grazed land that could potentially be restored.',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Accumulated Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    NCCPI: {
      values: [],
      vis: true,
      min: 0,
      max: 10,
      div: 10,
      info: "Agricultural productivity potential of soils</b>The National Commodity Crop Productivity Index -- an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration.<br>",
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 32,
      info: 'Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 0,
      max: 10,
      info: 'Data provided by the East-West Gateway Council of Governments.',
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: 'Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act.',
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 0,
      max: 5,
      shfld: true,
      info: 'Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric.',
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 9,
      shfld: true,
      info: 'This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People currently living in ag/pasture floodplain of the selected return interval.',
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People expected to be living in ag/pasture floodplain of the selected return interval in 2050.',
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
    },
  },
  // catchment + restoration + 1 in 100 year flood
  catchr2: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 453,
      info: 'Available floodplain area for given return interval and management action</b><br>Area of floodplain in ag or potentially grazed land that could potentially be restored.',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Accumulated Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    NCCPI: {
      values: [],
      vis: true,
      min: 0,
      max: 10,
      div: 10,
      info: "Agricultural productivity potential of soils</b>The National Commodity Crop Productivity Index -- an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration.<br>",
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 121,
      info: 'Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 0,
      max: 33,
      info: 'Data provided by the East-West Gateway Council of Governments.',
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: 'Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act.',
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 0,
      max: 5,
      shfld: true,
      info: 'Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric.',
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 9,
      shfld: true,
      info: 'This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People currently living in ag/pasture floodplain of the selected return interval.',
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People expected to be living in ag/pasture floodplain of the selected return interval in 2050.',
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
    },
  },
  // catchment + restoration + 1 in 500 year flood
  catchr3: {
    Acres: {
      values: [],
      vis: true,
      min: 0,
      max: 729,
      info: 'Available floodplain area for given return interval and management action</b><br>Area of floodplain in ag or potentially grazed land that could potentially be restored.',
    },
    TN: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total nitrogen loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    TP: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Total phosphorus loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    Sed: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Local sediment loading, according to SWAT modeling. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    SedAcc: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Accumulated Sediment loading, according to SWAT modeling -- accounts for all sediment coming in from upstream. Values normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    DINCY: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'Kg/yr of nitrogen and phosphorus from within a given watershed that reaches Gulf of Mexico, divided by watershed area in km2, all normalized to 0-100 scale. For protection priorities, identify catchments <i>higher</i> in this metric.',
    },
    NCCPI: {
      values: [],
      vis: true,
      min: 0,
      max: 10,
      div: 10,
      info: "Agricultural productivity potential of soils</b>The National Commodity Crop Productivity Index -- an index characterizing soil's inherent capacity to produce non-irrigated commodity crops (0 - 1). Lower value suggests less productive soil, and therefore more viable opportunity for restoration.<br>",
    },
    adjProt: {
      values: [],
      vis: true,
      min: 0,
      max: 137,
      info: 'Protected land includes areas from Protected Areas Database of the U.S. and Great Rivers Greenway infrastructure.',
    },
    EcoSig: {
      values: [],
      vis: true,
      min: 0,
      max: 96,
      info: 'Data provided by the East-West Gateway Council of Governments.',
    },
    WT_TOT: {
      values: [],
      vis: true,
      min: 0,
      max: 2,
      shfld: true,
      info: 'Total number of wetland species in catchment considered Imperiled (G1/G2) by NatureServe or threatened or endangered under the Endangered Species Act.',
    },
    cumu_hci: {
      values: [],
      vis: true,
      min: 0,
      max: 5,
      shfld: true,
      info: 'Degree to which anthropogenic stressors in the watershed may be affecting fish habitat. Higher value = less extreme stressors. For protection priorities, identify catchments higher in this metric.',
    },
    HPFedEnd: {
      values: [],
      vis: true,
      min: 0,
      max: 9,
      shfld: true,
      info: 'This metric includes data provided by the Missouri Natural Heritage Program (MONHP), Missouri Department of Conservation. The MONHP houses the most complete database on the locations and status of species and natural communities of conservation concern. Data provided by the MONHP are not based on an exhaustive inventory of the state. The lack of data for any geographic area shall not be construed to mean that no significant features are present. Only an on-site survey can determine the presence or absence of natural heritage resources. The information provided for your request is accurate and current as of the last observation date.',
    },
    popnow: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People currently living in ag/pasture floodplain of the selected return interval.',
    },
    pop2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: 'People expected to be living in ag/pasture floodplain of the selected return interval in 2050.',
    },
    Dam2050: {
      values: [],
      vis: true,
      min: 0,
      max: 100,
      info: "Average between moderate (SSP2) and high (SSP5) socioeconomic development scenarios. Scenario descriptions are available in the <a href='https://www.sciencedirect.com/science/article/pii/S0959378016300681' target='_blank'>linked paper</a>.",
    },
  },
};

// object for radio groups
const radioObj = {
  // huc 12 + protection + 1 in 5 year flood
  h12p1: {
    impWet: {
      vis: true,
      cbid: 'rb_cb0',
      info: 'Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    fprank: {
      vis: false,
    },
    inIBA: {
      vis: true,
      cbid: 'rb_cb2',
      info: 'Important Bird Areas</b></br>Floodplain in a state Important Bird Area.',
    },
    ABCcorr: {
      vis: true,
      cbid: 'rb_cb3',
      shfld: true,
      info: 'American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>Corridors represent where bird risk differs season to season and key habitat areas are for birds on the Red WatchList.',
    },
    anyHab: {
      vis: true,
      cbid: 'rb_cb4',
      info: 'In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },
  // huc 12 + protection + 1 in 100 year flood
  h12p2: {
    impWet: {
      vis: true,
      cbid: 'rb_cb0',
      info: 'Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    fprank: {
      vis: false,
    },
    inIBA: {
      vis: true,
      cbid: 'rb_cb2',
      info: 'Important Bird Areas</b></br>Floodplain in a state Important Bird Area.',
    },
    ABCcorr: {
      vis: true,
      cbid: 'rb_cb3',
      shfld: true,
      info: 'American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>Corridors represent where bird risk differs season to season and key habitat areas are for birds on the Red WatchList.',
    },
    anyHab: {
      vis: true,
      cbid: 'rb_cb4',
      info: 'In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },
  // huc 12 + protection + 1 in 500 year flood
  h12p3: {
    impWet: {
      vis: true,
      cbid: 'rb_cb0',
      info: 'Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    fprank: {
      vis: false,
    },
    inIBA: {
      vis: true,
      cbid: 'rb_cb2',
      info: 'Important Bird Areas</b></br>Floodplain in a state Important Bird Area.',
    },
    ABCcorr: {
      vis: true,
      cbid: 'rb_cb3',
      shfld: true,
      info: 'American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>Corridors represent where bird risk differs season to season and key habitat areas are for birds on the Red WatchList.',
    },
    anyHab: {
      vis: true,
      cbid: 'rb_cb4',
      info: 'In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },

  // huc 12 + restoration + 1 in 5 year flood
  h12r1: {
    impWet: {
      vis: true,
      cbid: 'rb_cb0',
      info: 'Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    fprank: {
      vis: true,
      cbid: 'rb_cb1',
      info: 'Floodplain Restoration Rank</b><br>Watershed contains floodplain in an area of floodplain restoration rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    inIBA: {
      vis: true,
      cbid: 'rb_cb2',
      info: 'Important Bird Areas</b></br>Floodplain in a state Important Bird Area.',
    },
    ABCcorr: {
      vis: true,
      cbid: 'rb_cb3',
      shfld: true,
      info: 'American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>Corridors represent where bird risk differs season to season and key habitat areas are for birds on the Red WatchList.',
    },
    anyHab: {
      vis: true,
      cbid: 'rb_cb4',
      info: 'In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },
  // huc 12 + restoration + 1 in 100 year flood
  h12r2: {
    impWet: {
      vis: true,
      cbid: 'rb_cb0',
      info: 'Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    fprank: {
      vis: true,
      cbid: 'rb_cb1',
      info: 'Floodplain Restoration Rank</b><br>Watershed contains floodplain in an area of floodplain restoration rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    inIBA: {
      vis: true,
      cbid: 'rb_cb2',
      info: 'Important Bird Areas</b></br>Floodplain in a state Important Bird Area.',
    },
    ABCcorr: {
      vis: true,
      cbid: 'rb_cb3',
      shfld: true,
      info: 'American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>Corridors represent where bird risk differs season to season and key habitat areas are for birds on the Red WatchList.',
    },
    anyHab: {
      vis: true,
      cbid: 'rb_cb4',
      info: 'In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },
  // huc 12 + restoration + 1 in 500 year flood
  h12r3: {
    impWet: {
      vis: true,
      cbid: 'rb_cb0',
      info: 'Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    fprank: {
      vis: true,
      cbid: 'rb_cb1',
      info: 'Floodplain Restoration Rank</b><br>Watershed contains floodplain in an area of floodplain restoration rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    inIBA: {
      vis: true,
      cbid: 'rb_cb2',
      info: 'Important Bird Areas</b></br>Floodplain in a state Important Bird Area.',
    },
    ABCcorr: {
      vis: true,
      cbid: 'rb_cb3',
      shfld: true,
      info: 'American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>Corridors represent where bird risk differs season to season and key habitat areas are for birds on the Red WatchList.',
    },
    anyHab: {
      vis: true,
      cbid: 'rb_cb4',
      info: 'In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },

  // catchment + protection + 1 in 5 year flood
  catchp1: {
    impWet: {
      vis: true,
      cbid: 'rb_cb0',
      info: 'Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    fprank: {
      vis: false,
    },
    inIBA: {
      vis: true,
      cbid: 'rb_cb2',
      info: 'Important Bird Areas</b></br>Floodplain in a state Important Bird Area.',
    },
    ABCcorr: {
      vis: true,
      cbid: 'rb_cb3',
      shfld: true,
      info: 'American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>Corridors represent where bird risk differs season to season and key habitat areas are for birds on the Red WatchList.',
    },
    anyHab: {
      vis: true,
      cbid: 'rb_cb4',
      info: 'In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },
  // catchment + protection + 1 in 100 year flood
  catchp2: {
    impWet: {
      vis: true,
      cbid: 'rb_cb0',
      info: 'Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    fprank: {
      vis: false,
    },
    inIBA: {
      vis: true,
      cbid: 'rb_cb2',
      info: 'Important Bird Areas</b></br>Floodplain in a state Important Bird Area.',
    },
    ABCcorr: {
      vis: true,
      cbid: 'rb_cb3',
      shfld: true,
      info: 'American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>Corridors represent where bird risk differs season to season and key habitat areas are for birds on the Red WatchList.',
    },
    anyHab: {
      vis: true,
      cbid: 'rb_cb4',
      info: 'In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },
  // catchment + protection + 1 in 500 year flood
  catchp3: {
    impWet: {
      vis: true,
      cbid: 'rb_cb0',
      info: 'Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    fprank: {
      vis: false,
    },
    inIBA: {
      vis: true,
      cbid: 'rb_cb2',
      info: 'Important Bird Areas</b></br>Floodplain in a state Important Bird Area.',
    },
    ABCcorr: {
      vis: true,
      cbid: 'rb_cb3',
      shfld: true,
      info: 'American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>Corridors represent where bird risk differs season to season and key habitat areas are for birds on the Red WatchList.',
    },
    anyHab: {
      vis: true,
      cbid: 'rb_cb4',
      info: 'In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },

  // catchment + restoration + 1 in 5 year flood
  catchr1: {
    impWet: {
      vis: true,
      cbid: 'rb_cb0',
      info: 'Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    fprank: {
      vis: true,
      cbid: 'rb_cb1',
      info: 'Floodplain Restoration Rank</b><br>Watershed contains floodplain in an area of floodplain restoration rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    inIBA: {
      vis: true,
      cbid: 'rb_cb2',
      info: 'Important Bird Areas</b></br>Floodplain in a state Important Bird Area.',
    },
    ABCcorr: {
      vis: true,
      cbid: 'rb_cb3',
      shfld: true,
      info: 'American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>Corridors represent where bird risk differs season to season and key habitat areas are for birds on the Red WatchList.',
    },
    anyHab: {
      vis: true,
      cbid: 'rb_cb4',
      info: 'In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },
  // catchment + restoration + 1 in 100 year flood
  catchr2: {
    impWet: {
      vis: true,
      cbid: 'rb_cb0',
      info: 'Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    fprank: {
      vis: true,
      cbid: 'rb_cb1',
      info: 'Floodplain Restoration Rank</b><br>Watershed contains floodplain in an area of floodplain restoration rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    inIBA: {
      vis: true,
      cbid: 'rb_cb2',
      info: 'Important Bird Areas</b></br>Floodplain in a state Important Bird Area.',
    },
    ABCcorr: {
      vis: true,
      cbid: 'rb_cb3',
      shfld: true,
      info: 'American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>Corridors represent where bird risk differs season to season and key habitat areas are for birds on the Red WatchList.',
    },
    anyHab: {
      vis: true,
      cbid: 'rb_cb4',
      info: 'In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },
  // catchment + restoration + 1 in 500 year flood
  catchr3: {
    impWet: {
      vis: true,
      cbid: 'rb_cb0',
      info: 'Floodplain Wetland Importance Rank</b><br>Watershed contains floodplain in an area of wetland importance rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    fprank: {
      vis: true,
      cbid: 'rb_cb1',
      info: 'Floodplain Restoration Rank</b><br>Watershed contains floodplain in an area of floodplain restoration rank 5 or above. Data provided by the East-West Gateway Council of Governments.',
    },
    inIBA: {
      vis: true,
      cbid: 'rb_cb2',
      info: 'Important Bird Areas</b></br>Floodplain in a state Important Bird Area.',
    },
    ABCcorr: {
      vis: true,
      cbid: 'rb_cb3',
      shfld: true,
      info: 'American Bird Conservancy Corridors & Key Habitat Bird Areas</b><br>Corridors represent where bird risk differs season to season and key habitat areas are for birds on the Red WatchList.',
    },
    anyHab: {
      vis: true,
      cbid: 'rb_cb4',
      info: 'In any of the above 3 habitat layers</b><br>In an Important Bird Area, contains at-risk wetland species, or in an American Bird Conservancy corridor.',
    },
  },
};

function updateCheckbox(option) {
  if (option.checkboxModel.value == false) {
    option.checkboxModel.value = true;
  } else {
    option.checkboxModel.value = false;
  }
}

function updateRadio(option) {
  if (option.radioModel.value == 'present') {
    option.radioModel.value == 'absent';
  } else {
    option.radioModel.value = 'present';
  }
}

function createSliderModel(option) {
  console.log(option);
  return ref({ min: option.min, max: option.max });
}
</script>
