<template>
  <div id="games">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item active" aria-current="page">Games</li>
      </ol>
    </nav>

    <div class="card">
      <h4 class="card-header">
        <router-link
          class="btn btn-info btn-sm btn-create float-right"
          to="/game/create"
        >
          Add New Game
        </router-link>
        All Games
      </h4>
      <div class="card-body">
        <table class="table table-hover">
          <thead>
            <tr scope="row">
              <th scope="col">#</th>
              <th scope="col">Name ID</th>
              <th scope="col">Name</th>
              <th scope="col">Generation</th>
              <th scope="col">Regions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              scope="row"
              v-for="gm in games"
              v-bind:key="gm.game_id"
              v-on:click="onRowClicked(gm.game_id)"
            >
              <td scope="col">{{ gm.game_id }}</td>
              <td scope="col">{{ gm.name_id }}</td>
              <td scope="col">{{ gm.name }}</td>
              <td scope="col">{{ gm.generation }}</td>
              <td scope="col">{{ gm.regions }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import GamesApi from '@/apis/games'

export default {
  name: 'GameList',
  data () {
    return {
      games: [],
      errorMessage: ''
    }
  },
  created () {
    this.listGames()
  },
  methods: {
    async listGames () {
      this.errorMessage = ''

      try {
        this.games = await GamesApi.list()
      } catch (e) {
        this.errorMessage = e.message
      }
    },
    onRowClicked (id) {
      this.$router.push({ name: 'GameEdit', params: { id: id } })
    }
  }
}
</script>
