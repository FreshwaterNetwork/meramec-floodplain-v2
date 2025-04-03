<template>
  <!-- <div style="margin: 20px">
    <div>Name:</div>
    <br />
    <div>Watershed area (acres):</div>
    <br />
    <div>Acres of floodplain (5-year) in forest or wetland:</div>
    <br />
    <div>Local nitrogen loading (5-year) 1-100 scale:</div>
    <br />
    <div>Local phosphorus loading (5-year) 1-100 scale:</div>
    <br />
    <div>Local sediment loading (5-year) 1-100 scale:</div>
    <br />
    <div>Number of federally endangered species occurrences:</div>
    <br />
    <div>
      Current pop in 5 yr floodplain in forest/wetland/grassland/ag/pasture :
    </div>
    <br />
    <div>
      People currently living in the floodplain of the selected flood frequency,
      in all land covers :
    </div>
    <br />
    <div>
      2050 pop. in 5 yr. floodplain in forest/wetland/grassland/ag/pasture :
    </div>
    <br />
    <div>Potential 2050 flood damage to buildings in 5-year floodplain:</div>
    <br />
    <div>Social vulnerability index:</div>
    <br />
  </div> -->

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
  <div>
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
</template>

<script setup>
import { useMapStore } from '../store/index';

const ms = useMapStore();
</script>
