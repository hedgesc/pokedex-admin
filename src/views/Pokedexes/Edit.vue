<template>
  <div id="pokedex-edit">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/pokedex/list">Pokédexes</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">{{ id }}</li>
      </ol>
    </nav>
    <div class="row">
      <div class="col-sm">
        <div class="card">
          <h4 class="card-header">
            <button
              type="button"
              class="btn btn-danger btn-sm float-right"
              v-on:click="removePokedex"
            >Delete</button>
            <!-- <b-dropdown size="sm" split text="More Actions" variant="info" class="float-right">
              <b-dropdown-item-button v-on:click="manageGames">Manage Games</b-dropdown-item-button>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item-button variant="danger" v-on:click="removePokedex">Delete</b-dropdown-item-button>
            </b-dropdown>-->
            Editing Pokédex {{ model.game_group_id }}
          </h4>
          <div class="card-body">
            <form>
              <fieldset :disabled="busy">
                <div class="form-group">
                  <label for="inputNameId">Name ID</label>
                  <input
                    type="text"
                    class="form-control form-control-lg"
                    id="inputNameId"
                    v-model="model.name_id"
                  />
                </div>
                <div class="form-group">
                  <label for="inputName">Name</label>
                  <input
                    type="text"
                    class="form-control form-control-lg"
                    id="inputName"
                    v-model="model.name"
                  />
                </div>
                <div class="form-group">
                  <label for="inputAltName">Alternate Name</label>
                  <input
                    type="text"
                    class="form-control form-control-lg"
                    id="inputAltName"
                    v-model="model.alternate_name"
                  />
                </div>
                <div class="form-group">
                  <label for="inputGeneration">Generation</label>
                  <input
                    type="number"
                    class="form-control form-control-lg"
                    id="inputGeneration"
                    v-model="model.generation"
                  />
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
      <div class="col-sm">
        <div class="card">
          <div class="card-header">
            <h4>
              <button
                type="button"
                class="btn btn-info btn-sm float-right"
                v-on:click="manageGames"
              >Manage</button>
              Pokédex Games
            </h4>
          </div>
          <div class="card-body">
            <b-list-group>
              <b-list-group>
                <b-list-group-item v-for="g in games" v-bind:key="g.game_id">
                  <b-badge class="float-right" pill variant="dark">{{ g.generation }}</b-badge>
                  <strong>{{ g.name }}</strong>
                </b-list-group-item>
              </b-list-group>
            </b-list-group>
          </div>
        </div>
      </div>
    </div>
    <div class="row form-actions">
      <div class="col-sm">
        <button
          type="button"
          class="btn btn-primary float-right"
          v-on:click="onSubmit"
          :disabled="busy"
        >Save</button>
        <router-link to="/pokedex/list" class="a-cancel">Back</router-link>
      </div>
      <div class="col-sm"></div>
    </div>
  </div>
</template>

<script>
import PokedexesApi from '@/apis/pokedexes'

export default {
  name: 'PokedexEdit',
  data () {
    return {
      model: {},
      games: [],
      busy: false
    }
  },
  created () {
    this.getPokedex()
    this.getPokedexGames()
  },
  computed: {
    id () {
      return this.$route.params.id
    }
  },
  methods: {
    async getPokedex () {
      this.model = await PokedexesApi.get(this.$route.params.id)
    },
    async getPokedexGames () {
      this.games = await PokedexesApi.listGames(this.id)
    },
    async onSubmit (e) {
      this.busy = true

      try {
        const response = await PokedexesApi.put(
          this.model.game_group_id,
          this.model
        )
        this.$toasted.success(response.data, { icon: 'check_circle_outline' })
      } catch (ex) {
        this.$toasted.error(ex.message, { icon: 'highlight_off' })
      }
      this.busy = false
      e.preventDefault()
    },
    manageGames () {
      this.$router.push({ name: 'PokedexGamesEdit', params: { id: this.id } })
    },
    removePokedex () {
      this.$toasted.show('Are you sure?', {
        duration: null,
        icon: 'contact_support',
        action: [
          {
            text: 'Yes',
            onClick: async (e, toastObject) => {
              toastObject.goAway(0)
              try {
                const response = await PokedexesApi.remove(
                  this.$route.params.id
                )
                this.$toasted.success(response.data, {
                  icon: 'check_circle_outline'
                })
                this.$router.push({ name: 'PokedexList' })
              } catch (ex) {
                this.$toasted.error(ex.message, { icon: 'highlight_off' })
              }
            }
          },
          {
            text: 'No',
            onClick: (e, toastObject) => {
              toastObject.goAway(0)
            }
          }
        ]
      })
    }
  }
}
</script>
