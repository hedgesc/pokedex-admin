<template>
  <div>
    <b-row v-show="!isEditing">
      <b-col><label style="padding: 0.25rem 0.5rem;">{{ model.name }}</label></b-col>
      <b-col><label style="padding: 0.25rem 0.5rem;">{{ model.generation }}</label></b-col>
      <b-col><label style="padding: 0.25rem 0.5rem;">{{ model.game_character_id }}</label></b-col>
      <b-col><b-button variant="info" size="sm" v-on:click="onEditClick()">Edit</b-button></b-col>
    </b-row>
    <b-form @submit="onSave" v-show="isEditing">
      <b-row>
        <b-col>
          <b-form-select
            v-model="model.game_id"
            :options="games"
            size="sm"></b-form-select>
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
            size="sm">Save</b-button>
          <b-button
            variant="danger"
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
    onCancelClick () {
      this.isEditing = false
    },
    onSave (evt) {
      console.log(this.model)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
