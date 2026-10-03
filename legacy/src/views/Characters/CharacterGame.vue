<template>
  <div>
    <b-row v-show="!isEditing">
      <b-col><label style="padding: 0.25rem 0.5rem;">{{ model.name }}</label></b-col>
      <b-col><label style="padding: 0.25rem 0.5rem;">{{ model.generation }}</label></b-col>
      <b-col><label style="padding: 0.25rem 0.5rem;">{{ model.game_character_id }}</label></b-col>
      <b-col>
        <b-button
          variant="info"
          class="mb-2 mr-sm-2 mb-sm-0 inline-primary"
          size="sm"
          v-on:click="onEditClick()">Edit</b-button>
        <b-button
          variant="danger"
          class="inline-secondary"
          size="sm"
          v-on:click="onDeleteClick()">Delete</b-button>
      </b-col>
    </b-row>
    <b-form @submit="onSaveClick" v-show="isEditing">
      <b-row>
        <b-col>
          <!-- <b-form-select
            v-model="model.game_id"
            :options="games"
            size="sm"></b-form-select> -->
            <label style="padding: 0.25rem 0.5rem;">{{ model.name }}</label>
        </b-col>
        <b-col>
          <b-form-input
            v-model="model.generation"
            type="number"
            size="sm"></b-form-input>
        </b-col>
        <b-col>
          <b-form-input
            v-model="model.game_character_id"
            type="number"
            size="sm"></b-form-input>
        </b-col>
        <b-col>
          <b-button
            type="submit"
            variant="primary"
            class="mb-2 mr-sm-2 mb-sm-0 inline-primary"
            size="sm">Save</b-button>
          <b-button
            variant="danger"
            class="inline-secondary"
            size="sm"
            v-on:click="onCancelClick()">Cancel</b-button>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'CharacterGame',
  props: {
    index: {
      type: Number
    },
    item: {
      type: Object
    },
    games: {
      type: Array
    }
  },
  data () {
    return {
      isEditing: false,
      model: { ...this.item }
    }
  },
  methods: {
    onEditClick () {
      this.isEditing = true
    },
    onDeleteClick () {
      this.isEditing = false
      this.$emit('delete', { index: this.index, gameId: this.model.game_id })
    },
    onCancelClick () {
      this.isEditing = false
    },
    onSaveClick (evt) {
      this.isEditing = false
      this.$emit('update', { index: this.index, model: this.model })
    }
  }
}
</script>

<style lang="scss" scoped>
.inline-primary {
  min-width: 50px;
}
.inline-secondary {
  min-width: 60px;
}
</style>
