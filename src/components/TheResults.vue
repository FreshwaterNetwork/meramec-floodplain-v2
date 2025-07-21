<template>
  <q-btn
    dense
    flat
    round
    icon="close"
    color="red"
    @click="ms.rightDrawerOpen = !ms.rightDrawerOpen"
  >
    <q-tooltip>Close Results</q-tooltip>
  </q-btn>

  <!-- watershed -->
  <div v-if="ms.clickType == 'watershed'">
    <q-list separator class="q-py-xs">
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Name</q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.name }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Watershed area (acres)</q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.watershedAcres }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Acres of floodplain (5-year) in forest or wetland</q-item-label
          >
          <q-item-label
            ><strong>{{
              ms.clickResults.floodplainAcres
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Local nitrogen loading (5-year) 1-100 scale</q-item-label
          >
          <q-item-label
            ><strong>{{ ms.clickResults.nitrogenScale }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Local phosphorus loading (5-year) 1-100 scale</q-item-label
          >
          <q-item-label
            ><strong>{{
              ms.clickResults.phosphorusScale
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Local sediment loading (5-year) 1-100 scale</q-item-label
          >
          <q-item-label
            ><strong>{{ ms.clickResults.sedimentScale }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Number of federally endangered species occurrences</q-item-label
          >
          <q-item-label
            ><strong>{{
              ms.clickResults.endageredSpecies
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Current pop in 5 yr floodplain in
            forest/wetland/grassland/ag/pasture
          </q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.currentPop }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >People currently living in the floodplain of the selected flood
            frequency, in all land covers
          </q-item-label>
          <q-item-label
            ><strong>{{
              ms.clickResults.peopleFloodplain
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >2050 pop. in 5 yr. floodplain in
            forest/wetland/grassland/ag/pasture
          </q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.futurePop }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Potential 2050 flood damage to buildings in 5-year
            floodplain</q-item-label
          >
          <q-item-label
            ><strong>{{ ms.clickResults.floodDamage }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Social vulnerability index</q-item-label>
          <q-item-label
            ><strong>{{
              ms.clickResults.vulnerabilityIndex
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
    </q-list>
  </div>

  <!-- structures -->
  <div v-if="ms.clickType == 'structures'">
    <q-list separator class="q-py-xs">
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Site address</q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.name }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Square footage of first floor</q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.watershedAcres }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Occupancy type</q-item-label>
          <q-item-label
            ><strong>{{
              ms.clickResults.floodplainAcres
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Estimated appraised land value</q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.nitrogenScale }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Estimated appraised structure value</q-item-label
          >
          <q-item-label
            ><strong>{{
              ms.clickResults.phosphorusScale
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Estimated proposed property value (land + structure)</q-item-label
          >
          <q-item-label
            ><strong>{{ ms.clickResults.sedimentScale }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Estimated foundation type</q-item-label>
          <q-item-label
            ><strong>{{
              ms.clickResults.endageredSpecies
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Municipality </q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.currentPop }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>County </q-item-label>
          <q-item-label
            ><strong>{{
              ms.clickResults.peopleFloodplain
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Ground surface elevation </q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.futurePop }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>First-floor elevation</q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.floodDamage }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Estimated 100-year flood depth relative to ground surface
            elevation</q-item-label
          >
          <q-item-label
            ><strong>{{
              ms.clickResults.vulnerabilityIndex
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Structures located in each of the hubs included in the
            environmental analysis</q-item-label
          >
          <q-item-label
            ><strong>{{
              ms.clickResults.vulnerabilityIndex
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Ranking (1 to 3, with 3 being the best) of the environmental
            analysis</q-item-label
          >
          <q-item-label
            ><strong>{{
              ms.clickResults.vulnerabilityIndex
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Recommended non-structural mitigation</q-item-label
          >
          <q-item-label
            ><strong>{{
              ms.clickResults.vulnerabilityIndex
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Estimated cost of recommended non-structural
            mitigation</q-item-label
          >
          <q-item-label
            ><strong>{{
              ms.clickResults.vulnerabilityIndex
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Estimated 100-year flood depth relative to first floor
            elevation</q-item-label
          >
          <q-item-label
            ><strong>{{
              ms.clickResults.vulnerabilityIndex
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
    </q-list>
  </div>

  <!-- hubs -->
  <div v-if="ms.clickType == 'hub'">
    <q-list separator class="q-py-xs">
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Name</q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.name }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Riparian zone</q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.watershedAcres }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Wetland/floodplain ranking</q-item-label>
          <q-item-label
            ><strong>{{
              ms.clickResults.floodplainAcres
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Existing habitat</q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.nitrogenScale }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Endangered species</q-item-label>
          <q-item-label
            ><strong>{{
              ms.clickResults.phosphorusScale
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Public land adjacency</q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.sedimentScale }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Ecological significance ranking</q-item-label>
          <q-item-label
            ><strong>{{
              ms.clickResults.endageredSpecies
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Top 20% sediment/phosphorus/nitrogen
          </q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.currentPop }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Top 20% accumulated sediment </q-item-label>
          <q-item-label
            ><strong>{{
              ms.clickResults.peopleFloodplain
            }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline
            >Future climate and land use change
          </q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.futurePop }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
      <q-item dense class="q-py-sm">
        <q-item-section>
          <q-item-label overline>Total score</q-item-label>
          <q-item-label
            ><strong>{{ ms.clickResults.floodDamage }}</strong></q-item-label
          >
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { useMapStore } from '../store/index';

const ms = useMapStore();
</script>
