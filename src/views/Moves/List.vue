<template>
  <div id="moves">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item active" aria-current="page">Moves</li>
      </ol>
    </nav>

    <div class="card">
      <h4 class="card-header">
        <router-link
          class="btn btn-info btn-sm btn-create float-right"
          to="/move/create"
        >
          Add New Move
        </router-link>
        All Moves
      </h4>
      <div class="card-body">
        <table class="table table-hover">
          <thead>
            <tr scope="row">
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col" class="text-center">Generation</th>
              <th scope="col">Type</th>
              <th scope="col" class="text-center">Power</th>
              <th scope="col" class="text-center">Accuracy</th>
              <th scope="col" class="text-center">PP</th>
              <th scope="col">Category</th>
              <th scope="col">Name ID</th>
            </tr>
          </thead>
          <tbody>
            <tr
              scope="row"
              v-for="m in moves.items"
              v-bind:key="m.move_id"
              v-on:click="onRowClicked(m.move_id)"
            >
              <td scope="col">{{ m.move_id }}</td>
              <td scope="col">{{ m.name }}</td>
              <td scope="col" class="text-center">{{ m.generation }}</td>
              <td scope="col">{{ m.type }}</td>
              <td scope="col" class="text-center">{{ m.power }}</td>
              <td scope="col" class="text-center">{{ m.accuracy }}</td>
              <td scope="col" class="text-center">{{ m.pp }}</td>
              <td scope="col">{{ m.category }}</td>
              <td scope="col">{{ m.name_id }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer">
        <nav aria-label="move list pagination">
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
import MovesApi from '@/apis/moves'

export default {
  name: 'MoveList',
  data () {
    return {
      moves: { items: [] },
      errorMessage: '',
      page: 1,
      pageSize: 8,
      pages: []
    }
  },
  async created () {
    await this.listMoves()
  },
  watch: {
    page: async function (newVal, oldVal) {
      if (newVal !== oldVal) {
        await this.listMoves()
      }
    }
  },
  methods: {
    async listMoves () {
      this.errorMessage = ''
      const filters = {
        limit: this.pageSize,
        offset: (this.page - 1) * this.pageSize
      }
      try {
        this.moves = await MovesApi.list(filters)
        this.setPages()
      } catch (e) {
        this.errorMessage = e.message
      }
    },
    onRowClicked (id) {
      this.$router.push({ name: 'MoveEdit', params: { id: id } })
    },
    setPages () {
      const totalPages = Math.ceil(this.moves.total_count / this.pageSize)
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
