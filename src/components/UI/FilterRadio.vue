<template>
  <q-option-group
    v-model="model"
    :options="options"
    dense
    inline
    color="primary"
    :disable="this.option.checkboxModel.value == true ? false : true"
    @update:model-value="$emit(method)"
  ></q-option-group>
</template>

<script>
import { useMapStore } from '../../store';

export default {
  data() {
    return {
      model: 'present',
      options: [
        { label: 'Present', value: 'present' },
        { label: 'Absent', value: 'absent' },
      ],
    };
  },
  props: ['method', 'option'],
  computed: {},
  methods: {
    firstUpdate(newValue, option) {
      let ms = useMapStore();
      let obj = {};
      if (newValue == 'present') {
        if (ms.ffModel == 4 && ms.maModel == 'natural') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: option.field,
              exp: option.field + ' = 1',
            };
          } else {
            obj = {
              id: option.field,
              exp: option.field + '_p1 = 1',
            };
          }
        } else if (ms.ffModel == 4 && ms.maModel == 'modified') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: option.field,
              exp: option.field + ' = 1',
            };
          } else {
            obj = {
              id: option.field,
              exp: option.field + '_r1 = 1',
            };
          }
        } else if (ms.ffModel == 5 && ms.maModel == 'natural') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: option.field,
              exp: option.field + ' = 1',
            };
          } else {
            obj = {
              id: option.field,
              exp: option.field + '_p2 = 1',
            };
          }
        } else if (ms.ffModel == 5 && ms.maModel == 'modified') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: option.field,
              exp: option.field + ' = 1',
            };
          } else {
            obj = {
              id: option.field,
              exp: option.field + '_r2 = 1',
            };
          }
        } else if (ms.ffModel == 6 && ms.maModel == 'natural') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: option.field,
              exp: option.field + ' = 1',
            };
          } else {
            obj = {
              id: option.field,
              exp: option.field + '_p3 = 1',
            };
          }
        } else if (ms.ffModel == 6 && ms.maModel == 'modified') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: option.field,
              exp: option.field + ' = 1',
            };
          } else {
            obj = {
              id: option.field,
              exp: option.field + '_r3 = 1',
            };
          }
        }
        ms.updateDefinitionExpression(obj);
      } else if (newValue == 'absent') {
        if (ms.ffModel == 4 && ms.maModel == 'natural') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: this.option.field,
              exp: this.option.field + ' = 0',
            };
          } else {
            obj = {
              id: this.option.field,
              exp: this.option.field + '_p1 = 0',
            };
          }
        } else if (ms.ffModel == 4 && ms.maModel == 'modified') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: this.option.field,
              exp: this.option.field + ' = 0',
            };
          } else {
            obj = {
              id: this.option.field,
              exp: this.option.field + '_r1 = 0',
            };
          }
        } else if (ms.ffModel == 5 && ms.maModel == 'natural') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: this.option.field,
              exp: this.option.field + ' = 0',
            };
          } else {
            obj = {
              id: this.option.field,
              exp: this.option.field + '_p2 = 0',
            };
          }
        } else if (ms.ffModel == 5 && ms.maModel == 'modified') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: this.option.field,
              exp: this.option.field + ' = 0',
            };
          } else {
            obj = {
              id: this.option.field,
              exp: this.option.field + '_r2 = 0',
            };
          }
        } else if (ms.ffModel == 6 && ms.maModel == 'natural') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: this.option.field,
              exp: this.option.field + ' = 0',
            };
          } else {
            obj = {
              id: this.option.field,
              exp: this.option.field + '_p3 = 0',
            };
          }
        } else if (ms.ffModel == 6 && ms.maModel == 'modified') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: this.option.field,
              exp: this.option.field + ' = 0',
            };
          } else {
            obj = {
              id: this.option.field,
              exp: this.option.field + '_r3 = 0',
            };
          }
        }
        ms.updateDefinitionExpression(obj);
      }
    },
    // update(newValue, option) {
    //   let ms = useMapStore();
    //   if (newValue == 'present') {
    //     let obj = {
    //       field: option.field,
    //       exp: option.field + ' = 1.00',
    //     };
    //     ms.updateDefinitionExpression(obj);
    //   } else if (newValue == 'absent') {
    //     let obj = {
    //       field: option.field,
    //       exp: option.field + ' = 0.00',
    //     };
    //     ms.updateDefinitionExpression(obj);
    //   }
    // },
  },
  watch: {
    model(newValue) {
      // ms.activeFilters.forEach((filter) => {
      //   if (filter.id == this.option.field) {
      this.firstUpdate(newValue, this.option);
      // } else {
      //   this.firstUpdate(newValue, this.option);
      // }
      // });

      // if (newValue == 'present') {
      //   if (ms.ffModel == 4 && ms.maModel == 'natural') {
      //     ms.activeFilters.push({
      //       id: this.option.field,
      //       exp: this.option.field + '_p1 = 1.00',
      //     });
      //   } else if (ms.ffModel == 4 && ms.maModel == 'modified') {
      //     ms.activeFilters.push({
      //       id: this.option.field,
      //       exp: this.option.field + '_r1 = 1.00',
      //     });
      //   } else if (ms.ffModel == 5 && ms.maModel == 'natural') {
      //     ms.activeFilters.push({
      //       id: this.option.field,
      //       exp: this.option.field + '_p2 = 1.00',
      //     });
      //   } else if (ms.ffModel == 5 && ms.maModel == 'modified') {
      //     ms.activeFilters.push({
      //       id: this.option.field,
      //       exp: this.option.field + '_r2 = 1.00',
      //     });
      //   } else if (ms.ffModel == 6 && ms.maModel == 'natural') {
      //     ms.activeFilters.push({
      //       id: this.option.field,
      //       exp: this.option.field + '_p3 = 1.00',
      //     });
      //   } else if (ms.ffModel == 6 && ms.maModel == 'modified') {
      //     ms.activeFilters.push({
      //       id: this.option.field,
      //       exp: this.option.field + '_r3 = 1.00',
      //     });
      //   }
      // } else if (newValue == 'absent') {
      //   if (ms.ffModel == 4 && ms.maModel == 'natural') {
      //     ms.activeFilters.push({
      //       id: this.option.field,
      //       exp: this.option.field + '_p1 = 0.00',
      //     });
      //   } else if (ms.ffModel == 4 && ms.maModel == 'modified') {
      //     ms.activeFilters.push({
      //       id: this.option.field,
      //       exp: this.option.field + '_r1 = 0.00',
      //     });
      //   } else if (ms.ffModel == 5 && ms.maModel == 'natural') {
      //     ms.activeFilters.push({
      //       id: this.option.field,
      //       exp: this.option.field + '_p2 = 0.00',
      //     });
      //   } else if (ms.ffModel == 5 && ms.maModel == 'modified') {
      //     ms.activeFilters.push({
      //       id: this.option.field,
      //       exp: this.option.field + '_r2 = 0.00',
      //     });
      //   } else if (ms.ffModel == 6 && ms.maModel == 'natural') {
      //     ms.activeFilters.push({
      //       id: this.option.field,
      //       exp: this.option.field + '_p3 = 0.00',
      //     });
      //   } else if (ms.ffModel == 6 && ms.maModel == 'modified') {
      //     ms.activeFilters.push({
      //       id: this.option.field,
      //       exp: this.option.field + '_r3 = 0.00',
      //     });
      //   }
      // }
      // ms.updateDefinitionExpression();
    },
  },
};
</script>
