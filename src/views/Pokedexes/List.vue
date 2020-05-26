<template>
  <div id="pokedexes">
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
            </tr>
          </thead>
          <tbody>
            <tr
              scope="row"
              v-for="dex in dexes"
              v-bind:key="dex.game_group_id"
              v-on:click="onRowClicked(dex.game_group_id)"
            >
              <th scope="col">{{ dex.game_group_id }}</th>
              <td scope="col">{{ dex.name_id }}</td>
              <td scope="col">{{ dex.name }}</td>
              <td scope="col">{{ dex.alternate_name }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import PokedexesApi from "@/apis/pokedexes";

export default {
  name: "PokedexList",
  data() {
    return {
      dexes: [],
      errorMessage: ""
    };
  },
  created() {
    this.listPokedexes();
  },
  methods: {
    async listPokedexes() {
      this.errorMessage = "";

      try {
        this.dexes = await PokedexesApi.list();
      } catch (e) {
        this.errorMessage = e.message;
      }
    },
    onRowClicked(id) {
      this.$router.push({ name: "PokedexEdit", params: { id: id } });
    }
  }
};
</script>
