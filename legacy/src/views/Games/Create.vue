<template>
  <div id="game-create">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/game/list">Games</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Create</li>
      </ol>
    </nav>
    <div class="row">
      <div class="col-sm">
        <div class="card">
          <h4 class="card-header">
            Create a Game
          </h4>
          <div class="card-body">
            <form>
              <fieldset :disabled="busy">
                <div class="form-group">
                  <label for="inputGeneration">Generation</label>
                  <input
                    type="number"
                    class="form-control form-control-lg"
                    id="inputGeneration"
                    v-model="model.generation"
                  />
                </div>
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
                  <label for="inputRegions">Regions</label>
                  <multiselect
                    v-model="model.regions"
                    :options="regionOptions"
                    :multiple="true"
                    :searchable="false"
                    :hide-selected="true">
                    <template slot="tag" slot-scope="{ option, remove }">
                      <span class="multiselect__tag" :class="option.toLowerCase()">
                        <span>{{ option }}</span> <i aria-hidden="true" tabindex="1" class="multiselect__tag-icon" @click="remove(option)"></i>
                      </span>
                    </template>
                  </multiselect>
                </div>
                <!-- <div class="form-group">
                  <label for="inputAltName">Alternate Name</label>
                  <input type="text" class="form-control form-control-lg" id="inputAltName" v-model="model.alternate_name">
                </div> -->
              </fieldset>
            </form>
          </div>
        </div>
      </div>
      <div class="col-sm"></div>
    </div>
    <div class="row form-actions">
      <div class="col-sm">
        <button
          type="button"
          class="btn btn-primary float-right"
          :disabled="busy"
          v-on:click="onSubmit"
        >
          Create
        </button>
        <router-link to="/game/list" class="a-cancel">Cancel</router-link>
      </div>
      <div class="col-sm"></div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import { Regions } from '@/constants/regions.js'
import GamesApi from '@/apis/games'

export default {
  name: 'GameCreate',
  components: {
    Multiselect
  },
  data () {
    return {
      model: {},
      busy: false,
      regionOptions: Regions
    }
  },
  methods: {
    async onSubmit (e) {
      this.busy = true

      try {
        const response = await GamesApi.post(this.model)
        this.$toasted.success(response.data, {
          icon: 'check_circle_outline'
        })
        this.$router.push({ name: 'GameList' })
      } catch (ex) {
        this.$toasted.error(ex.message, {
          icon: 'highlight_off'
        })
      }
      this.busy = false
      e.preventDefault()
    }
  }
}
</script>
