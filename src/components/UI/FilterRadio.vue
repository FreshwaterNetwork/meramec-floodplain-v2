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
  computed: {
    compKey: {
      get() {
        const ms = useMapStore();
        return ms.componentKey;
      },
      set(value) {
        const ms = useMapStore();
        ms.componentKey = value;
      },
    },
  },
  methods: {
    firstUpdate(newValue, option) {
      let ms = useMapStore();
      let obj = {};
      if (newValue == 'present') {
        if (ms.ffModel == 251 && ms.maModel == 'natural') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: option.field,
              exp: option.field + ' = 1',
            };
          } else {
            obj = {
              id: option.field,
              exp: option.field + '_1 = 1',
            };
          }
        } else if (ms.ffModel == 251 && ms.maModel == 'modified') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: option.field,
              exp: option.field + ' = 1',
            };
          } else {
            obj = {
              id: option.field,
              exp: option.field + '_1 = 1',
            };
          }
        } else if (ms.ffModel == 253 && ms.maModel == 'natural') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: option.field,
              exp: option.field + ' = 1',
            };
          } else {
            obj = {
              id: option.field,
              exp: option.field + '_2 = 1',
            };
          }
        } else if (ms.ffModel == 253 && ms.maModel == 'modified') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: option.field,
              exp: option.field + ' = 1',
            };
          } else {
            obj = {
              id: option.field,
              exp: option.field + '_2 = 1',
            };
          }
        } else if (ms.ffModel == 255 && ms.maModel == 'natural') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: option.field,
              exp: option.field + ' = 1',
            };
          } else {
            obj = {
              id: option.field,
              exp: option.field + '_3 = 1',
            };
          }
        } else if (ms.ffModel == 255 && ms.maModel == 'modified') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: option.field,
              exp: option.field + ' = 1',
            };
          } else {
            obj = {
              id: option.field,
              exp: option.field + '_3 = 1',
            };
          }
        }
        ms.updateDefinitionExpression(obj);
      } else if (newValue == 'absent') {
        if (ms.ffModel == 251 && ms.maModel == 'natural') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: this.option.field,
              exp: this.option.field + ' = 0',
            };
          } else {
            obj = {
              id: this.option.field,
              exp: this.option.field + '_1 = 0',
            };
          }
        } else if (ms.ffModel == 251 && ms.maModel == 'modified') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: this.option.field,
              exp: this.option.field + ' = 0',
            };
          } else {
            obj = {
              id: this.option.field,
              exp: this.option.field + '_1 = 0',
            };
          }
        } else if (ms.ffModel == 253 && ms.maModel == 'natural') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: this.option.field,
              exp: this.option.field + ' = 0',
            };
          } else {
            obj = {
              id: this.option.field,
              exp: this.option.field + '_2 = 0',
            };
          }
        } else if (ms.ffModel == 253 && ms.maModel == 'modified') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: this.option.field,
              exp: this.option.field + ' = 0',
            };
          } else {
            obj = {
              id: this.option.field,
              exp: this.option.field + '_2 = 0',
            };
          }
        } else if (ms.ffModel == 255 && ms.maModel == 'natural') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: this.option.field,
              exp: this.option.field + ' = 0',
            };
          } else {
            obj = {
              id: this.option.field,
              exp: this.option.field + '_3 = 0',
            };
          }
        } else if (ms.ffModel == 255 && ms.maModel == 'modified') {
          if (option.field == 'ABCcorr') {
            obj = {
              id: this.option.field,
              exp: this.option.field + ' = 0',
            };
          } else {
            obj = {
              id: this.option.field,
              exp: this.option.field + '_3 = 0',
            };
          }
        }
        ms.updateDefinitionExpression(obj);
      }
    },
  },
  watch: {
    model(newValue) {
      this.firstUpdate(newValue, this.option);
    },
    compKey() {
      this.option.checkboxModel.value = false;
    },
  },
};
</script>
