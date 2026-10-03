<template>
  <div id="move-edit">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/move/list">Moves</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">{{ id }}</li>
      </ol>
    </nav>
    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <h4 class="card-header">
            <button
              type="button"
              class="btn btn-danger btn-sm float-right"
              v-on:click="removeMove"
            >
              Delete
            </button>
            Editing Move {{ model.move_id }}
          </h4>
          <div class="card-body">
            <form>
              <fieldset :disabled="busy">
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="inputName">Name</label>
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      id="inputName"
                      v-model="model.name"
                    />
                  </div>
                  <div class="form-group col-md-6">
                    <label for="inputNameId">Name ID</label>
                    <input
                      type="text"
                      class="form-control form-control-lg"
                      id="inputNameId"
                      v-model="model.name_id"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-3">
                    <label for="inputGeneration">Generation</label>
                    <input
                      type="number"
                      class="form-control form-control-lg"
                      id="inputGeneration"
                      v-model="model.generation"
                    />
                  </div>
                  <div class="form-group col-md-3">
                    <label for="inputPower">Power</label>
                    <input
                      type="number"
                      class="form-control form-control-lg"
                      id="inputPower"
                      v-model="model.power"
                    />
                  </div>
                  <div class="form-group col-md-3">
                    <label for="inputAccuracy">Accuracy</label>
                    <input
                      type="number"
                      class="form-control form-control-lg"
                      id="inputAccuracy"
                      v-model="model.accuracy"
                    />
                  </div>
                  <div class="form-group col-md-3">
                    <label for="inputPP">PP</label>
                    <input
                      type="number"
                      class="form-control form-control-lg"
                      id="inputPP"
                      v-model="model.pp"
                    />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group col-md-6">
                    <label for="inputType">Type</label>
                    <multiselect
                      v-model="model.type"
                      :searchable="false"
                      :options="types"
                      >
                    </multiselect>
                  </div>
                  <div class="form-group col-md-6">
                    <label for="inputCategory">Category</label>
                    <multiselect
                      v-model="model.category"
                      :searchable="false"
                      :options="categories"
                      >
                    </multiselect>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
      <div class="col-sm"></div>
    </div>
    <div class="row form-actions">
      <div class="col-md-8">
        <button
          type="button"
          class="btn btn-primary float-right"
          v-on:click="onSubmit"
          :disabled="busy"
        >
          Save
        </button>
        <router-link to="/move/list" class="a-cancel">Back</router-link>
      </div>
      <div class="col-md-4"></div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import { CharacterTypes } from '@/constants/characterTypes.js'
import { MoveCategories } from '@/constants/moveCategories.js'
import MovesApi from '@/apis/moves'

export default {
  name: 'MoveEdit',
  components: {
    Multiselect
  },
  data () {
    return {
      model: {},
      types: CharacterTypes,
      categories: MoveCategories,
      loaded: false,
      busy: false
    }
  },
  async created () {
    await this.loadMove()
    this.loaded = true
  },
  computed: {
    id () {
      return this.$route.params.id
    }
  },
  methods: {
    async loadMove () {
      this.model = await MovesApi.get(this.$route.params.id)
    },
    async onSubmit (e) {
      this.busy = true

      try {
        const response = await MovesApi.put(this.model.move_id, this.model)
        this.$toasted.success(response.data, { icon: 'check_circle_outline' })
      } catch (ex) {
        this.$toasted.error(ex.message, { icon: 'highlight_off' })
      }

      this.busy = false
      e.preventDefault()
    },
    removeMove () {
      this.$toasted.show('Are you sure?', {
        duration: null,
        icon: 'contact_support',
        action: [
          {
            text: 'Yes',
            onClick: async (e, toastObject) => {
              toastObject.goAway(0)
              try {
                const response = await MovesApi.remove(
                  this.$route.params.id
                )
                this.$toasted.success(response.data, {
                  icon: 'check_circle_outline'
                })
                this.$router.push({ name: 'MoveList' })
              } catch (ex) {
                this.$toasted.error(ex.message, {
                  icon: 'highlight_off'
                })
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
