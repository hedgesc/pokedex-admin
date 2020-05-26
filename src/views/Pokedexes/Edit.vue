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
            >
              Delete
            </button>
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
              </fieldset>
            </form>
          </div>
        </div>
      </div>
      <div class="col-sm"></div>
    </div>
    <div class="mt-4">
      <button
        type="button"
        class="btn btn-primary mr-2"
        v-on:click="onSubmit"
        :disabled="busy"
      >
        Save
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary"
        v-on:click="onCancel"
      >
        Back
      </button>
    </div>
  </div>
</template>

<script>
import PokedexesApi from "@/apis/pokedexes";

export default {
  name: "PokedexEdit",
  data() {
    return {
      model: {
        name_id: "",
        name: "",
        alternate_name: ""
      },
      busy: false
    };
  },
  created() {
    this.getPokedex();
  },
  computed: {
    id() {
      return this.$route.params.id;
    }
  },
  methods: {
    async getPokedex() {
      this.model = await PokedexesApi.get(this.$route.params.id);
    },
    onCancel() {
      this.$router.push({ name: "PokedexList" });
    },
    async onSubmit(e) {
      this.busy = true;

      try {
        const response = await PokedexesApi.put(
          this.model.game_group_id,
          this.model
        );
        this.$toasted.success(response.data, { icon: "check_circle_outline" });
      } catch (ex) {
        this.$toasted.error(ex.message, { icon: "highlight_off" });
      }
      this.busy = false;
      e.preventDefault();
    },
    removePokedex() {
      this.$toasted.show("Are you sure?", {
        duration: null,
        icon: "contact_support",
        action: [
          {
            text: "Yes",
            onClick: async (e, toastObject) => {
              toastObject.goAway(0);
              try {
                const response = await PokedexesApi.remove(
                  this.$route.params.id
                );
                this.$toasted.success(response.data, {
                  icon: "check_circle_outline"
                });
                this.$router.push({ name: "PokedexList" });
              } catch (ex) {
                this.$toasted.error(ex.message, { icon: "highlight_off" });
              }
            }
          },
          {
            text: "No",
            onClick: (e, toastObject) => {
              toastObject.goAway(0);
            }
          }
        ]
      });
    }
  }
};
</script>
