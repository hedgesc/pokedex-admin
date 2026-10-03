<template>
  <div id="pokedexes">

    <loading
      :active.sync="loading"
      color="#343a40"
      loader="dots"
    ></loading>

    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item active" aria-current="page">Pokédexes</li>
      </ol>
    </nav>

    <div class="card">
      <h4 class="card-header">
        <router-link
          class="btn btn-info btn-sm btn-create float-right"
          to="/pokedex/create"
        >
          Add New Pokédex
        </router-link>
        All Pokédexes
      </h4>
      <div class="card-body">
        <table class="table table-hover">
          <thead>
            <tr scope="row">
              <th scope="col">#</th>
              <th scope="col">Name ID</th>
              <th scope="col">Name</th>
              <th scope="col">Alternate Name</th>
              <th scope="col">Generation</th>
            </tr>
          </thead>
          <tbody>
            <tr
              scope="row"
              v-for="dex in dexes"
              v-bind:key="dex.game_group_id"
              v-on:click="onRowClicked(dex.game_group_id)"
            >
              <td scope="col">{{ dex.game_group_id }}</td>
              <td scope="col">{{ dex.name_id }}</td>
              <td scope="col">{{ dex.name }}</td>
              <td scope="col">{{ dex.alternate_name }}</td>
              <td scope="col">{{ dex.generation }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay'
import PokedexesApi from '@/apis/pokedexes'

export default {
  name: 'PokedexList',
  data () {
    return {
      dexes: [],
      errorMessage: '',
      loading: true
    }
  },
  components: {
    Loading
  },
  async beforeMount () {
    await this.listPokedexes()
    this.loading = false
  },
  methods: {
    onLoaded () {

    },
    async listPokedexes () {
      this.errorMessage = ''

      try {
        this.dexes = await PokedexesApi.list()
      } catch (e) {
        this.errorMessage = e.message
      }
    },
    onRowClicked (id) {
      this.$router.push({ name: 'PokedexEdit', params: { id: id } })
    }
  }
}
</script>
