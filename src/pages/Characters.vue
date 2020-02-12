<template>
  <Layout>
    <template v-slot:header>
      <router-link class="nav-item nav-link" to="/">Home</router-link>
      <router-link class="nav-item nav-link" to="/games">Games</router-link>
      <router-link class="nav-item nav-link active" to="/characters">Characters</router-link>
      <router-link class="nav-item nav-link" to="/moves">Moves</router-link>
    </template>

    <main role="main">
        <nav class="mt-3" aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item active">
                    Generation
                    <b-form-select 
                        v-model="filters.generation.selected" 
                        v-on:change="listCharacters"
                        :options="filters.generation.options" style="width: auto">
                    </b-form-select>
                    Pok&eacute;mon
                </li>
            </ol>
        </nav>

        <div class="row" v-for="(characters, i) in rows" v-bind:key="i">
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mb-4" v-for="c in characters" v-bind:key="c._id">
                <router-link class="card-link" :to="{name: 'Character', params: { id: c._id }, query: { gen: filters.generation.selected }}">
                    <div class="card">
                        <div class="card-body">
                            <div class="media">
                                <img class="mr-3" :src="c.imageUrl" :alt="c.name">
                                <div class="media-body">
                                    <h5 class="mt-0">{{ c.name }}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>

    </main>
  </Layout>
</template>

<script>
import _ from "lodash"
import Layout from '@/layouts/Layout'
import CharactersApi from '@/apis/characters'

export default {
  name: 'Characters',
  components: {
    Layout
  },
  data () {
    return {
      filters: { 
        generation: {
          selected: 1,
          options: [
            { value: 1, text: ' 1 ' },
            { value: 2, text: ' 2 ' },
            { value: 3, text: ' 3 ' },
            { value: 4, text: ' 4 ' },
            { value: 5, text: ' 5 ' },
            { value: 6, text: ' 6 ' },
            { value: 7, text: ' 7 ' }
          ]
        }  
      },
      rows: []
    }
  },

  created () {
    this.filters.generation.selected = this.$route.query.gen || 1
    this.listCharacters(this.filters.generation.selected)
  },
    
  methods: {
    listCharacters (gen) {
      return CharactersApi.list({ 'generation': gen })
        .then(res => {
          this.rows = []
          var _tmp = res.data
          while(_tmp.length) {
            this.rows.push(_tmp.splice(0, 4))
          }
        })
        .catch(err => {
          console.log(err)
        })
    },

    getParams (row, col) {
      var prevParams = this.getPreviousParams(row, col - 1)
      var nextParams = this.getNextParams(row, col + 1)

      var currParams = {
        id: this.rows[row][col]._id
      }

      var result = _.assign(prevParams, currParams, nextParams)
      console.log(result)

      return result;
    },

    getPreviousParams (row, col) {
      if(col < 0) {
        row = row - 1;

        if(row < 0) {
          row = this.rows.length - 1
        }

        col = this.rows[row].length - 1
      }

      return {
        previousId: this.rows[row][col]._id,
        previousName: this.rows[row][col].name
      }
    },
        
    getNextParams (row, col) {
      if(col > this.rows[row].length - 1) {
        row = row + 1

        if(row > this.rows.length - 1) {
          row = 0
        }

        col = 0
      }

      return {
        nextId: this.rows[row][col]._id,
        nextName: this.rows[row][col].name
      }
    }
  }
};
</script>

<style lang="scss">
    .breadcrumb-item {
        > select {
            margin: 0 5px;
        }
    }
    .card-link {
        &:hover {
            > .card {
                border-color: #007bff
            }
        }
    }
</style>