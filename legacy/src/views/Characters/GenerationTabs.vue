<template>
  <div>
    <b-tabs content-class="mt-3" v-model="index" fill>
      <b-tab v-for="(t, i) in tabs" v-bind:key="t" :title="t" @click="onTabClick(i)"></b-tab>
    </b-tabs>
  </div>
</template>

<script>
import _ from 'lodash'

const GEN_MAX = 8

export default {
  name: 'GenerationTabs',
  props: {
    index: {
      type: Number
    }
  },
  data () {
    return {

    }
  },
  computed: {
    tabs () {
      return _.range(1, GEN_MAX + 1).map(String)
    }
  },
  methods: {
    onTabClick (index) {
      this.$emit('click', { index })
    }
  }
}
</script>
