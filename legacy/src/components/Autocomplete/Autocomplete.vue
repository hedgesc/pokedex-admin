<template>
  <div class="auto-complete">
    <div v-show="!selectedOption">
      <input
        ref="search" type="text" :class="classes"
        v-model="searchText" autocomplete="off"
        style="border-radius:0" @focus="onSearchFocus" />
      <div
        class="list-group"
        v-show="!selectedOption && searchHasFocus"
        style="max-height:326px;overflow-y:auto;z-index:100;"
      >
        <a
          href=""
          class="list-group-item list-group-item-action"
          v-for="option in matchingOptions"
          v-bind:key="option.value"
          @click.prevent="setOption(option)"
        >
          <div class="d-flex justify-content-start">
            <img
              :src="option.icon"
              :alt="option.text"
              style="width:60px;margin-top:-10px;margin-bottom:-10px;margin-left:-15px;margin-right:20px"
            />
            <div style="line-height:36px;font-weight:600;">{{ option.text }}</div>
          </div>
        </a>
      </div>
    </div>
    <div v-show="selectedOption">
      <div class="input-group mb-3">
        <input type="text" :for="inputId" :value="selectedText" :class="classes">
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" id="button-addon2" @click="clearOption()">
            <i class="material-icons" style="vertical-align:middle">clear</i>
          </button>
        </div>
      </div>
      <input type="hidden" :id="inputId" :value="selectedValue" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'Autocomplete',
  props: {
    value: {
      required: true
    },
    inputId: {
      type: String
    },
    inputSize: {
      type: String
    },
    options: {
      type: Array
    }
  },
  mounted () {
    document.addEventListener('click', this.handleClickOutside)
    // document.addEventListener("keyup", this.handleClickOutside);
    // if (this.value && this.options.includes(this.value)) {
    //   this.selectedOption = this.value;
    //   return;
    // }
    // this.searchText = this.initial;
  },
  destroyed () {
    // document.removeEventListener("keyup", this.handleClickOutside);
    document.removeEventListener('click', this.handleClickOutside)
  },
  watch: {
    value (curr, prev) {
      console.log('watch: value', curr, prev)
      if (curr === prev) {
        console.log('watch: value', 'curr === prev, no change', curr)
        return
      }

      if (curr) {
        console.log('watch: value', curr)
        this.selectedOption = this.findOptionByValue(curr)
        console.log('watch: value', this.selectedOption)

        if (!this.selectedOption) {
          console.log('watch: value', 'failed to find option by value', curr)
          return
        }

        console.log('watch: value', 'selectedOption found', this.selectedOption.value)
      }
    },
    selectedOption (curr, prev) {
      if (curr === prev) {
        console.log('watch: selectedOption', 'curr === prev, no change', curr)
        return
      }

      if (curr) {
        console.log('watch: selectedOption', curr)
        this.$emit('input', curr.value)
      }
    },
    options (curr, prev) {
      if (curr === prev) {
        console.log('watch: options', 'curr === prev, no change', curr)
        return
      }

      if (curr) {
        console.log('watch: options', curr)
      }
    }
  },
  computed: {
    classes () {
      const result = ['form-control']

      if (this.inputSize) {
        result.push('form-control-' + this.inputSize)
      }

      return result
    },
    matchingOptions () {
      return _.filter(this.options, o => {
        return _.startsWith(o.text.toLowerCase(), this.searchText.toLowerCase())
      })
    },
    selectedText () {
      return this.selectedOption ? this.selectedOption.text : ''
    },
    selectedValue () {
      return this.selectedOption ? this.selectedOption.value : null
    }
  },
  methods: {
    handleClickOutside (e) {
      if (this.$el.contains(e.target) || e.target.id === this.inputId) {
        return
      }
      this.searchHasFocus = false
    },
    setOption (option) {
      console.log('setOption', option)
      this.searchText = option.text
      this.selectedOption = option
    },
    clearOption () {
      console.log('clearOption')
      this.selectedOption = null
      this.searchText = ''
      this.$nextTick(() => {
        this.$refs.search.focus()
      })
    },
    findOptionByValue (value) {
      console.log('findOptionByValue', value, this.options)
      const result = _.find(this.options, function (opt) {
        return opt.value === value
      })
      console.log('findOptionByValue', result)
      return result
    },
    onSearchFocus () {
      console.log('onSearchFocus')
      this.searchHasFocus = true
    }
  },
  data () {
    return {
      searchText: '',
      selectedOption: null,
      searchHasFocus: false
    }
  }
}
</script>

<style lang="scss" scoped>
.form-control:focus {
  border-color: #ced4da;
  box-shadow: none;
}
.list-group-item:first-child {
  border-top-left-radius: unset;
  border-top-right-radius: unset;
}
</style>
