<template>
  <div id="characters">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item active" aria-current="page">Characters</li>
      </ol>
    </nav>

    <div class="card">
      <h4 class="card-header">
        <router-link
          class="btn btn-info btn-sm btn-create float-right"
          to="/character/create"
        >
          Add New Character
        </router-link>
        All Characters
      </h4>
      <div class="card-body">
        <table class="table table-hover">
          <thead>
            <tr scope="row">
              <th scope="col">#</th>
              <th scope="col">Image</th>
              <th scope="col">Name</th>
              <th scope="col">HP</th>
              <th scope="col">Attack</th>
              <th scope="col">Defense</th>
              <th scope="col">Sp. Atk</th>
              <th scope="col">Sp. Def</th>
              <th scope="col">Speed</th>
              <th scope="col">Total</th>
              <th scope="col">Generation</th>
              <th scope="col">Types</th>
              <th scope="col">Evolution</th>
              <th scope="col">Name ID</th>
            </tr>
          </thead>
          <tbody>
            <tr
              scope="row"
              v-for="ch in characters.items"
              v-bind:key="ch.character_id"
              v-on:click="onRowClicked(ch.character_id)"
            >
              <td scope="col" class="text-center">{{ ch.character_id }}</td>
              <td scope="col">
                <img v-bind:src="ch.image_url" v-bind:alt="ch.name" />
              </td>
              <td scope="col">{{ ch.name }}</td>
              <td scope="col" class="text-center">{{ ch.hp }}</td>
              <td scope="col" class="text-center">{{ ch.attack }}</td>
              <td scope="col" class="text-center">{{ ch.defense }}</td>
              <td scope="col" class="text-center">{{ ch.special_attack }}</td>
              <td scope="col" class="text-center">{{ ch.special_defense }}</td>
              <td scope="col" class="text-center">{{ ch.speed }}</td>
              <td scope="col" class="text-center">{{ ch.total }}</td>
              <td scope="col" class="text-center">{{ ch.generation }}</td>
              <td scope="col">{{ ch.types }}</td>
              <td scope="col" class="text-center">{{ ch.evolves_from_id }}</td>
              <td scope="col">{{ ch.name_id }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer">
        <nav aria-label="character list pagination">
          <ul class="pagination justify-content-center">
            <li :class="{ 'page-item': true, disabled: page === 1 }">
              <button class="page-link" @click="page--">
                Previous
              </button>
            </li>
            <li
              :class="{ 'page-item': true, active: page === pageNumber }"
              v-for="pageNumber in pages.slice(page - 1, page + 5)"
              v-bind:key="pageNumber"
            >
              <button class="page-link" @click="page = pageNumber">
                {{ pageNumber }}
              </button>
            </li>
            <li :class="{ 'page-item': true, disabled: page >= pages.length }">
              <button
                class="page-link"
                v-if="page < pages.length"
                @click="page++"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import CharactersApi from '@/apis/characters'

export default {
  name: 'CharacterList',
  data () {
    return {
      characters: { items: [] },
      errorMessage: '',
      page: 1,
      pageSize: 5,
      pages: []
    }
  },
  created () {
    this.listCharacters()
  },
  watch: {
    page: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.listCharacters()
      }
    }
  },
  methods: {
    async listCharacters () {
      this.errorMessage = ''
      const filters = {
        limit: this.pageSize,
        offset: (this.page - 1) * this.pageSize
      }
      try {
        this.characters = await CharactersApi.list(filters)
        this.setPages()
      } catch (e) {
        this.errorMessage = e.message
      }
    },
    onRowClicked (id) {
      this.$router.push({ name: 'CharacterEdit', params: { id: id } })
    },
    setPages () {
      const totalPages = Math.ceil(this.characters.total_count / this.pageSize)
      for (let i = 1; i <= totalPages; i++) {
        this.pages.push(i)
      }
    }
  }
}
</script>

<style scoped>
.table td {
  vertical-align: middle;
}
.table td img {
  width: 80px;
  height: 80px;
}
</style>
